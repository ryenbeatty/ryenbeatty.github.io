import { defineCollection, z } from 'astro:content'

const article = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
})

const project = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
})

export const record = defineCollection({
  type: 'content',
  schema: z.object({
    artist: z.string(),
    title: z.string(),
    cover: z.string().url(),
    url: z.string().url(),
    description: z.string(),
  }),
})

export const lab = defineCollection({
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
