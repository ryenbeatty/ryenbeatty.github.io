import { z } from 'astro:content'

export const outpostBuiltInPanelKeys = [
  'weather-radar',
  'chart-plotter',
  'lidar',
  'meters',
  'telemetry',
] as const

export type OutpostBuiltInPanelKey = (typeof outpostBuiltInPanelKeys)[number]

export const outpostBuiltInPanelKeySchema = z.enum(outpostBuiltInPanelKeys)

/** @deprecated use OutpostBuiltInPanelKey */
export type OutpostPanelKey = OutpostBuiltInPanelKey

export const outpostVideoPanelSchema = z.object({
  type: z.literal('video'),
  url: z.string().min(1),
})

export const outpostPanelConfigSchema = z.union([
  outpostBuiltInPanelKeySchema,
  outpostVideoPanelSchema,
])

export type OutpostPanelConfig = z.infer<typeof outpostPanelConfigSchema>
export type OutpostVideoPanel = z.infer<typeof outpostVideoPanelSchema>

export const modeVisibilitySchema = z.object({
  default: z.boolean().optional(),
  outpost: z.boolean().optional(),
})

export type ModeVisibility = z.infer<typeof modeVisibilitySchema>

export function resolveModeVisibility(
  tileVisibility: ModeVisibility | undefined,
  projectVisibility: ModeVisibility | undefined,
): { default: boolean; outpost: boolean } {
  return {
    default: tileVisibility?.default ?? projectVisibility?.default ?? true,
    outpost: tileVisibility?.outpost ?? projectVisibility?.outpost ?? true,
  }
}

export function isBuiltInOutpostPanel(
  config: OutpostPanelConfig,
): config is OutpostBuiltInPanelKey {
  return typeof config === 'string'
}

export function isVideoOutpostPanel(
  config: OutpostPanelConfig,
): config is OutpostVideoPanel {
  return typeof config === 'object' && config.type === 'video'
}
