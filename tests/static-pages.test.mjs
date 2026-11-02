import assert from "node:assert/strict";
import test from "node:test";
import { reservedPageAddresses, validatePageAddresses } from "../src/utils/static-pages.mjs";

const page = address => ({ id: `page-${address}`, data: { address } });

test("independent pages accept distinct permanent addresses", () => {
  assert.doesNotThrow(() => validatePageAddresses([page("kunye"), page("doskvol-takvimi")]));
});

test("site routes, public files and deployment paths are reserved", () => {
  const reserved = reservedPageAddresses();
  for (const address of ["sayi", "makale", "tefrika", "editorial-preview", "404", "taslak", "_astro", "rss.xml", "robots.txt", "favicon.svg", "sitemap-index.xml"]) {
    assert.ok(reserved.has(address), address);
    assert.throws(() => validatePageAddresses([page(address)]));
  }
});

test("duplicate and ambiguous addresses fail instead of being normalized", () => {
  assert.throws(() => validatePageAddresses([page("kunye"), page("kunye")]), /başka bir sabit sayfada/);
  for (const address of ["", "/kunye/", "Kunye", "künye", "sayi/001", "../kunye", "%73ayi", "kunye?x", "kunye#x", "kunye.html", "-kunye", "kunye-", "a--b"]) {
    assert.throws(() => validatePageAddresses([page(address)]), /Geçersiz/);
  }
  assert.throws(() => validatePageAddresses([page("future-route")], new Set(["future-route"])), /site tarafından/);
});
