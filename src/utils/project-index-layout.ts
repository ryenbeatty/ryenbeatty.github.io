import { TILE_WIDTH_SPAN, type TileWidth } from '../schemas/project-index'

type Visibility = { default: boolean; outpost: boolean }

export type LayoutTile<T> = {
  item: T
  width: TileWidth
  visibility: Visibility
}

export type PlacedTile<T> = {
  item: T
  span: number
}

export type IndexMode = 'default' | 'outpost'

export function computeReflowSpans<T>(
  tiles: LayoutTile<T>[],
  mode: IndexMode,
): PlacedTile<T>[] {
  const visible = tiles.filter((tile) => tile.visibility[mode])
  if (!visible.length) return []

  const weights = visible.map((tile) => TILE_WIDTH_SPAN[tile.width])
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const spans = weights.map((weight) =>
    Math.max(1, Math.round((12 * weight) / totalWeight)),
  )

  let spanSum = spans.reduce((sum, span) => sum + span, 0)
  let index = spans.length - 1

  while (spanSum < 12 && index >= 0) {
    spans[index] += 1
    spanSum += 1
    index = index === 0 ? spans.length - 1 : index - 1
  }

  while (spanSum > 12 && index >= 0) {
    if (spans[index] > 1) {
      spans[index] -= 1
      spanSum -= 1
    }
    index = index === 0 ? spans.length - 1 : index - 1
  }

  return visible.map((tile, tileIndex) => ({
    item: tile.item,
    span: spans[tileIndex],
  }))
}
