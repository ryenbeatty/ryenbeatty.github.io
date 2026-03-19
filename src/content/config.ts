import { defineCollection, z } from 'astro:content'

// Writing
const article = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topics: z.array(z.string()),
    featured: z.boolean(),
  }),
})

// Projects — order for homepage; sections = sticky text blocks + media (left/right layout)
const projectSectionMedia = z.object({
  src: z.string(), // image/video: path or URL; vidstack: video URL for Media/VideoLayout player
  type: z.enum(['image', 'video', 'vidstack']),
  alt: z.string().optional(),
  poster: z.string().optional(), // optional poster image URL (e.g. for vidstack)
})
const projectSection = z.object({
  text: z.string(), // markdown, rendered on homepage
  media: z.array(projectSectionMedia),
})
const project = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    order: z.number().optional(), // homepage order (lower = first)
    labels: z.array(z.string()),
    password: z.string().optional(),
    'header-background': z.string().optional(),
    'hero-image': z.string().optional(),
    sections: z.array(projectSection).optional(), // [{ text, media }, ...]; first row uses title+description as text
  }),
})

// Records (musical)
export const record = defineCollection({
  type: 'content',
  schema: z.object({
    artist: z.string().optional(),
    title: z.string(),
    cover: z.string().url(),
    url: z.string().url(),
    description: z.string(),
  }),
})

// Labs (research/experiments)
export const lab = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
})

// Notes
export const note = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
})
export const collections = {
  article,
  project,
  record,
  lab,
  // newsletter
}
