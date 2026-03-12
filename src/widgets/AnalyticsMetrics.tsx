/* eslint-disable no-restricted-exports */
'use client'

import React, { useEffect, useState } from 'react'

interface ChartDataPoint {
  date: string
  users: number
}

interface AnalyticsData {
  activeUsers: number
  chartData: ChartDataPoint[]
  eventCount: number
  keyEvents: number
  period: string
  totalPageViews: number
  totalUsers: number
}

export default function AnalyticsMetrics({ period = '7days' }: { period?: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/pageviews?period=${period}`)

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
  }, [period])

  if (loading) {
    return (
      <div className="analytics-metrics-widget card" style={{ padding: '24px' }}>
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
            Loading metrics...
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
      <div className="analytics-metrics-widget card" style={{ padding: '24px' }}>
        <div style={{ color: 'var(--theme-error-500)', fontSize: '14px' }}>
          <strong>Error:</strong> {error}
        </div>
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '12px', marginTop: '8px' }}>
          Make sure the Google Analytics API endpoint is configured correctly.
        </div>
      </div>
    )
  }

  const periodLabel =
    period === '30days' ? 'Last 30 days' : period === '90days' ? 'Last 90 days' : 'Last 7 days'

  // Format date for display (YYYYMMDD -> M/D)
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) {
      return dateStr
    }
    const month = parseInt(dateStr.substring(4, 6), 10)
    const day = parseInt(dateStr.substring(6, 8), 10)
    return `${month}/${day}`
  }

  // Format Y-axis values (e.g., 1000 -> 1K)
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  // Calculate chart dimensions and scales
  const chartWidth = 800
  const chartHeight = 200
  const padding = { bottom: 30, left: 50, right: 20, top: 20 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const chartData = data?.chartData || []
  const maxUsers = Math.max(...chartData.map((d) => d.users), 0)
  const yScale = maxUsers > 0 ? plotHeight / maxUsers : 1

  // Generate path for line chart
  const linePath = chartData
    .map((point, index) => {
      const x = padding.left + (index / Math.max(chartData.length - 1, 1)) * plotWidth
      const y = padding.top + plotHeight - point.users * yScale
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  // Generate Y-axis ticks
  const yTicks = [0, maxUsers * 0.25, maxUsers * 0.5, maxUsers * 0.75, maxUsers]

  return (
    <div
      className="analytics-metrics-widget card"
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
          Analytics Overview
        </h3>
        <p style={{ color: 'var(--theme-elevation-400)', fontSize: '13px', margin: 0 }}>
          {periodLabel}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            borderRadius: '8px',
            minWidth: '150px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: 'var(--theme-elevation-400)',
              fontSize: '11px',
              fontWeight: 500,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Active Users
          </div>
          <div style={{ color: 'var(--theme-text)', fontSize: '24px', fontWeight: 700 }}>
            {data?.activeUsers?.toLocaleString() || '0'}
          </div>
        </div>
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            borderRadius: '8px',
            minWidth: '150px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: 'var(--theme-elevation-400)',
              fontSize: '11px',
              fontWeight: 500,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Total Users
          </div>
          <div style={{ color: 'var(--theme-text)', fontSize: '24px', fontWeight: 700 }}>
            {data?.totalUsers?.toLocaleString() || '0'}
          </div>
        </div>
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            borderRadius: '8px',
            minWidth: '150px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: 'var(--theme-elevation-400)',
              fontSize: '11px',
              fontWeight: 500,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Page Views
          </div>
          <div style={{ color: 'var(--theme-text)', fontSize: '24px', fontWeight: 700 }}>
            {data?.totalPageViews?.toLocaleString() || '0'}
          </div>
        </div>
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            borderRadius: '8px',
            minWidth: '150px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: 'var(--theme-elevation-400)',
              fontSize: '11px',
              fontWeight: 500,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Event Count
          </div>
          <div style={{ color: 'var(--theme-text)', fontSize: '24px', fontWeight: 700 }}>
            {data?.eventCount?.toLocaleString() || '0'}
          </div>
        </div>
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            borderRadius: '8px',
            minWidth: '150px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: 'var(--theme-elevation-400)',
              fontSize: '11px',
              fontWeight: 500,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Key Events
          </div>
          <div style={{ color: 'var(--theme-text)', fontSize: '24px', fontWeight: 700 }}>
            {data?.keyEvents?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div
          style={{
            background: 'var(--theme-elevation-100)',
            borderRadius: '8px',
            marginTop: '15px',
            padding: '20px',
          }}
        >
          <svg height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
            {/* Y-axis grid lines and labels */}
            {yTicks.map((tick, index) => {
              const y = padding.top + plotHeight - tick * yScale
              return (
                <g key={index}>
                  <line
                    stroke="var(--theme-elevation-150)"
                    strokeWidth="1"
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                  />
                  <text
                    fill="var(--theme-elevation-500)"
                    fontSize="11"
                    textAnchor="end"
                    x={padding.left - 8}
                    y={y + 4}
                  >
                    {formatYAxis(tick)}
                  </text>
                </g>
              )
            })}

            {/* X-axis labels */}
            {chartData.map((point, index) => {
              const x = padding.left + (index / Math.max(chartData.length - 1, 1)) * plotWidth
              return (
                <text
                  fill="var(--theme-elevation-500)"
                  fontSize="11"
                  key={index}
                  textAnchor="middle"
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                >
                  {formatDate(point.date)}
                </text>
              )
            })}

            {/* Line path */}
            <path d={linePath} fill="none" stroke="#4285f4" strokeWidth="2" />

            {/* Data points */}
            {chartData.map((point, index) => {
              const x = padding.left + (index / Math.max(chartData.length - 1, 1)) * plotWidth
              const y = padding.top + plotHeight - point.users * yScale
              return <circle cx={x} cy={y} fill="#4285f4" key={index} r="4" />
            })}
          </svg>
        </div>
      )}
    </div>
  )
}
