/* eslint-disable no-restricted-exports */
'use client'

import { type WidgetServerProps } from 'payload'
import React, { useEffect, useState } from 'react'

interface Channel {
  channel: string
  sessions: number
}

interface ChannelData {
  channels: Channel[]
  period: string
  timestamp: string
  totalSessions: number
}

export default function ChannelGroups(_props: WidgetServerProps) {
  const [data, setData] = useState<ChannelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await fetch('/api/analytics/channel-groups')

        if (!response.ok) {
          throw new Error('Failed to fetch channel data')
        }

        const channelData = await response.json()
        setData(channelData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load channel data')
        console.error('Error fetching channel data:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchChannelData()
  }, [])

  if (loading) {
    return (
      <div className="channel-groups-widget card" style={{ padding: '24px' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <div
            style={{
              animation: 'spin 1s linear infinite',
              border: '2px solid var(--theme-elevation-150)',
              borderRadius: '50%',
              borderTopColor: 'var(--theme-text)',
              height: '20px',
              width: '20px',
            }}
          />
          <span style={{ color: 'var(--theme-elevation-400)', fontSize: '14px' }}>
            Loading channels...
          </span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="channel-groups-widget card" style={{ padding: '24px' }}>
        <div style={{ color: 'var(--theme-error-500)', fontSize: '14px' }}>
          <strong>Error:</strong> {error}
        </div>
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '12px', marginTop: '8px' }}>
          Make sure the Google Analytics API endpoint is configured correctly.
        </div>
      </div>
    )
  }

  // Channel colors mapping
  const channelColors: Record<string, string> = {
    Direct: '#4285f4',
    'Organic Search': '#34a853',
    'Organic Social': '#ea4335',
    'Organic Video': '#fbbc04',
    'Paid Search': '#9334e6',
    Referral: '#ff6d01',
    Unassigned: '#999999',
  }

  return (
    <div
      className="channel-groups-widget card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            color: 'var(--theme-text)',
            fontSize: '18px',
            fontWeight: 600,
            margin: 0,
            marginBottom: '4px',
          }}
        >
          Sessions by Channel
        </h3>
        <p style={{ color: 'var(--theme-elevation-400)', fontSize: '13px', margin: 0 }}>
          {data?.period || 'Last 7 days'}
        </p>
      </div>

      <div
        style={{
          background: 'var(--theme-elevation-50)',
          borderRadius: '8px',
          marginBottom: '20px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--theme-elevation-400)',
            fontSize: '11px',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          Total Sessions
        </div>
        <div style={{ color: 'var(--theme-text)', fontSize: '32px', fontWeight: 700 }}>
          {data?.totalSessions?.toLocaleString() || '0'}
        </div>
      </div>

      {data?.channels && data.channels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.channels.map((channel, index) => {
            const percentage =
              data.totalSessions > 0
                ? ((channel.sessions / data.totalSessions) * 100).toFixed(1)
                : '0'

            const color = channelColors[channel.channel] || '#999999'

            return (
              <div
                key={index}
                style={{
                  background: 'var(--theme-elevation-100)',
                  borderRadius: '4px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                    <div
                      style={{
                        background: color,
                        borderRadius: '3px',
                        height: '12px',
                        width: '12px',
                      }}
                    />
                    <span style={{ color: 'var(--theme-text)', fontSize: '13px', fontWeight: 500 }}>
                      {channel.channel}
                    </span>
                  </div>
                  <span style={{ color: 'var(--theme-elevation-400)', fontSize: '12px' }}>
                    {channel.sessions.toLocaleString()} ({percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--theme-elevation-150)',
                    borderRadius: '4px',
                    height: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: color,
                      height: '100%',
                      transition: 'width 0.3s ease',
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
