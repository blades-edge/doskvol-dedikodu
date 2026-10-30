import assert from "node:assert/strict";
import test from "node:test";
import { issuePath, articlePath } from "../src/utils/paths.ts";
test("single Turkish route names are independent of titles", () => {
  assert.equal(issuePath(1), "sayi/001/");
  assert.equal(issuePath(1200), "sayi/1200/");
  assert.equal(articlePath({id:"gece-yarisi",data:{title:"Changed title"}}),"makale/gece-yarisi/");
  assert.equal(articlePath({id:"benden-once-gelen",data:{series:{id:"kor-nokta"},episode:2}}),"tefrika/kor-nokta/2/");
});

test("preview reading links stay within the selected issue",()=>{
 assert.equal(issuePath(2,true),"onizleme/sayi/002/");
 assert.equal(articlePath({id:"news",data:{}},2),"onizleme/sayi/002/makale/news/");
 assert.equal(articlePath({id:"chapter",data:{series:{id:"diary"},episode:3}},2),"onizleme/sayi/002/tefrika/diary/3/");
});
