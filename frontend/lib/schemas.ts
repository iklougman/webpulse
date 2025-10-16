import { z } from 'zod'

export const SiteSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Site name is required'),
  url: z.string().url('Invalid URL'),
  checkInterval: z.number().min(60, 'Minimum interval is 60 seconds'),
  timeout: z.number().min(5).max(30),
  thresholds: z.object({
    uptimePercent: z.number().min(0).max(100),
    maxLatency: z.number().min(100),
    seoScore: z.number().min(0).max(100),
  }),
  queryParams: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).max(3, 'Maximum 3 query parameters allowed'),
  healthEndpoint: z.string().optional(),
  enabled: z.boolean().default(true),
})

export const CheckResultSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  timestamp: z.string(),
  status: z.enum(['UP', 'DOWN', 'TIMEOUT']),
  responseTime: z.number(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
  seoScore: z.number().optional(),
})

export const IncidentSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  type: z.enum(['PAGE_DOWN', 'HEALTH_FAIL', '3G_SLOW', '4G_SLOW', 'SEO_DROP']),
  status: z.enum(['ACTIVE', 'RESOLVED']),
  startedAt: z.string(),
  resolvedAt: z.string().optional(),
  message: z.string(),
})

export const NotificationRuleSchema = z.object({
  id: z.string().optional(),
  siteId: z.string().optional(),
  type: z.enum(['PAGE_DOWN', 'HEALTH_FAIL', '3G_SLOW', '4G_SLOW', 'SEO_DROP']),
  enabled: z.boolean().default(true),
  channels: z.array(z.enum(['EMAIL', 'SLACK', 'WEBHOOK'])),
  webhookUrl: z.string().url().optional(),
  slackChannel: z.string().optional(),
})

export type Site = z.infer<typeof SiteSchema>
export type CheckResult = z.infer<typeof CheckResultSchema>
export type Incident = z.infer<typeof IncidentSchema>
export type NotificationRule = z.infer<typeof NotificationRuleSchema>
