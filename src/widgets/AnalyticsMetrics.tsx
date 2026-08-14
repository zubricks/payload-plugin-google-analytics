/* eslint-disable no-restricted-exports */
'use client'

import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PeriodSelect, periodLabel } from './PeriodSelect.js'

import './AnalyticsMetrics.scss'

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

export default function AnalyticsMetrics({ period: initialPeriod = '7days' }: { period?: string }) {
  const [period, setPeriod] = useState(initialPeriod)
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
      <div className="analytics-overview card" style={{ padding: '24px' }}>
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
      <div className="analytics-overview card" style={{ padding: '24px' }}>
        <div style={{ color: 'var(--theme-error-500)', fontSize: '14px' }}>
          <strong>Error:</strong> {error}
        </div>
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '12px', marginTop: '8px' }}>
          Make sure the Google Analytics API endpoint is configured correctly.
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) {
      return dateStr
    }

    const month = parseInt(dateStr.substring(4, 6), 10)
    const day = parseInt(dateStr.substring(6, 8), 10)
    return `${month}/${day}`
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const chartData = data?.chartData || []

  const metrics = [
    { label: 'Active Users', value: data?.activeUsers },
    { label: 'Total Users', value: data?.totalUsers },
    { label: 'Page Views', value: data?.totalPageViews },
    { label: 'Event Count', value: data?.eventCount },
    { label: 'Key Events', value: data?.keyEvents },
  ]

  return (
    <div className="analytics-overview card">
      <div className="analytics-overview__header">
        <div>
          <h3 className="analytics-overview__title">Analytics Overview</h3>
          <p className="analytics-overview__subtitle">{periodLabel(period)}</p>
        </div>
        <PeriodSelect onChange={setPeriod} value={period} />
      </div>

      <div className="analytics-overview__metrics">
        {metrics.map((metric) => (
          <div className="analytics-overview__metric-card" key={metric.label}>
            <div className="analytics-overview__metric-label">{metric.label}</div>
            <div className="analytics-overview__metric-value">
              {metric.value?.toLocaleString() || '0'}
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="analytics-overview__chart">
          <ResponsiveContainer height={280} width="100%">
            <LineChart data={chartData} margin={{ bottom: 5, left: 10, right: 20, top: 5 }}>
              <CartesianGrid stroke="var(--theme-elevation-100)" strokeDasharray="3 3" />
              <XAxis
                axisLine={{ stroke: 'var(--theme-elevation-150)' }}
                dataKey="date"
                tick={{ fill: 'var(--theme-elevation-500)', fontSize: 11 }}
                tickFormatter={formatDate}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: 'var(--theme-elevation-500)', fontSize: 11 }}
                tickFormatter={formatYAxis}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--theme-elevation-0)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number) => [value.toLocaleString(), 'Users']}
                labelFormatter={formatDate}
              />
              <Line
                activeDot={{ r: 4 }}
                dataKey="users"
                dot={false}
                name="Users"
                stroke="#4285f4"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
