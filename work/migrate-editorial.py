from pathlib import Path
import json,re
p=Path('src/content.config.ts');s=p.read_text().replace('"authors" | "serials"','"authors" | "serials" | "chapters"');s=s.replace('      cover: image(),','      chapters: z.array(cmsReference("chapters")).default([]),\n      cover: image(),');s=s.replace('section: z.string().min(1),','section: z.enum(["Haberler", "Dedikodular"]),\n    district: optionalText,');a=s.index('    series: z.preprocess',s.index('const articles'));b=s.index('    spoiler: optionalText,',a);s=s[:a]+s[b:];s=s.replace('export const collections', '''const chapters = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    author: cmsReference("authors"),
    series: cmsReference("serials"),
    episode: z.number().int().positive(),
    spoiler: optionalText,
  }),
});

export const collections''').replace('{ authors, serials, issues, articles }','{ authors, serials, issues, articles, chapters }');p.write_text(s)
p=Path('src/content/articles/kor-noktanin-guncesi.md');s=p.read_text();s=re.sub(r'^(section|issue|order):.*\n','',s,flags=re.M);Path('src/content/chapters').mkdir(exist_ok=True);Path('src/content/chapters/'+p.name).write_text(s);p.unlink()
p=Path('src/content/issues/001.json');d=json.loads(p.read_text());d['chapters']=['kor-noktanin-guncesi.md'];p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
# Preserve existing place labels; move known district values to the new field.
for p in Path('src/content/articles').glob('*.md'):
 s=p.read_text();s=re.sub(r'^location: ("?)(İpekyalı|Rıhtım|Kömürsırtı)\1$',r'district: "\2"',s,flags=re.M);p.write_text(s)
for name in ['src/components/EditorialIssue.astro','src/pages/editorial-preview/arsiv.astro','src/layouts/EditorialReading.astro']:
 p=Path(name);s=p.read_text();s=re.sub(r'    <div class="notice">.*?</div>\n','',s,flags=re.S);p.write_text(s)
p=Path('src/components/EditorialIssue.astro');s=p.read_text().replace('lead.data.location ?? lead.data.section','[lead.data.district, lead.data.location].filter(Boolean).join(" · ") || lead.data.section').replace('article.data.location ?? article.data.section','[article.data.district, article.data.location].filter(Boolean).join(" · ") || article.data.section');p.write_text(s)
p=Path('src/layouts/EditorialReading.astro');s=p.read_text().replace('import type { CollectionEntry } from "astro:content";\n','').replace('type EditorialIndex,','type EditorialIndex,\n  type EditorialEntry,').replace('article: CollectionEntry<"articles">;','article: EditorialEntry;');p.write_text(s)
