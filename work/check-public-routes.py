from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse,unquote
from xml.etree import ElementTree as E
root=Path('dist');base='https://blades-edge.github.io/doskvol-dedikodu/'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('a','link','img','script'):
   v=a.get('href') or a.get('src')
   if v:self.links.append(v)
checked=set()
for file in root.rglob('*.html'):
 if file.name=='404.html':continue
 route=str(file.relative_to(root)).removesuffix('index.html');url=urljoin(base,route);parser=Links();parser.feed(file.read_text())
 for link in parser.links:
  u=urlparse(urljoin(url,link))
  if u.netloc!='blades-edge.github.io':continue
  assert u.path.startswith('/doskvol-dedikodu/'),u.geturl()
  path=unquote(u.path.removeprefix('/doskvol-dedikodu/'));dest=root/path
  if u.path.endswith('/'):dest=dest/'index.html'
  assert dest.exists(),(file,u.geturl())
  checked.add(u.path)
site=''.join(p.read_text() for p in root.glob('sitemap*.xml'));assert '/editorial-preview' not in site
rss=E.fromstring((root/'rss.xml').read_text());items=rss.findall('./channel/item');assert len(items)==7
assert all('/editorial-preview' not in item.findtext('link') for item in items)
for path in ['sayi/001','makale/gece-yarisi-ziyareti','tefrika/kor-nokta/1','tefrika/kor-nokta/2','tefrika/kor-nokta','tefrika','sayi']:
 assert (root/path/'index.html').exists(),path
print(f'All internal targets exist ({len(checked)} distinct paths); 7 RSS items use new routes; sitemap excludes legacy aliases.')
