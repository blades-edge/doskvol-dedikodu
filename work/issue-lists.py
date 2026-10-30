from pathlib import Path
import re,json
# Capture existing membership and order before removing article-owned metadata.
entries=[]
for p in Path('src/content/articles').glob('*.md'):
 s=p.read_text();issue=re.search(r'^issue: ["\']?([^"\'\n]+)',s,re.M);order=re.search(r'^order: (\d+)',s,re.M)
 if issue:entries.append((issue[1].removesuffix('.json'),int(order[1]) if order else 1000,p.name))
 s=re.sub(r'^(issue|order):.*\n','',s,flags=re.M);p.write_text(s)
for p in Path('src/content/issues').glob('*.json'):
 d=json.loads(p.read_text());d['articles']=[name for issue,order,name in sorted(entries,key=lambda v:(v[1],v[2])) if issue==p.stem];p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=Path('src/content.config.ts');s=p.read_text().replace('      chapters: z.preprocess(','''      articles: z.preprocess(
        emptyToUndefined,
        z.array(cmsReference("articles")).default([])
      ),
      chapters: z.preprocess(''');a=s.index('    issue: cmsReference("issues"),');b=s.index('    spoiler:',a);s=s[:a]+s[b:];p.write_text(s)
p=Path('.pages.yml');s=p.read_text().replace('Önce sayıyı taslak olarak kaydedin, sonra ona bağlı yazıyı ekleyip buradan seçin. Kapak başlığı bu yazıdan alınır.','Aşağıdaki yazı listesinde bulunan bir yazıyı seçin. Manşet her zaman kapakta önce gösterilir.');idx=s.index('      - name: chapters\n');s=s[:idx]+'''      - name: articles
        label: Bu sayıdaki yazılar
        type: reference
        description: "Seçim listesinin sırası gazeteye yansır; aynı bölümdeki yazılar bu sırayla görünür. Manşeti de listeye ekleyin. Seçilmeyen yazılar yayımlanmaz."
        options:
          collection: articles
          multiple: true
          value: "{name}"
          label: "{fields.title}"
          search: "name,fields.title"
''' +s[idx:];s=s.replace('Seçilmeyen bölümler yayımlanmaz.','Seçim listesinin sırası gazeteye yansır. Seçilmeyen bölümler yayımlanmaz.');s=s.replace('fields: [title, issue, section, order, author]','fields: [title, section, author]').replace('sort: [title, order]','sort: [title]');a=s.index('      - name: issue\n');b=s.index('      - name: author\n',a);s=s[:a]+s[b:];a=s.index('      - name: order\n');b=s.index('      - { name: spoiler',a);s=s[:a]+s[b:];p.write_text(s)
p=Path('src/utils/editorial.ts');s=p.read_text().replace('  const issuesById = new Map(content.issues.map(entry => [entry.id, entry]));\n','');s=s.replace('  const selectedChapters =','  const selectedArticles = new Map<string, CollectionEntry<"issues">>();\n  const selectedChapters =',1);s=s.replace('if (!lead || lead.data.issue.id !== issue.id)','if (!lead || !issue.data.articles.some(ref => ref.id === lead.id))');needle='    for (const ref of issue.data.chapters ?? []) {';s=s.replace(needle,'''    for (const ref of issue.data.articles ?? []) {
      if (!articlesById.has(ref.id)) throw new Error(`${issue.id}: Yazı bulunamadı: ${ref.id}`);
      if (selectedArticles.has(ref.id)) throw new Error(`${ref.id}: Yazı birden fazla seçilmiş.`);
      selectedArticles.set(ref.id, issue);
    }
''' +needle);s=s.replace('''    if (!issuesById.has(article.data.issue.id))
      throw new Error(`${article.id}: Sayı bulunamadı.`);
    if (issuesById.get(article.data.issue.id)!.data.draft) continue;
''','');s=s.replace('.filter(article => !issuesById.get(article.data.issue.id)!.data.draft)','.filter(article => selectedArticles.has(article.id))');s=s.replace('data: { ...article.data, series: undefined, episode: undefined },','''data: { ...article.data, series: undefined, episode: undefined,
          issue: {collection: "issues" as const, id: selectedArticles.get(article.id)!.id},
          order: selectedArticles.get(article.id)!.data.articles.findIndex(ref => ref.id === article.id),
        },''');s=s.replace('order: 1000,','order: selectedChapters.get(chapter.id)!.data.articles.length + (selectedChapters.get(chapter.id)!.data.chapters ?? []).findIndex(ref => ref.id === chapter.id),');a=s.index('    .sort((a, b) => {',s.index('export function articlesForIssue'));b=s.index('\n}',a);s=s[:a]+'    .sort((a, b) => a.data.order - b.data.order);'+s[b:];p.write_text(s)
