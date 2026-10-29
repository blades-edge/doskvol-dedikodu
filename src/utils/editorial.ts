import type { CollectionEntry } from "astro:content";

export interface EditorialContent {
  issues: CollectionEntry<"issues">[];
  articles: CollectionEntry<"articles">[];
  authors: CollectionEntry<"authors">[];
  serials: CollectionEntry<"serials">[];
}

export function issueSlug(number: number) {
  return String(number).padStart(3, "0");
}

export function buildEditorialIndex(content: EditorialContent) {
  const issuesById = new Map(content.issues.map(entry => [entry.id, entry]));
  const articlesById = new Map(
    content.articles.map(entry => [entry.id, entry])
  );
  const authorsById = new Map(content.authors.map(entry => [entry.id, entry]));
  const serialsById = new Map(content.serials.map(entry => [entry.id, entry]));
  const numbers = new Set<number>();
  const positions = new Set<string>();
  const episodes = new Set<string>();

  for (const issue of content.issues) {
    if (numbers.has(issue.data.number))
      throw new Error(`Tekrarlanan sayı numarası: ${issue.data.number}`);
    numbers.add(issue.data.number);
    const lead = articlesById.get(issue.data.lead.id);
    if (!lead || lead.data.issue.id !== issue.id)
      throw new Error(`${issue.id}: Manşet bu sayıya ait bir yazı olmalı.`);
  }
  for (const article of content.articles) {
    const { issue, author, series, episode, order } = article.data;
    if (!issuesById.has(issue.id))
      throw new Error(`${article.id}: Sayı bulunamadı: ${issue.id}`);
    if (!authorsById.has(author.id))
      throw new Error(`${article.id}: Yazar bulunamadı: ${author.id}`);
    const position = `${issue.id}:${order}`;
    if (positions.has(position))
      throw new Error(`${issue.id}: Yazı sırası tekrarlanıyor: ${order}`);
    positions.add(position);
    if ((series !== undefined) !== (episode !== undefined))
      throw new Error(
        `${article.id}: Tefrika ve bölüm numarası birlikte girilmeli.`
      );
    if (series) {
      if (!serialsById.has(series.id))
        throw new Error(`${article.id}: Tefrika bulunamadı: ${series.id}`);
      const key = `${series.id}:${episode}`;
      if (episodes.has(key))
        throw new Error(
          `${series.id}: Bölüm numarası tekrarlanıyor: ${episode}`
        );
      episodes.add(key);
    }
  }
  return {
    ...content,
    issues: [...content.issues].sort((a, b) => b.data.number - a.data.number),
    issuesById,
    articlesById,
    authorsById,
    serialsById,
  };
}

export type EditorialIndex = ReturnType<typeof buildEditorialIndex>;

export function articlesForIssue(index: EditorialIndex, id: string) {
  return index.articles
    .filter(article => article.data.issue.id === id)
    .sort((a, b) => a.data.order - b.data.order);
}

export function chaptersForSeries(index: EditorialIndex, id: string) {
  return index.articles
    .filter(article => article.data.series?.id === id)
    .sort((a, b) => a.data.episode! - b.data.episode!);
}

export async function getEditorial() {
  const { getCollection } = await import("astro:content");
  const [issues, articles, authors, serials] = await Promise.all([
    getCollection("issues"),
    getCollection("articles"),
    getCollection("authors"),
    getCollection("serials"),
  ]);
  return buildEditorialIndex({ issues, articles, authors, serials });
}
