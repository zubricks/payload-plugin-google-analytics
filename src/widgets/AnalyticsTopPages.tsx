/* eslint-disable no-restricted-exports */
'use client'

import { type WidgetServerProps } from 'payload'
import React, { useEffect, useState } from 'react'

interface PageView {
  page: string
  views: number
}

interface AnalyticsData {
  period: string
  topPages: PageView[]
}

export default function AnalyticsTopPages(_props: WidgetServerProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/pageviews')

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }

        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="analytics-top-pages-widget card" style={{ padding: '24px' }}>
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
            Loading top pages...
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
      <div className="analytics-top-pages-widget card" style={{ padding: '24px' }}>
        <div style={{ color: 'var(--theme-error-500)', fontSize: '14px' }}>
          <strong>Error:</strong> {error}
        </div>
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '12px', marginTop: '8px' }}>
          Make sure the Google Analytics API endpoint is configured correctly.
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-top-pages-widget card" style={{ height: '100%', padding: '24px' }}>
      {data?.topPages && data.topPages.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <h3
            style={{
              color: 'var(--theme-text)',
              fontSize: '16px',
              fontWeight: 600,
              margin: 0,
              marginBottom: '16px',
            }}
          >
            Top Pages · {data?.period || 'Last 7 days'}
          </h3>
          {data.topPages.map((page, index) => (
            <div
              key={index}
              style={{
                alignItems: 'center',
                background: 'var(--theme-elevation-100)',
                borderRadius: '4px',
                display: 'flex',
                fontSize: '13px',
                justifyContent: 'space-between',
                padding: '12px',
              }}
            >
              <div style={{ alignItems: 'center', display: 'flex', flex: 1, gap: '12px' }}>
                <span
                  style={{
                    background: 'var(--theme-elevation-150)',
                    borderRadius: '4px',
                    color: 'var(--theme-elevation-500)',
                    fontSize: '11px',
                    fontWeight: 600,
                    minWidth: '24px',
                    padding: '4px 6px',
                    textAlign: 'center',
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    color: 'var(--theme-text)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={page.page}
                >
                  {page.page}
                </span>
              </div>
              <span
                style={{
                  color: 'var(--theme-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginLeft: '16px',
                }}
              >
                {page.views.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            color: 'var(--theme-elevation-400)',
            fontSize: '14px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          No page view data available
        </div>
      )}
    </div>
  )
}
