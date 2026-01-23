export type { GoogleAnalyticsPluginConfig } from '../index'

// Widget data types
export interface ChartDataPoint {
  date: string
  users: number
}

export interface PageView {
  page: string
  views: number
}

export interface AnalyticsMetricsData {
  activeUsers: number
  totalUsers: number
  totalPageViews: number
  eventCount: number
  keyEvents: number
  period: string
  chartData: ChartDataPoint[]
  topPages: PageView[]
}

export interface Location {
  country: string
  activeUsers: number
}

export interface ActiveUsersData {
  totalActiveUsers: number
  locations: Location[]
  timestamp: string
}

export interface Channel {
  channel: string
  sessions: number
}

export interface ChannelGroupsData {
  totalSessions: number
  period: string
  timestamp: string
  channels: Channel[]
}
