# Quick Start Guide

Get up and running with Google Analytics widgets in your Payload dashboard in 5 minutes.

## 1. Install

```bash
pnpm add @payloadcms/plugin-google-analytics
```

## 2. Copy API Routes

```bash
cp -r node_modules/@payloadcms/plugin-google-analytics/dist/api/analytics src/app/api/
```

## 3. Add to Config

```typescript
// payload.config.ts
import { googleAnalytics } from '@payloadcms/plugin-google-analytics'

export default buildConfig({
  plugins: [
    googleAnalytics({
      defaultLayout: [
        { widgetSlug: 'active-users', width: 'x-small' },
        { widgetSlug: 'channel-groups', width: 'x-small' },
        { widgetSlug: 'analytics-overview', width: 'medium' },
        { widgetSlug: 'top-pages', width: 'full' },
      ],
    }),
  ],
})
```

## 4. Set Environment Variables

```bash
# .env.local
GA_PROPERTY_ID=123456789
GA_CREDENTIALS=<base64-encoded-service-account-json>
```

### Get Your Credentials

1. **Google Cloud Console**: Enable Google Analytics Data API
2. **Create Service Account**: Download JSON key
3. **Encode to Base64**:
   ```bash
   cat service-account-key.json | base64
   ```
4. **Add to GA4**: Add service account email as Viewer

## 5. Start Your Server

```bash
pnpm dev
```

Visit your Payload admin dashboard - the analytics widgets will appear!

## Demo Mode (Optional)

To test without real data:

```bash
# .env.local
GA_USE_DEMO_DATA=true
```

## Need Help?

See the full [README.md](./README.md) for detailed setup instructions.
