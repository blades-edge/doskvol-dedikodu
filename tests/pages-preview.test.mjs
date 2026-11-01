import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mergePages } from "../scripts/merge-pages.mjs";

test("production preserves PR previews and replaces old draft issues; closing removes only its PR", () => {
  const root = mkdtempSync(join(tmpdir(), "pages-preview-"));
  try {
    const target = join(root, "site");
    const incoming = join(root, "incoming");
    mkdirSync(incoming);
    writeFileSync(join(incoming, "index.html"), "new");
    mergePages(target, incoming, "preview", "42");
    mergePages(target, incoming, "preview", "57");
    mkdirSync(join(target, "taslak/sayi/001"), { recursive: true });
    writeFileSync(join(target, "taslak/sayi/001/index.html"), "old draft");
    writeFileSync(join(target, "stale.html"), "old");
    mergePages(target, incoming, "production");
    assert.equal(readFileSync(join(target, "index.html"), "utf8"), "new");
    assert.ok(existsSync(join(target, "taslak/pr-42/index.html")));
    assert.ok(!existsSync(join(target, "taslak/sayi/001")));
    assert.ok(!existsSync(join(target, "stale.html")));
    mergePages(target, incoming, "remove", "42");
    assert.ok(!existsSync(join(target, "taslak/pr-42")));
    assert.ok(existsSync(join(target, "taslak/pr-57/index.html")));
    assert.throws(() => mergePages(target, incoming, "remove", "../57"));
    mkdirSync(join(incoming, ".git"));
    assert.throws(() => mergePages(target, incoming, "preview", "57"));
    assert.ok(existsSync(join(target, "taslak/pr-57/index.html")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
