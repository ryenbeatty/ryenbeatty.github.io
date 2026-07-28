/** Section media item from project frontmatter (after content collection parse). */
export interface ProjectSectionMediaInput {
  src: string
  type: 'image' | 'video' | 'vidstack'
  alt?: string
  caption?: string
  poster?: string
  /** Display width in CSS pixels (preferred field name in project MDX). */
  width?: number
  /** Alias of `width` (legacy / explicit). */
  maxWidthPx?: number
}

const AMBIENT_VIDEO_EXT = /\.(mp4|webm|mov|ogv|ogg)$/i

/** Infer ambient video from file extension when type is omitted or set to image. */
export function resolveMediaType(
  item: Pick<ProjectSectionMediaInput, 'src' | 'type'>,
): ProjectSectionMediaInput['type'] {
  if (item.type === 'vidstack') return 'vidstack'
  if (item.type === 'video') return 'video'
  if (AMBIENT_VIDEO_EXT.test(item.src)) return 'video'
  return 'image'
}

export function normalizeProjectMediaItem<T extends ProjectSectionMediaInput>(
  item: T,
): T {
  return { ...item, type: resolveMediaType(item) }
}

/** Resolved width for layout: per-item `width` / `maxWidthPx`, then project default. */
export function resolveMediaWidthPx(
  item: Pick<ProjectSectionMediaInput, 'width' | 'maxWidthPx'>,
  projectDefaultWidth?: number,
): number | undefined {
  return item.maxWidthPx ?? item.width ?? projectDefaultWidth
}

export function withResolvedMediaWidths<T extends ProjectSectionMediaInput>(
  media: T[],
  projectDefaultWidth?: number,
): T[] {
  return media.map((item) => {
    const normalized = normalizeProjectMediaItem(item)
    const width = resolveMediaWidthPx(normalized, projectDefaultWidth)
    if (width == null) return normalized
    return { ...normalized, width, maxWidthPx: width }
  })
}

/** Grid column count when section media should tile; null for a single stacked item. */
export function resolveMediaGridColumns(mediaCount: number): number | null {
  if (mediaCount <= 1) return null
  return 2
}
