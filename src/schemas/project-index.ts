import { z } from 'astro:content'
import {
  modeVisibilitySchema,
  outpostPanelConfigSchema,
} from './project-outpost'

export const tileWidth = z.enum(['full', 'half', 'third'])
export const tileHeight = z.enum(['short', 'regular', 'tall'])

export const projectIndexTileSchema = z.object({
  project: z.string(),
  width: tileWidth.default('full'),
  height: tileHeight.default('regular'),
  /** Overrides the project's default outpost panel for this tile */
  outpost: outpostPanelConfigSchema.optional(),
  /** Overrides project visibility for this tile */
  visibleIn: modeVisibilitySchema.optional(),
})

export const projectIndexRowSchema = z
  .object({
    tiles: z.array(projectIndexTileSchema).min(1).max(3),
  })
  .superRefine((row, ctx) => {
    const span = { full: 12, half: 6, third: 4 } as const
    const total = row.tiles.reduce((n, tile) => n + span[tile.width], 0)

    if (total !== 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Row tile widths must span 12 columns (got ${total})`,
      })
    }

    if (row.tiles.some((tile) => tile.width === 'full') && row.tiles.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A full-width tile must be the only tile in its row',
      })
    }
  })

export const projectIndexSchema = z.object({
  rows: z.array(projectIndexRowSchema).min(1),
})

export type ProjectIndexConfig = z.infer<typeof projectIndexSchema>
export type ProjectIndexRow = z.infer<typeof projectIndexRowSchema>
export type ProjectIndexTile = z.infer<typeof projectIndexTileSchema>
export type TileWidth = z.infer<typeof tileWidth>
export type TileHeight = z.infer<typeof tileHeight>

export const TILE_WIDTH_SPAN: Record<TileWidth, number> = {
  full: 12,
  half: 6,
  third: 4,
}
