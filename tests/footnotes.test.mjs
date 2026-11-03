import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { footnoteOptions } from "../src/utils/footnotes.mjs";

test("repeated references share one Turkish footnote without extra superscripts", async () => {
  const processor = await createMarkdownProcessor({
    remarkRehype: footnoteOptions,
  });
  const { code } = await processor.render(
    "Bir[^1] iki[^1] üç[^2].\n\n[^1]: Ortak dipnot.\n[^2]: Diğer dipnot."
  );
  assert.match(code, /id="footnote-label">Dipnotlar<\/h2>/);
  assert.equal((code.match(/<li id="user-content-fn-/g) ?? []).length, 2);
  assert.equal((code.match(/href="#user-content-fn-1"/g) ?? []).length, 2);
  assert.match(code, /href="#user-content-fnref-1-2"/);
  assert.match(code, /aria-label="1. dipnotun 2. referansına dön"/);
  assert.equal((code.match(/data-footnote-backref=""/g) ?? []).length, 3);
  assert.doesNotMatch(code.split("<section")[1], /<sup>/);
});
