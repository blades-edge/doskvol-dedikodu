import assert from "node:assert/strict";
import test from "node:test";
import { issuePath, articlePath } from "../src/utils/paths.ts";
test("single Turkish route names are independent of titles", () => {
  assert.equal(issuePath(1), "sayi/001/");
  assert.equal(issuePath(1200), "sayi/1200/");
  assert.equal(articlePath({id:"gece-yarisi",data:{title:"Changed title"}}),"makale/gece-yarisi/");
  assert.equal(articlePath({id:"benden-once-gelen",data:{series:{id:"kor-nokta"},episode:2}}),"tefrika/kor-nokta/2/");
});

 test("CMS issue selections use the content schema field names",async()=>{
 const {readFile}=await import("node:fs/promises");
 const cms=await readFile(new URL("../.pages.yml",import.meta.url),"utf8");
 assert.match(cms,/name: articles\n\s+label: Bu sayıdaki makaleler/);
 assert.match(cms,/name: chapters\n\s+label: Bu sayıdaki tefrika bölümleri/);
 });
