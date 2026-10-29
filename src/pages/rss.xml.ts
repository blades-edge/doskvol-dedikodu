import rss from "@astrojs/rss";
import { getEditorial } from "@utils/editorial";
import { SITE } from "@config";

export async function GET() {
  const publication = await getEditorial();
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: publication.articles.map(({ data, id }) => ({
      link: `editorial-preview/${id}/`,
      title: data.title,
      description: data.description,
      pubDate: publication.issuesById.get(data.issue.id)!.data.date,
    })),
  });
}
