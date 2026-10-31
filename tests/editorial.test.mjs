import assert from "node:assert/strict";
import test from "node:test";
import { buildEditorialIndex, articlesForIssue, chaptersForSeries, groupSerialChapters, issueSlug } from "../src/utils/editorial.ts";
function fixture() {
  return {
    issues: [
      {id:"one",data:{number:1,lead:{id:"news"},articles:[{id:"news"},{id:"rumor"}],chapters:[{id:"chapter-one"}]}},
      {id:"two",data:{number:2,lead:{id:"news-two"},articles:[{id:"news-two"}],chapters:[{id:"chapter-two"}]}},
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
 ["missing article",d=>d.issues[0].data.articles.push({id:"missing"}),/Yazı bulunamadı/],
 ["reused article",d=>d.issues[1].data.articles.push({id:"rumor"}),/birden fazla/],
 ["duplicate article selection",d=>d.issues[0].data.articles.push({id:"rumor"}),/birden fazla/],
 ["missing chapter",d=>d.issues[0].data.chapters=[{id:"missing"}],/bölümü bulunamadı/],
 ["reused chapter",d=>d.issues[1].data.chapters=[{id:"chapter-one"}],/birden fazla/],
 ["duplicate selection",d=>d.issues[0].data.chapters.push({id:"chapter-one"}),/birden fazla/],
 ["missing series",d=>d.chapters[0].data.series.id="missing",/Tefrika bulunamadı/],
 ["missing chapter author",d=>d.chapters[0].data.author.id="missing",/Yazar/],
 ["duplicate episode",d=>d.chapters[0].data.episode=1,/Bölüm numarası/],
 ["reading URL collision",d=>d.chapters[0].id="news",/çakışıyor/],
]) test(`rejects ${name}`,()=>{const data=fixture();mutate(data);assert.throws(()=>buildEditorialIndex(data),message);});
test("article list order overrides input file order and legacy priorities",()=>{
 const data=fixture();
 data.issues[0].data.articles.reverse();
 assert.deepEqual(articlesForIssue(buildEditorialIndex(data),"one").map(a=>a.id),["rumor","news","chapter-one"]);
 data.articles.reverse();
 assert.deepEqual(articlesForIssue(buildEditorialIndex(data),"one").map(a=>a.id),["rumor","news","chapter-one"]);
});
test("unselected articles never get reading pages or appear in the index",()=>{
 const data=fixture();data.issues[0].data.articles=[{id:"news"}];
 assert.equal(buildEditorialIndex(data).articlesById.has("rumor"),false);
});
test("chapter presentation follows selection order while navigation follows episode order",()=>{
 const data=fixture();data.issues[1].data.chapters=[];
 data.issues[0].data.chapters=[{id:"chapter-two"},{id:"chapter-one"}];
 const index=buildEditorialIndex(data);
 assert.deepEqual(articlesForIssue(index,"one").map(a=>a.id),["news","rumor","chapter-two","chapter-one"]);
 assert.deepEqual(chaptersForSeries(index,"diary").map(a=>a.id),["chapter-one","chapter-two"]);
 data.chapters.reverse();
 assert.deepEqual(articlesForIssue(buildEditorialIndex(data),"one").map(a=>a.id),["news","rumor","chapter-two","chapter-one"]);
});
test("lead must be in the issue selection",()=>{
 const data=fixture();data.issues[0].data.articles=[{id:"rumor"}];
 assert.throws(()=>buildEditorialIndex(data),/Manşet/);
});

test("serial cards group by series ID while preserving selection order",()=>{
 const chapter=(id,series)=>({id,data:{series:{id:series}}});
 const a=chapter("a-2","a"), b=chapter("b-1","b"), c=chapter("a-1","a");
 assert.deepEqual(groupSerialChapters([a,b,c,{id:"news",data:{}}]),[
   {seriesId:"a",chapters:[a,c]}, {seriesId:"b",chapters:[b]},
 ]);
 assert.deepEqual(groupSerialChapters([]),[]);
});

 test("PR preview includes published and draft issues and permits an unfinished lead",()=>{
 const data=fixture(); const issue=data.issues[1]; issue.data.draft=true; delete issue.data.lead;
 const publicIndex=buildEditorialIndex(data);
 const preview=buildEditorialIndex(data,{preview:true});
 assert.equal(publicIndex.articlesById.has("news-two"),false);
 assert.equal(preview.preview,true);
 assert.equal(preview.issues.length,2);
 assert.deepEqual(articlesForIssue(preview,"two").map(a=>a.id),["news-two","chapter-two"]);
 assert.equal(preview.articlesById.has("news"),true);
 issue.data.articles=[];issue.data.chapters=[];
 assert.deepEqual(buildEditorialIndex({...data,issues:[issue]},{preview:true}).articles,[]);
 });
