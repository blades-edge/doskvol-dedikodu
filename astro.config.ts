import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import media from "./src/settings/media.json";
import { remarkEngravings } from "./src/utils/engraving.mjs";
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
  markdown: {
    remarkPlugins: [[remarkEngravings, { images: media.darkModeImages }]],
  },
  scopedStyleStrategy: "where",
});
