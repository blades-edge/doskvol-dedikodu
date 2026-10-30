from pathlib import Path
names={'issues':'sayi','articles':'makale','serials':'tefrika','chapters':'bolum','authors':'yazar'}
for old,new in names.items():Path('src/content/'+old).rename('src/content/'+new)
# Collection keys are singular; presentation index property names remain internal.
for p in [Path('src/content.config.ts'),Path('src/utils/editorial.ts'),Path('src/components/EditorialIssue.astro')]:
 s=p.read_text()
 for old,new in names.items():
  s=s.replace('"'+old+'"','"'+new+'"').replace('./src/content/'+old,'./src/content/'+new)
 if p.name=='content.config.ts':
  s=s.replace('export const collections = { authors, serials, issues, articles, chapters };','export const collections = { yazar: authors, tefrika: serials, sayi: issues, makale: articles, bolum: chapters };')
 p.write_text(s)
p=Path('.pages.yml');s=p.read_text()
for old,new in names.items():
 s=s.replace('  - name: '+old+'\n','  - name: '+new+'\n').replace('collection: '+old+'\n','collection: '+new+'\n').replace('path: src/content/'+old+'\n','path: src/content/'+new+'\n')
s=s.replace('label: Sayılar','label: Sayı').replace('label: Yazılar','label: Makale').replace('label: Tefrikalar','label: Tefrika').replace('label: Yazarlar','label: Yazar').replace('label: Tefrika bölümleri','label: Tefrika bölümü').replace('yazılar','makaleler').replace('yazı listesi','makale listesi').replace('yazıyı','makaleyi').replace('Manşet yazısı','Manşet makalesi').replace('label: Yazı metni','label: Makale metni');p.write_text(s)
