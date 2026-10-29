import { SITE } from "@config";
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z
        .union([z.string().regex(/^(https?:\/\/|\/)/), image()])
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/authors" }),
  schema: z.object({ name: z.string().min(1), bio: z.string().optional() }),
});

const serials = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/serials" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

const issues = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/issues" }),
  schema: ({ image }) =>
    z.object({
      number: z.number().int().positive(),
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      price: z.string().min(1),
      lead: reference("articles"),
      cover: image(),
      coverAlt: z.string().min(1),
      coverCaption: z.string().min(1),
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    section: z.string().min(1),
    location: z.string().optional(),
    author: reference("authors"),
    issue: reference("issues"),
    order: z.number().int().nonnegative(),
    series: reference("serials").optional(),
    episode: z.number().int().positive().optional(),
    spoiler: z.string().optional(),
  }),
});

export const collections = { blog, authors, serials, issues, articles };
