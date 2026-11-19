import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkDialogue } from "../src/utils/dialogue.mjs";

const processor = await createMarkdownProcessor({ remarkPlugins: [remarkDialogue] });
const chapter = new URL("../src/content/bolum/test.md", import.meta.url);

test("dialogue alternates within each chain and preserves quotation marks", async () => {
  const { code } = await processor.render(
    '“Bir.”\n\n“İki.”\n\n“Üç.”\n\nAnlatı.\n\n“Yeni.”\n\n“İkinci.”',
    { fileURL: chapter }
  );
  assert.equal(code, '<p class="dialogue">“Bir.”</p>\n<p class="dialogue dialogue-even">“İki.”</p>\n<p class="dialogue">“Üç.”</p>\n<p>Anlatı.</p>\n<p class="dialogue">“Yeni.”</p>\n<p class="dialogue dialogue-even">“İkinci.”</p>');
});

test("narration, multiple quote pairs, blockquotes and italic messages break chains", async () => {
  for (const separator of [
    '“Evet,” dedi.',
    '“Bir,” dedi, “iki.”',
    '> “Alıntı.”',
    '_Burada kal._',
    '---',
  ]) {
    const { code } = await processor.render(`“Önce.”\n\n${separator}\n\n“Sonra.”`, { fileURL: chapter });
    assert.equal((code.match(/class="dialogue"/g) ?? []).length, 2);
    assert.doesNotMatch(code, /dialogue-even/);
  }
});

test("articles and Markdown without a chapter path remain unchanged", async () => {
  for (const fileURL of [undefined, new URL('../src/content/makale/test.md', import.meta.url)]) {
    const { code } = await processor.render('“Bir.”\n\n“İki.”', { fileURL });
    assert.doesNotMatch(code, /class=/);
  }
});

test("inline quotes preserve punctuation, Markdown and narrator text", async () => {
  const { code } = await processor.render(
    '“Evet,” dedi. “Bir **önemli** şey.”\n\nAdı “Sükûnet” idi.\n\n`“kod”` ve “yarım',
    { fileURL: chapter }
  );
  assert.equal(code, '<p><q>“Evet,”</q> dedi. <q>“Bir <strong>önemli</strong> şey.”</q></p>\n<p>Adı <q>“Sükûnet”</q> idi.</p>\n<p><code>“kod”</code> ve “yarım</p>');
  assert.doesNotMatch(code, /class="dialogue/);
});
