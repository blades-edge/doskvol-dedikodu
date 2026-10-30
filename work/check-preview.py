import json, subprocess
from pathlib import Path
issue=Path('src/content/sayi/preview-fixture.json')
article=Path('src/content/makale/preview-fixture.md')
try:
 data=json.loads(Path('src/content/sayi/001.json').read_text()) if Path('src/content/sayi/001.json').exists() else json.loads(next(Path('src/content/sayi').glob('*.json')).read_text())
 data.update(number=2,draft=True,preview=True,articles=['preview-fixture.md'])
 data.pop('lead',None)
 issue.write_text(json.dumps(data))
 article.write_text('---\ntitle: PREVIEW_ONLY_FIXTURE\ndescription: Preview fixture description\nsection: Haberler\nauthor: mina-karakarga.json\n---\n\nPREVIEW_BODY_FIXTURE\n')
 with open('work/preview-fixture-build.log','w') as log:
  subprocess.run(['/Users/mert/.npm/_npx/387698761821791d/node_modules/node/bin/node','node_modules/astro/bin/astro.mjs','build'],stdout=log,stderr=log,check=True)
 root=Path('dist')
 page=(root/'taslak/sayi/002/index.html').read_text()
 assert 'Manşet henüz seçilmedi' in page and 'PREVIEW_ONLY_FIXTURE' in page
 assert 'noindex' in page
 assert '/taslak/sayi/002/makale/preview-fixture/' in page
 assert '/taslak/sayi/002/tefrika/kor-nokta/1/' in page
 reading=(root/'taslak/sayi/002/makale/preview-fixture/index.html').read_text()
 assert 'PREVIEW_BODY_FIXTURE' in reading and 'noindex' in reading
 assert not (root/'makale/preview-fixture/index.html').exists()
 assert not (root/'sayi/002/index.html').exists()
 for path in ['index.html','sayi/index.html','rss.xml','sitemap-0.xml']:
  text=(root/path).read_text()
  assert 'PREVIEW_ONLY_FIXTURE' not in text and '/taslak/' not in text,path
 print('PASS: draft issue, scoped article/chapter links, noindex, archive/RSS/sitemap isolation')
 data['preview']=False;issue.write_text(json.dumps(data))
 with open('work/preview-disabled-build.log','w') as log:
  subprocess.run(['/Users/mert/.npm/_npx/387698761821791d/node_modules/node/bin/node','node_modules/astro/bin/astro.mjs','build'],stdout=log,stderr=log,check=True)
 assert not (root/'taslak/sayi/002/index.html').exists()
 print('PASS: disabling preview removes its output')
finally:
 issue.unlink(missing_ok=True);article.unlink(missing_ok=True)
