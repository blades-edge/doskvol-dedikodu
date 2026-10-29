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
  const articlesById = new Map(
    content.articles.map(entry => [entry.id, entry])
  );
  const authorsById = new Map(content.authors.map(entry => [entry.id, entry]));
  const serialsById = new Map(content.serials.map(entry => [entry.id, entry]));
  const numbers = new Set<number>();
  const selectedArticles = new Map<string, CollectionEntry<"issues">>();
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
    if (!lead || !(issue.data.articles ?? []).some(ref => ref.id === lead.id))
      throw new Error(`${issue.id}: Manşet bu sayıya ait bir yazı olmalı.`);
    for (const ref of issue.data.articles ?? []) {
      if (!articlesById.has(ref.id))
        throw new Error(`${issue.id}: Yazı bulunamadı: ${ref.id}`);
      if (selectedArticles.has(ref.id))
        throw new Error(`${ref.id}: Yazı birden fazla seçilmiş.`);
      selectedArticles.set(ref.id, issue);
    }
    for (const ref of issue.data.chapters ?? []) {
      if (!chaptersById.has(ref.id))
        throw new Error(`${issue.id}: Tefrika bölümü bulunamadı: ${ref.id}`);
      if (selectedChapters.has(ref.id))
        throw new Error(`${ref.id}: Tefrika bölümü birden fazla seçilmiş.`);
      selectedChapters.set(ref.id, issue);
    }
  }
  for (const article of content.articles) {
    if (!authorsById.has(article.data.author.id))
      throw new Error(`${article.id}: Yazar bulunamadı.`);
  }
  const issues = content.issues
    .filter(issue => !issue.data.draft)
    .sort((a, b) => b.data.number - a.data.number);
  const articles = [
    ...content.articles
      .filter(article => selectedArticles.has(article.id))
      .map(article => ({
        ...article,
        data: {
          ...article.data,
          series: undefined,
          episode: undefined,
          issue: {
            collection: "issues" as const,
            id: selectedArticles.get(article.id)!.id,
          },
          order: selectedArticles
            .get(article.id)!
            .data.articles.findIndex(ref => ref.id === article.id),
        },
      })),
    ...content.chapters
      .filter(chapter => selectedChapters.has(chapter.id))
      .map(chapter => ({
        ...chapter,
        data: {
          ...chapter.data,
          section: "Tefrika",
          order:
            selectedChapters.get(chapter.id)!.data.articles.length +
            (selectedChapters.get(chapter.id)!.data.chapters ?? []).findIndex(
              ref => ref.id === chapter.id
            ),
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
    .sort((a, b) => a.data.order - b.data.order);
}

export function groupSerialChapters(articles: EditorialEntry[]) {
  const groups = new Map<string, EditorialEntry[]>();
  for (const article of articles) {
    const id = article.data.series?.id;
    if (!id) continue;
    const chapters = groups.get(id);
    if (chapters) chapters.push(article);
    else groups.set(id, [article]);
  }
  return Array.from(groups, ([seriesId, chapters]) => ({ seriesId, chapters }));
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
