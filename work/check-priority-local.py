from pathlib import Path
import subprocess,re
article=Path('src/content/articles/roric-katili.md')
original=article.read_bytes()
try:
 for label,value in [('duplicate','order: 1'),('omitted',''),('cleared','order: null')]:
  article.write_text(re.sub(r'^order: 4\n',value+'\n' if value else '',original.decode(),flags=re.M))
  with open(f'work/priority-{label}.log','w') as log:
   subprocess.run(['npm','run','build'],stdout=log,stderr=subprocess.STDOUT,check=True)
  html=Path('dist/editorial-preview/sayilar/001/index.html').read_text()
  assert 'roric-katili/' in html and 'sislerin-arasinda-kaybolan-yuk/' in html
  if label in ('omitted','cleared'):
   assert html.index('sislerin-arasinda-kaybolan-yuk/') < html.index('roric-katili/')
  print(label+': build and issue content passed',flush=True)
finally:
 article.write_bytes(original)
with open('work/priority-restored.log','w') as log:
 subprocess.run(['npm','run','build'],stdout=log,stderr=subprocess.STDOUT,check=True)
print('Original content restored; final build passed',flush=True)
