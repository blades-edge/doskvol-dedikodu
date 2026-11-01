import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import media from "./src/settings/media.json";
import { remarkEngravings } from "./src/utils/engraving.mjs";
import { footnoteOptions } from "./src/utils/footnotes.mjs";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  base: process.env.PREVIEW_BASE || "/doskvol-dedikodu",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: page =>
        !page.includes("/editorial-preview") && !page.includes("/taslak/"),
    }),
  ],
  markdown: {
    processor: unified({
      remarkRehype: footnoteOptions,
      remarkPlugins: [[remarkEngravings, { images: media.darkModeImages }]],
    }),
  },
  scopedStyleStrategy: "where",
});
