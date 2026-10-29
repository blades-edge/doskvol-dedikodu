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
  const episodes = new Set<string>();

  for (const issue of content.issues) {
    if (numbers.has(issue.data.number))
      throw new Error(`Tekrarlanan sayı numarası: ${issue.data.number}`);
    numbers.add(issue.data.number);
    if (issue.data.draft) continue;
    const lead = issue.data.lead && articlesById.get(issue.data.lead.id);
    if (!lead || lead.data.issue.id !== issue.id)
      throw new Error(`${issue.id}: Manşet bu sayıya ait bir yazı olmalı.`);
  }
  for (const article of content.articles) {
    const { issue, author, series, episode } = article.data;
    if (!issuesById.has(issue.id))
      throw new Error(`${article.id}: Sayı bulunamadı: ${issue.id}`);
    if (issuesById.get(issue.id)!.data.draft) continue;
    if (!authorsById.has(author.id))
      throw new Error(`${article.id}: Yazar bulunamadı: ${author.id}`);
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
  const issues = content.issues
    .filter(issue => !issue.data.draft)
    .sort((a, b) => b.data.number - a.data.number);
  const articles = content.articles.filter(
    article => !issuesById.get(article.data.issue.id)!.data.draft
  );
  return {
    ...content,
    issues,
    articles,
    issuesById: new Map(issues.map(issue => [issue.id, issue])),
    articlesById: new Map(articles.map(article => [article.id, article])),
    authorsById,
    serialsById,
  };
}

export type EditorialIndex = ReturnType<typeof buildEditorialIndex>;

export function articlesForIssue(index: EditorialIndex, id: string) {
  return index.articles
    .filter(article => article.data.issue.id === id)
    .sort((a, b) => {
      const priority = (a.data.order ?? 1000) - (b.data.order ?? 1000);
      if (priority) return priority;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
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
