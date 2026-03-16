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

// Projects
const project = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    labels: z.array(z.string()),
    password: z.string().optional(), // when set, project page is protected by this password
    'header-background': z.string().optional(), // full-bleed header background image (path or URL)
    'hero-image': z.string().optional(), // hero/feature image shown in header (path or URL)
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
