import { contentReferenceId, emptyToUndefined } from "@utils/contentReference";
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const cmsReference = <
  T extends "articles" | "issues" | "authors" | "serials" | "chapters",
>(
  collection: T
) => z.preprocess(contentReferenceId, reference(collection));
const optionalText = z.preprocess(emptyToUndefined, z.string().optional());

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
      articles: z.preprocess(
        emptyToUndefined,
        z.array(cmsReference("articles")).default([])
      ),
      chapters: z.preprocess(
        emptyToUndefined,
        z.array(cmsReference("chapters")).default([])
      ),
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
    section: z.enum(["Haberler", "Dedikodular"]),
    district: optionalText,
    location: optionalText,
    author: cmsReference("authors"),
    spoiler: optionalText,
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    author: cmsReference("authors"),
    series: cmsReference("serials"),
    episode: z.number().int().positive(),
    spoiler: optionalText,
  }),
});

export const collections = { authors, serials, issues, articles, chapters };
