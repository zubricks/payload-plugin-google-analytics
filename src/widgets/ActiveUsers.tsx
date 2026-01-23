/* eslint-disable no-restricted-exports */
'use client'

import { type WidgetServerProps } from 'payload'
import React, { useEffect, useState } from 'react'

interface Location {
  activeUsers: number
  country: string
}

interface ActiveUsersData {
  locations: Location[]
  timestamp: string
  totalActiveUsers: number
}

export default function ActiveUsers(_props: WidgetServerProps) {
  const [data, setData] = useState<ActiveUsersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('/api/analytics/active-users')

        if (!response.ok) {
          throw new Error('Failed to fetch active users data')
        }

        const activeUsersData = await response.json()
        setData(activeUsersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load active users')
        console.error('Error fetching active users:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchActiveUsers()

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      void fetchActiveUsers()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="active-users-widget card" style={{ padding: '24px' }}>
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
            Loading active users...
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
      <div className="active-users-widget card" style={{ padding: '24px' }}>
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
    <div
      className="active-users-widget card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: '12px', marginBottom: '4px' }}>
          <h3 style={{ color: 'var(--theme-text)', fontSize: '18px', fontWeight: 600, margin: 0 }}>
            Active Users
          </h3>
          <div
            style={{
              animation: 'pulse 2s ease-in-out infinite',
              background: '#4caf50',
              borderRadius: '50%',
              height: '8px',
              width: '8px',
            }}
          />
        </div>
        <p style={{ color: 'var(--theme-elevation-400)', fontSize: '13px', margin: 0 }}>
          Last updated: {data?.timestamp ? formatTime(data.timestamp) : 'N/A'}
        </p>
      </div>

      <div
        style={{
          background: 'var(--theme-elevation-50)',
          borderRadius: '8px',
          marginBottom: '24px',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--theme-elevation-400)',
            fontSize: '13px',
            marginBottom: '15px',
            textTransform: 'uppercase',
          }}
        >
          Active Right Now
        </div>
        <div style={{ color: 'var(--theme-text)', fontSize: '48px', fontWeight: 700 }}>
          {data?.totalActiveUsers?.toLocaleString() || '0'}
        </div>
        <div style={{ color: 'var(--theme-elevation-500)', fontSize: '12px', marginTop: '12px' }}>
          users online
        </div>
      </div>

      {data?.locations && data.locations.length > 0 && (
        <div>
          <h4
            style={{
              color: 'var(--theme-text)',
              fontSize: '14px',
              fontWeight: 600,
              margin: 0,
              marginBottom: '12px',
            }}
          >
            Top Locations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.locations.map((location, index) => {
              const percentage =
                data.totalActiveUsers > 0
                  ? ((location.activeUsers / data.totalActiveUsers) * 100).toFixed(0)
                  : '0'

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
                    <span style={{ color: 'var(--theme-text)', fontSize: '13px', fontWeight: 500 }}>
                      {location.country}
                    </span>
                    <span style={{ color: 'var(--theme-text)', fontSize: '14px', fontWeight: 600 }}>
                      {location.activeUsers}
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
                        background: '#4285f4',
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
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
