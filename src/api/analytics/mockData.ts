// Mock data for Google Analytics widgets
// Used when GA_USE_DEMO_DATA=true environment variable is set.
//
// The metric/chart/session values scale with the selected period so demo mode
// visibly responds to the widget's inline period selector, mirroring how live
// GA data changes across 7 / 30 / 90 day ranges.

const periodToDays = (period: string): number => {
  if (period === '30days') return 30
  if (period === '90days') return 90
  return 7
}

const periodToLabel = (period: string): string => {
  if (period === '30days') return 'Last 30 days'
  if (period === '90days') return 'Last 90 days'
  return 'Last 7 days'
}

// Baseline (7-day) values; longer periods scale up proportionally.
const BASE_METRICS = {
  activeUsers: 12547,
  eventCount: 523891,
  keyEvents: 8934,
  totalPageViews: 189432,
  totalUsers: 45823,
}

const BASE_TOP_PAGES = [
  { page: '/', views: 45678 },
  { page: '/blog/web-development-trends-2026', views: 34567 },
  { page: '/products/featured-item', views: 28934 },
  { page: '/blog/performance-optimization-guide', views: 23456 },
  { page: '/services', views: 19876 },
  { page: '/blog/mobile-first-design', views: 17654 },
  { page: '/products/category/electronics', views: 15432 },
  { page: '/resources/tutorials', views: 13298 },
  { page: '/about', views: 11987 },
  { page: '/contact', views: 9876 },
]

const BASE_CHANNELS = [
  { channel: 'Organic Search', sessions: 34567 },
  { channel: 'Direct', sessions: 18934 },
  { channel: 'Referral', sessions: 8234 },
  { channel: 'Organic Social', sessions: 3456 },
  { channel: 'Paid Search', sessions: 1789 },
  { channel: 'Organic Video', sessions: 654 },
  { channel: 'Unassigned', sessions: 211 },
]

// Build one daily point per day in the range, ending today. Uses a smooth
// deterministic wave (no randomness) so the trend line looks natural and is
// stable across renders.
const buildChartData = (days: number): Array<{ date: string; users: number }> => {
  const points: Array<{ date: string; users: number }> = []
  const today = new Date()

  for (let offset = days - 1; offset >= 0; offset--) {
    const day = new Date(today)
    day.setDate(today.getDate() - offset)

    const yyyy = day.getFullYear()
    const mm = String(day.getMonth() + 1).padStart(2, '0')
    const dd = String(day.getDate()).padStart(2, '0')

    const wave = Math.round(Math.sin(offset / 2) * 1500)
    const trend = (days - offset) * 20
    points.push({ date: `${yyyy}${mm}${dd}`, users: 12000 + wave + trend })
  }

  return points
}

export const getMockAnalyticsMetrics = (period: string = '7days') => {
  const days = periodToDays(period)
  const factor = days / 7
  const scale = (value: number) => Math.round(value * factor)

  return {
    // "Active users" is a right-now snapshot, so it does not scale with range.
    activeUsers: BASE_METRICS.activeUsers,
    chartData: buildChartData(days),
    eventCount: scale(BASE_METRICS.eventCount),
    keyEvents: scale(BASE_METRICS.keyEvents),
    period: periodToLabel(period),
    topPages: BASE_TOP_PAGES.map((entry) => ({ ...entry, views: scale(entry.views) })),
    totalPageViews: scale(BASE_METRICS.totalPageViews),
    totalUsers: scale(BASE_METRICS.totalUsers),
  }
}

export const getMockChannelGroups = (period: string = '7days') => {
  const days = periodToDays(period)
  const factor = days / 7
  const channels = BASE_CHANNELS.map((entry) => ({
    ...entry,
    sessions: Math.round(entry.sessions * factor),
  }))

  return {
    channels,
    period: periodToLabel(period),
    timestamp: new Date().toISOString(),
    totalSessions: channels.reduce((sum, channel) => sum + channel.sessions, 0),
  }
}

// Active users is a real-time snapshot with no period dimension.
export const MOCK_ACTIVE_USERS = {
  locations: [
    { activeUsers: 423, country: 'United States' },
    { activeUsers: 189, country: 'United Kingdom' },
    { activeUsers: 235, country: 'Germany' },
  ],
  timestamp: new Date().toISOString(),
  totalActiveUsers: 847,
}
