import { contentReferenceId, emptyToUndefined } from "@utils/contentReference";
import { SITE } from "@config";
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const cmsReference = <T extends "articles" | "issues" | "authors" | "serials">(
  collection: T
) => z.preprocess(contentReferenceId, reference(collection));
const optionalText = z.preprocess(emptyToUndefined, z.string().optional());

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
  schema: z.object({ name: z.string().min(1), bio: optionalText }),
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
      description: z.string().min(1),
      date: z.coerce.date(),
      price: z.string().min(1),
      draft: z.boolean().default(false),
      lead: z.preprocess(contentReferenceId, reference("articles").optional()),
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
    location: optionalText,
    author: cmsReference("authors"),
    issue: cmsReference("issues"),
    order: z.number().int().nonnegative(),
    series: z.preprocess(contentReferenceId, reference("serials").optional()),
    episode: z.preprocess(
      emptyToUndefined,
      z.number().int().positive().optional()
    ),
    spoiler: optionalText,
  }),
});

export const collections = { blog, authors, serials, issues, articles };
