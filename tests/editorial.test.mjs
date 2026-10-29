import assert from "node:assert/strict";
import test from "node:test";
import { buildEditorialIndex, articlesForIssue, chaptersForSeries, issueSlug } from "../src/utils/editorial.ts";

function fixture() {
  return {
    issues: [
      { id: "one", data: { number: 1, lead: { id: "news" } } },
      { id: "two", data: { number: 2, lead: { id: "chapter-two" } } },
    ],
    articles: [
      { id: "chapter-two", data: { issue: { id: "two" }, author: { id: "other" }, order: 0, series: { id: "diary" }, episode: 2 } },
      { id: "chapter-one", data: { issue: { id: "one" }, author: { id: "other" }, order: 1, series: { id: "diary" }, episode: 1 } },
      { id: "news", data: { issue: { id: "one" }, author: { id: "reporter" }, order: 0 } },
    ],
    authors: [{ id: "reporter", data: { name: "Muhabir" } }, { id: "other", data: { name: "Yazar" } }],
    serials: [{ id: "diary", data: { title: "Günce" } }],
  };
}

test("issues sort newest first; an issue contains only its own articles and authors", () => {
  const publication = buildEditorialIndex(fixture());
  assert.deepEqual(publication.issues.map(issue => issue.id), ["two", "one"]);
  assert.deepEqual(articlesForIssue(publication, "one").map(article => article.id), ["news", "chapter-one"]);
  assert.equal(publication.authorsById.get("other").data.name, "Yazar");
  assert.equal(issueSlug(1), "001");
  assert.equal(issueSlug(1234), "1234");
});

test("chapters follow episode order across issues, independently of file and issue order", () => {
  assert.deepEqual(chaptersForSeries(buildEditorialIndex(fixture()), "diary").map(article => article.id), ["chapter-one", "chapter-two"]);
});

for (const [name, mutate, message] of [
  ["foreign lead", data => data.issues[0].data.lead.id = "chapter-two", /Manşet/],
  ["duplicate issue number", data => data.issues[1].data.number = 1, /sayı numarası/],
  ["missing author", data => data.articles[0].data.author.id = "missing", /Yazar bulunamadı/],
  ["missing issue", data => data.articles[1].data.issue.id = "missing", /Sayı bulunamadı/],
  ["duplicate article order", data => data.articles[1].data.order = 0, /Yazı sırası/],
  ["missing episode", data => delete data.articles[1].data.episode, /birlikte/],
  ["episode without series", data => delete data.articles[1].data.series, /birlikte/],
  ["missing series", data => data.articles[1].data.series.id = "missing", /Tefrika bulunamadı/],
  ["duplicate episode", data => data.articles[0].data.episode = 1, /Bölüm numarası/],
]) {
  test(`rejects ${name} instead of rendering wrong links`, () => {
    const data = fixture(); mutate(data);
    assert.throws(() => buildEditorialIndex(data), message);
  });
}
