import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import { renderMarkdown } from './markdown'
import {
  withResolvedMediaWidths,
  type ProjectSectionMediaInput,
} from './project-media'

export type ProjectEntry = CollectionEntry<'project'>

/** Draft projects are dev-only; published projects ship in production. */
export function isPublishedProject(project: ProjectEntry): boolean {
  return import.meta.env.PROD ? !project.data.draft : true
}

export function filterPublishedProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return projects.filter(isPublishedProject)
}

/** Project entries for the current environment (drafts omitted in production builds). */
export async function getProjectEntries(): Promise<ProjectEntry[]> {
  if (import.meta.env.PROD) {
    return getCollection('project', ({ data }) => !data.draft)
  }
  return getCollection('project')
}

export interface ProjectIndexMedia {
  src: string
  type: 'image' | 'video' | 'vidstack'
  alt?: string
  poster?: string
  width?: number
  maxWidthPx?: number
}

export interface ResolvedProjectIndexItem {
  slug: string
  title: string
  description: string
  bodyHtml: string
  media: ProjectIndexMedia[]
  thumbnail?: string
}

export async function resolveProjectForIndex(
  project: CollectionEntry<'project'>
): Promise<ResolvedProjectIndexItem> {
  const sections = project.data.sections ?? []
  const raw = project.data.description
  const bodyHtml =
    typeof raw === 'string' ? await renderMarkdown(raw) : String(raw)
  const thumbnail = project.data.thumbnail?.trim()
  const defaultWidth = project.data.mediaMaxWidth
  type ProjectSectionMedia = NonNullable<
    NonNullable<CollectionEntry<'project'>['data']['sections']>[number]['media']
  >[number]
  const rawMedia: ProjectSectionMediaInput[] = thumbnail
    ? [{ src: thumbnail, type: 'image', alt: project.data.title }]
    : ((sections[0]?.media ?? []) as ProjectSectionMedia[])
  const media = withResolvedMediaWidths(rawMedia, defaultWidth)

  return {
    slug: project.slug,
    title: project.data.title,
    description: project.data.description,
    bodyHtml,
    media,
    thumbnail,
  }
}
