import { articlePath } from "@utils/paths";
import rss from "@astrojs/rss";
import { getEditorial } from "@utils/editorial";
import { SITE } from "@config";

export async function GET() {
  const publication = await getEditorial();
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: publication.articles.map(entry => ({
      link: articlePath(entry),
      title: entry.data.title,
      description: entry.data.description,
      pubDate: publication.issuesById.get(entry.data.issue.id)!.data.date,
    })),
  });
}
