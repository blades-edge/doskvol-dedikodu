import { contentReferenceId, emptyToUndefined } from "@utils/contentReference";
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const cmsReference = <
  T extends "makale" | "sayi" | "yazar" | "tefrika" | "bolum",
>(
  collection: T
) => z.preprocess(contentReferenceId, reference(collection));
const optionalText = z.preprocess(emptyToUndefined, z.string().optional());

const authors = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/yazar" }),
  schema: z.object({ name: z.string().min(1), bio: optionalText }),
});

const serials = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/tefrika" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

const issues = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/sayi" }),
  schema: ({ image }) =>
    z.object({
      number: z.number().int().positive(),
      description: optionalText,
      date: z.coerce.date(),
      price: z.string().min(1),
      lead: z.preprocess(contentReferenceId, reference("makale").optional()),
      articles: z.preprocess(
        emptyToUndefined,
        z.array(cmsReference("makale")).default([])
      ),
      chapters: z.preprocess(
        emptyToUndefined,
        z.array(cmsReference("bolum")).default([])
      ),
      cover: z.preprocess(emptyToUndefined, image().optional()),
      coverAlt: optionalText,
      coverCaption: optionalText,
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/makale" }),
  schema: ({ image }) =>
    z.object({
      cover: z.preprocess(emptyToUndefined, image().optional()),
      coverAlt: optionalText,
      coverCaption: optionalText,
      title: z.string().min(1),
      description: z.string().min(1),
      section: z.enum(["Haberler", "Dedikodular"]),
      district: optionalText,
      location: optionalText,
      author: cmsReference("yazar"),
      spoiler: optionalText,
    }),
});

const chapters = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/bolum" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    author: cmsReference("yazar"),
    series: cmsReference("tefrika"),
    episode: z.number().int().positive(),
    spoiler: optionalText,
  }),
});

export const collections = {
  yazar: authors,
  tefrika: serials,
  sayi: issues,
  makale: articles,
  bolum: chapters,
};
