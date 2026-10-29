import assert from "node:assert/strict";
import test from "node:test";
import { contentReferenceId, emptyToUndefined } from "../src/utils/contentReference.ts";

test("Pages CMS filenames resolve to the same Astro IDs as existing content", () => {
  for (const [filename, id] of [
    ["mina-karakarga.json", "mina-karakarga"],
    ["001.json", "001"],
    ["kor-nokta.json", "kor-nokta"],
    ["gece-yarisi-ziyareti.md", "gece-yarisi-ziyareti"],
  ]) {
    assert.equal(contentReferenceId(filename), id);
    assert.equal(contentReferenceId(id), id);
  }
  assert.equal(contentReferenceId("story.v2.md"), "story.v2");
});

test("clearing optional CMS fields removes references and chapter numbers", () => {
  for (const value of ["", null, undefined]) {
    assert.equal(contentReferenceId(value), undefined);
    assert.equal(emptyToUndefined(value), undefined);
  }
  assert.equal(emptyToUndefined(1), 1);
  assert.equal(emptyToUndefined(0), 0);
  assert.equal(emptyToUndefined("Açıklama"), "Açıklama");
});

test("invalid input is left to schema validation, not coerced into a valid ID", () => {
  const invalid = { value: "001.json" };
  assert.equal(contentReferenceId(invalid), invalid);
  assert.equal(contentReferenceId(1), 1);
});
