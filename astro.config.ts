import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  base: "/doskvol-dedikodu",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: page =>
        !page.includes("/editorial-preview") && !page.includes("/taslak/"),
    }),
  ],
  scopedStyleStrategy: "where",
});
