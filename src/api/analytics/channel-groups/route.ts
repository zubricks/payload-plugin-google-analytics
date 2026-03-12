import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MOCK_CHANNEL_GROUPS } from '../mockData'

// Google Analytics Data API types
interface AnalyticsRow {
  dimensionValues?: Array<{ value: string }>
  metricValues?: Array<{ value: string }>
}

interface AnalyticsResponse {
  rows?: AnalyticsRow[]
  rowCount?: number
}

const periodToDateRange = (period: string): string => {
  if (period === '30days') return '30daysAgo'
  if (period === '90days') return '90daysAgo'
  return '7daysAgo'
}

const periodToLabel = (period: string): string => {
  if (period === '30days') return 'Last 30 days'
  if (period === '90days') return 'Last 90 days'
  return 'Last 7 days'
}

export async function GET(request: NextRequest) {
  try {
    // Check for demo mode
    const useDemoData = process.env.GA_USE_DEMO_DATA === 'true'

    if (useDemoData) {
      return NextResponse.json(MOCK_CHANNEL_GROUPS)
    }

    const period = request.nextUrl.searchParams.get('period') ?? '7days'
    const startDate = periodToDateRange(period)
    const periodLabel = periodToLabel(period)

    const propertyId = process.env.GA_PROPERTY_ID
    const credentials = process.env.GA_CREDENTIALS

    if (!propertyId || !credentials) {
      return NextResponse.json(
        {
          error: 'Google Analytics not configured',
          message: 'Please set GA_PROPERTY_ID and GA_CREDENTIALS environment variables',
        },
        { status: 500 },
      )
    }

    // Parse credentials from base64 encoded JSON
    let credentialsJson
    try {
      credentialsJson = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'))
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Invalid credentials format',
          message: 'GA_CREDENTIALS must be base64 encoded JSON',
        },
        { status: 500 },
      )
    }

    // Get access token using service account credentials
    const accessToken = await getAccessToken(credentialsJson)

    // Fetch channel group data
    const channelData = await fetchChannelData(propertyId, accessToken, startDate, periodLabel)

    return NextResponse.json(channelData)
  } catch (error) {
    console.error('Error fetching channel group data:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch channel data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

async function getAccessToken(credentials: {
  client_email: string
  private_key: string
  token_uri?: string
}): Promise<string> {
  const scope = 'https://www.googleapis.com/auth/analytics.readonly'
  const now = Math.floor(Date.now() / 1000)
  const expiry = now + 3600 // 1 hour

  // Create JWT
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const claimSet = {
    iss: credentials.client_email,
    scope,
    aud: credentials.token_uri || 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now,
  }

  // Use Web Crypto API to sign JWT
  const encoder = new TextEncoder()
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const claimSetB64 = base64UrlEncode(JSON.stringify(claimSet))
  const signatureInput = `${headerB64}.${claimSetB64}`

  // Import private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(credentials.private_key),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )

  // Sign
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(signatureInput),
  )

  const signatureB64 = base64UrlEncode(signature)
  const jwt = `${signatureInput}.${signatureB64}`

  // Exchange JWT for access token
  const tokenResponse = await fetch(
    credentials.token_uri || 'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    },
  )

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    throw new Error(`Failed to get access token: ${errorText}`)
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

async function fetchChannelData(propertyId: string, accessToken: string, startDate: string, periodLabel: string) {
  // Fetch sessions by primary channel group
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [
          {
            startDate,
            endDate: 'today',
          },
        ],
        dimensions: [
          {
            name: 'sessionDefaultChannelGroup',
          },
        ],
        metrics: [
          {
            name: 'sessions',
          },
        ],
        orderBys: [
          {
            metric: {
              metricName: 'sessions',
            },
            desc: true,
          },
        ],
        limit: 7,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GA4 API request failed: ${errorText}`)
  }

  const data: AnalyticsResponse = await response.json()

  // Process channel group data
  const channels =
    data.rows?.map((row) => ({
      channel: row.dimensionValues?.[0]?.value || 'Unknown',
      sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
    })) || []

  const totalSessions = channels.reduce((sum, ch) => sum + ch.sessions, 0)

  return {
    channels,
    totalSessions,
    period: periodLabel,
    timestamp: new Date().toISOString(),
  }
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binary = atob(pemContents)
  const buffer = new ArrayBuffer(binary.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i)
  }
  return buffer
}

function base64UrlEncode(data: string | ArrayBuffer): string {
  let base64: string
  if (typeof data === 'string') {
    base64 = btoa(data)
  } else {
    const bytes = new Uint8Array(data)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    base64 = btoa(binary)
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
