from pathlib import Path
import json,subprocess
p=Path('src/content/issues/001.json');original=p.read_bytes()
def build():
 with open('work/issue-list-integration.log','a') as log:subprocess.run(['npm','run','build'],stdout=log,stderr=subprocess.STDOUT,check=True)
def check():
 d=json.loads(p.read_text());html=Path('dist/editorial-preview/sayilar/001/index.html').read_text()
 for key in ('articles','chapters'):
  names=[name.removesuffix('.md') for name in d[key] if name!=d['lead']]
  positions=[html.index(f'editorial-preview/{name}/') for name in names]
  assert positions==sorted(positions),(key,positions)
try:
 d=json.loads(original);d['articles'].reverse();d['chapters'].reverse();p.write_text(json.dumps(d,ensure_ascii=False));build();check();print('Reversed article and chapter lists render in exactly the selected order.',flush=True)
finally:p.write_bytes(original)
build();check();print('Original selection restored; chapter 1 precedes chapter 2.',flush=True)
