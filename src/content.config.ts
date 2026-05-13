import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modules = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/modules' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.string(),
    summary: z.string(),
    capabilities: z.array(z.string()).min(2).max(6),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/faqs' }),
  schema: z.object({
    section: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

export const collections = { modules, faqs, pages };
