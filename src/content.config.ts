import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    header: z.string().optional(),
    description: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    category: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
