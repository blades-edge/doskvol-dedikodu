import type { CollectionEntry } from "astro:content";

export interface EditorialContent {
  issues: CollectionEntry<"issues">[];
  articles: CollectionEntry<"articles">[];
  authors: CollectionEntry<"authors">[];
  serials: CollectionEntry<"serials">[];
  chapters: CollectionEntry<"chapters">[];
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
  const selectedChapters = new Map<string, CollectionEntry<"issues">>();
  const chaptersById = new Map(
    content.chapters.map(entry => [entry.id, entry])
  );
  const episodes = new Set<string>();
  const ids = new Set(content.articles.map(entry => entry.id));
  for (const chapter of content.chapters) {
    if (ids.has(chapter.id))
      throw new Error(`Yazı ve tefrika dosya adları çakışıyor: ${chapter.id}`);
    if (!serialsById.has(chapter.data.series.id))
      throw new Error(`${chapter.id}: Tefrika bulunamadı.`);
    if (!authorsById.has(chapter.data.author.id))
      throw new Error(`${chapter.id}: Yazar bulunamadı.`);
    const key = `${chapter.data.series.id}:${chapter.data.episode}`;
    if (episodes.has(key))
      throw new Error(`${chapter.id}: Bölüm numarası tekrarlanıyor.`);
    episodes.add(key);
  }
  for (const issue of content.issues) {
    if (numbers.has(issue.data.number))
      throw new Error(`Tekrarlanan sayı numarası: ${issue.data.number}`);
    numbers.add(issue.data.number);
    if (issue.data.draft) continue;
    const lead = issue.data.lead && articlesById.get(issue.data.lead.id);
    if (!lead || lead.data.issue.id !== issue.id)
      throw new Error(`${issue.id}: Manşet bu sayıya ait bir yazı olmalı.`);
    for (const ref of issue.data.chapters ?? []) {
      if (!chaptersById.has(ref.id))
        throw new Error(`${issue.id}: Tefrika bölümü bulunamadı: ${ref.id}`);
      if (selectedChapters.has(ref.id))
        throw new Error(`${ref.id}: Tefrika bölümü birden fazla seçilmiş.`);
      selectedChapters.set(ref.id, issue);
    }
  }
  for (const article of content.articles) {
    if (!issuesById.has(article.data.issue.id))
      throw new Error(`${article.id}: Sayı bulunamadı.`);
    if (issuesById.get(article.data.issue.id)!.data.draft) continue;
    if (!authorsById.has(article.data.author.id))
      throw new Error(`${article.id}: Yazar bulunamadı.`);
  }
  const issues = content.issues
    .filter(issue => !issue.data.draft)
    .sort((a, b) => b.data.number - a.data.number);
  const articles = [
    ...content.articles
      .filter(article => !issuesById.get(article.data.issue.id)!.data.draft)
      .map(article => ({
        ...article,
        data: { ...article.data, series: undefined, episode: undefined },
      })),
    ...content.chapters
      .filter(chapter => selectedChapters.has(chapter.id))
      .map(chapter => ({
        ...chapter,
        data: {
          ...chapter.data,
          section: "Tefrika",
          order: 1000,
          district: undefined,
          location: undefined,
          issue: {
            collection: "issues" as const,
            id: selectedChapters.get(chapter.id)!.id,
          },
        },
      })),
  ];
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

export type EditorialEntry = EditorialIndex["articles"][number];

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
  const [issues, articles, authors, serials, chapters] = await Promise.all([
    getCollection("issues"),
    getCollection("articles"),
    getCollection("authors"),
    getCollection("serials"),
    getCollection("chapters"),
  ]);
  return buildEditorialIndex({ issues, articles, authors, serials, chapters });
}
