import { readdirSync } from "node:fs";

export function reservedPageAddresses() {
  const routes = readdirSync("src/pages", {
    withFileTypes: true,
  }).filter(entry => !entry.name.startsWith("["));
  const assets = readdirSync("public");
  return new Set([
    ...routes.map(entry =>
      entry.isDirectory() ? entry.name : entry.name.replace(/\.[^.]+$/, "")
    ),
    ...assets,
    "taslak",
    "_astro",
    "sitemap-index.xml",
    "sitemap-0.xml",
  ]);
}

export function validatePageAddresses(
  pages,
  reserved = reservedPageAddresses()
) {
  const seen = new Set();
  for (const page of pages) {
    const address = page.data.address;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(address ?? ""))
      throw new Error(`${page.id}: Geçersiz sabit sayfa adresi: ${address}`);
    if (reserved.has(address))
      throw new Error(
        `${page.id}: /${address}/ site tarafından kullanılan bir adres.`
      );
    if (seen.has(address))
      throw new Error(
        `${page.id}: /${address}/ başka bir sabit sayfada kullanılıyor.`
      );
    seen.add(address);
  }
}
