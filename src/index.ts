import type { Config, Plugin } from 'payload'

export interface GoogleAnalyticsPluginConfig {
  /**
   * Google Analytics GA4 Property ID
   * @example "123456789"
   */
  propertyId?: string

  /**
   * Base64 encoded Google Service Account credentials JSON
   * Required for connecting to Google Analytics Data API
   */
  credentials?: string

  /**
   * Enable demo mode to display mock data instead of real analytics
   * @default false
   */
  useDemoData?: boolean

  /**
   * Widgets to enable. By default, all widgets are enabled.
   * @default ['analytics-overview', 'top-pages', 'active-users', 'channel-groups']
   */
  enabledWidgets?: Array<'analytics-overview' | 'top-pages' | 'active-users' | 'channel-groups'>

  /**
   * Default dashboard layout configuration
   * If not provided, widgets will be added but not included in default layout
   */
  defaultLayout?: Array<{
    widgetSlug: string
    width?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'full'
    data?: Record<string, unknown>
  }>
}

export const googleAnalytics =
  (pluginConfig: GoogleAnalyticsPluginConfig = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      enabledWidgets = ['analytics-overview', 'top-pages', 'active-users', 'channel-groups'],
      defaultLayout,
    } = pluginConfig

    const periodField = {
      name: 'period',
      type: 'select' as const,
      defaultValue: '7days',
      label: 'Time Period',
      options: [
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'Last 90 days', value: '90days' },
      ],
    }

    // Widget definitions
    const widgetDefinitions = {
      'analytics-overview': {
        slug: 'analytics-overview',
        Component: '@zubricks/plugin-google-analytics/widgets/AnalyticsMetricsWrapper#default',
        fields: [periodField],
        label: 'Analytics Overview',
        minWidth: 'medium' as const,
      },
      'top-pages': {
        slug: 'top-pages',
        Component: '@zubricks/plugin-google-analytics/widgets/AnalyticsTopPagesWrapper#default',
        fields: [periodField],
        label: 'Top Pages',
        minWidth: 'medium' as const,
      },
      'active-users': {
        slug: 'active-users',
        Component: '@zubricks/plugin-google-analytics/widgets/ActiveUsers#default',
        label: 'Active Users',
        minWidth: 'x-small' as const,
      },
      'channel-groups': {
        slug: 'channel-groups',
        Component: '@zubricks/plugin-google-analytics/widgets/ChannelGroupsWrapper#default',
        fields: [periodField],
        label: 'Sessions by Channel',
        minWidth: 'x-small' as const,
      },
    }

    // Filter widgets based on enabledWidgets config
    const widgets = enabledWidgets.map((widgetKey) => widgetDefinitions[widgetKey]).filter(Boolean)

    // Merge with existing config
    const config: Config = {
      ...incomingConfig,
      admin: {
        ...incomingConfig.admin,
        dashboard: {
          ...incomingConfig.admin?.dashboard,
          // Add widgets to existing dashboard widgets
          widgets: [...(incomingConfig.admin?.dashboard?.widgets || []), ...widgets],
          // If defaultLayout is provided in plugin config, merge it
          ...(defaultLayout && {
            defaultLayout: [
              ...(Array.isArray(incomingConfig.admin?.dashboard?.defaultLayout)
                ? incomingConfig.admin.dashboard.defaultLayout
                : []),
              ...defaultLayout.map(({ widgetSlug, width, data }) => ({
                widgetSlug,
                width: (width ?? 'medium') as 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'full',
                ...(data && { data }),
              })),
            ],
          }),
        },
      } as Config['admin'],
      // Store plugin config in a custom field for API routes to access
      custom: {
        ...incomingConfig.custom,
        googleAnalytics: {
          propertyId: pluginConfig.propertyId || process.env.GA_PROPERTY_ID,
          credentials: pluginConfig.credentials || process.env.GA_CREDENTIALS,
          useDemoData: pluginConfig.useDemoData ?? process.env.GA_USE_DEMO_DATA === 'true',
        },
      },
    }

    return config
  }

export * from './exports/types'
