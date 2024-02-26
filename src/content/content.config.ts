import { defineCollection, z } from 'astro:content'

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
})

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = {
  article: articleCollection,
  project: projectCollection,
  // 'newsletter': blogCollection,
}
