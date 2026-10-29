import assert from "node:assert/strict";
import test from "node:test";
import { buildEditorialIndex, articlesForIssue, chaptersForSeries, issueSlug } from "../src/utils/editorial.ts";
function fixture() {
  return {
    issues: [
      {id:"one",data:{number:1,lead:{id:"news"},chapters:[{id:"chapter-one"}]}},
      {id:"two",data:{number:2,lead:{id:"news-two"},chapters:[{id:"chapter-two"}]}},
    ],
    articles: [
      {id:"news-two",data:{issue:{id:"two"},author:{id:"reporter"},order:0}},
      {id:"news",data:{issue:{id:"one"},author:{id:"reporter"},order:0}},
      {id:"rumor",data:{issue:{id:"one"},author:{id:"reporter"},order:1}},
    ],
    chapters: [
      {id:"chapter-two",data:{series:{id:"diary"},episode:2,author:{id:"writer"}}},
      {id:"chapter-one",data:{series:{id:"diary"},episode:1,author:{id:"writer"}}},
    ],
    authors:[{id:"reporter",data:{name:"Muhabir"}},{id:"writer",data:{name:"Yazar"}}],
    serials:[{id:"diary",data:{title:"Günce"}}],
  };
}
test("issues include their selected chapters and preserve reading IDs",()=>{
 const index=buildEditorialIndex(fixture());
 assert.deepEqual(index.issues.map(i=>i.id),["two","one"]);
 assert.deepEqual(articlesForIssue(index,"one").map(i=>i.id),["news","rumor","chapter-one"]);
 assert.equal(index.articlesById.get("chapter-one").data.issue.id,"one");
 assert.equal(index.articlesById.get("chapter-one").data.section,"Tefrika");
 assert.equal(issueSlug(1),"001");
});
test("chapters navigate in episode order across issues",()=>{
 assert.deepEqual(chaptersForSeries(buildEditorialIndex(fixture()),"diary").map(c=>c.id),["chapter-one","chapter-two"]);
});
test("unselected chapters and draft issue chapters are not published",()=>{
 const data=fixture();data.issues[1].data.draft=true;delete data.issues[1].data.lead;
 const index=buildEditorialIndex(data);
 assert.equal(index.articlesById.has("chapter-two"),false);
 assert.equal(index.articlesById.has("news-two"),false);
 assert.deepEqual(chaptersForSeries(index,"diary").map(c=>c.id),["chapter-one"]);
 data.issues[0].data.chapters=[];
 assert.deepEqual(chaptersForSeries(buildEditorialIndex(data),"diary"),[]);
});
test("issues can omit chapter selection",()=>{
 const data=fixture();delete data.issues[0].data.chapters;
 assert.equal(buildEditorialIndex(data).articlesById.has("chapter-one"),false);
});
for(const [name,mutate,message] of [
 ["foreign lead",d=>d.issues[0].data.lead.id="news-two",/Manşet/],
 ["missing lead",d=>delete d.issues[0].data.lead,/Manşet/],
 ["duplicate issue",d=>d.issues[1].data.number=1,/sayı numarası/],
 ["missing author",d=>d.articles[0].data.author.id="missing",/Yazar/],
 ["missing issue",d=>d.articles[2].data.issue.id="missing",/Sayı/],
 ["missing chapter",d=>d.issues[0].data.chapters=[{id:"missing"}],/bölümü bulunamadı/],
 ["reused chapter",d=>d.issues[1].data.chapters=[{id:"chapter-one"}],/birden fazla/],
 ["duplicate selection",d=>d.issues[0].data.chapters.push({id:"chapter-one"}),/birden fazla/],
 ["missing series",d=>d.chapters[0].data.series.id="missing",/Tefrika bulunamadı/],
 ["missing chapter author",d=>d.chapters[0].data.author.id="missing",/Yazar/],
 ["duplicate episode",d=>d.chapters[0].data.episode=1,/Bölüm numarası/],
 ["reading URL collision",d=>d.chapters[0].id="news",/çakışıyor/],
]) test(`rejects ${name}`,()=>{const data=fixture();mutate(data);assert.throws(()=>buildEditorialIndex(data),message);});
test("equal and unset article priorities remain deterministic",()=>{
 const data=fixture();data.articles[2].data.order=0;
 const order=articlesForIssue(buildEditorialIndex(data),"one").map(a=>a.id);
 data.articles.reverse();
 assert.deepEqual(articlesForIssue(buildEditorialIndex(data),"one").map(a=>a.id),order);
 delete data.articles.find(a=>a.id==="rumor").data.order;
 assert.equal(articlesForIssue(buildEditorialIndex(data),"one")[0].id,"news");
});
