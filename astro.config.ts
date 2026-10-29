import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  base: "/doskvol-dedikodu",
  trailingSlash: "always",
  integrations: [sitemap()],
  scopedStyleStrategy: "where",
});
