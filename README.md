# Doskvol Dedikoduları

Doskvol’dan haberler, dedikodular ve tefrikalar yayımlayan edebi gazete.

## Yerel geliştirme ve GitHub Pages

Node.js 24 kullanın (`nvm use`).

```sh
npm ci
npm run build
npm run dev
```

Open `http://localhost:4321/doskvol-dedikodu/editorial-preview/`.
Astro uses `/doskvol-dedikodu/` as its base in development and production;
`SITE.website` is `https://blades-edge.github.io/doskvol-dedikodu/`.
Keep internal links and public assets under `import.meta.env.BASE_URL`.

The build uses Astro directly. Jampack was removed with the dependency security
update. Astro generates the optimized images.

### Sayılar ve içerikler

- `src/content/issues/*.json`: sayı numarası, tarih, kapak, manşet yazısı ve baskı bilgileri.
- `src/content/articles/*.md`: haber veya dedikodu metni. Her yazı bir `issue` ve bir `author` kaydına bağlanır. `section` bölüm adını belirler. `order` isteğe bağlı sıralama önceliğidir: küçük değer önce gelir; boş değer 1000 kabul edilir. Eşit öncelikler dosya adına göre sıralanır ve derlemeyi durdurmaz.
- `src/content/authors/*.json`: ortak yazar kayıtları; dosya adı yazar kimliğidir.
- `src/content/serials/*.json`: birden fazla sayıda sürebilen tefrikalar. Bölümler ayrı koleksiyonda tutulur.
- `src/content/chapters/*.md`: tefrika bölümü; `series`, `episode`, yazar ve metin. Sayı bağlantısı burada tutulmaz. Sayı kaydındaki `chapters` listesi yayımlanacak bölümleri seçer; seçilmeyen veya yalnızca taslak sayıya bağlanan bölümler görünmez.

Önizlemenin kökü en yüksek numaralı sayıyı gösterir. Her sayının kalıcı adresi
`/doskvol-dedikodu/editorial-preview/sayilar/001/` biçimindedir. Arşiv
`/doskvol-dedikodu/editorial-preview/arsiv/` adresinde oluşur. Yazıların mevcut
adresleri korunur; yalnızca içerik dosyaları koleksiyona taşınmıştır.

Yeni sayı için mevcut sayı kaydını ve yazılarını örnek alın. Yayıma hazır bir sayının manşeti aynı sayının
bir yazısı olmalı. Kapak ve arşiv başlığı doğrudan bu yazının başlığından alınır;
sayı numaraları ve tefrika içi bölüm numaraları tekrarlanmamalı. Bölümler ve yazar imzaları içerikten oluşur;
önceki/sonraki tefrika bağlantıları bütün sayılardaki bölüm sırasını izler.

`npm run test:editorial` ilişkileri ve sayılar arasında devam eden tefrikaları
kontrol eder. Hatalı ilişkiler derleme sırasında da açıklayıcı bir hatayla durur.
Ana sayfa son yayıma hazır sayıyı, RSS akışı bu sayıların yazılarını gösterir.

### Pages CMS ile düzenleme

[Pages CMS](https://app.pagescms.org/) içinde `blades-edge/doskvol-dedikodu`
deposunu ve **`design/doskvol-editorial-prototype` dalını** seçin. Bu dalda
kaydetmek main’i değiştirmez ve mevcut yayın akışını tetiklemez. Deneme için
önce bir yazının spotunu değiştirip kaydedin; PR’daki Build check sonucu
ilişkilerin ve derlemenin hâlâ doğru olduğunu gösterir. Yerel önizlemeye almak
isterseniz aynı daldayken `git pull --ff-only` çalıştırın.

Menüler: **Sayılar**, **Yazılar**, **Yazarlar**, **Tefrikalar**, **Tefrika bölümleri**. Yazar, sayı,
manşet ve tefrika alanları aramalı seçimlerle doldurulur. Dosya adları
ilişkilerin ve yazı adreslerinin kimliğidir; başlık veya imza değiştirmek
bunları değiştirmez. CMS’de kayıtlı ilişkiler `.json` / `.md` uzantısıyla
saklanır; Astro bunları koleksiyon kimliklerine dönüştürür. Eski uzantısız
kimlikler de desteklenir.

Yeni sayı sırası:

1. Gerekliyse önce yazar ve tefrika kaydını ekleyin.
2. **Sayılar** menüsünden yeni sayıyı, **Taslak sayı** açıkken kaydedin.
   Kapak, spot ve tarih bilgilerini girin; manşet henüz boş kalabilir.
3. **Yazılar** menüsünde metinleri oluşturup bu sayıya ve yazarlarına bağlayın.
   Sıralama önceliğini boş bırakabilirsiniz. İsterseniz öne almak için 10, 20 gibi değerler girin; aynı değeri kullanmak sorun çıkarmaz.
4. Sayıya dönüp kendi yazılarından birini **Manşet yazısı** olarak seçin.
5. **Taslak sayı** seçeneğini kapatıp kaydedin. Derleme kontrolü geçince sayı,
   arşiv ve varsa tefrika bağlantıları otomatik oluşur.

Taslak sayılar ve yazıları önizlemede, arşivde ve tefrika geçişlerinde görünmez.
Haber/dedikodu bölümü sabit seçimdir. Mahalle listesi gazetede kullanılan mevcut adları içerir; serbest mekân alanına listede olmayan mahalle, sokak veya bina yazılabilir. İki alan doluysa birlikte gösterilir.

Tefrika için önce seriyi, ardından **Tefrika bölümleri** menüsünden bölümü hazırlayın. Sonra **Sayılar → Bu sayıdaki tefrika bölümleri** alanında seçin. Bir bölüm yalnızca bir yayımlanmış sayıya bağlanabilir. Aynı seride bölüm numaraları benzersiz olmalıdır. Eski bölümün okuma adresi korunmuştur.

Görseller `src/assets/images` içinde tutulur. CMS, kapak ve metin içi görsel
alanlarına `../../assets/images/...` yolunu yazar; sayı ve yazı klasörlerinden
bu yol aynı konumu gösterir. Astro bunları üretim için işler. Metin editörü
Markdown saklar; kaynak görünümüne de geçilebilir.

`build.yml` checks pull requests. `pages.yml` deploys only `main`, including
manual runs. Before publishing, enable **Settings → Pages → Build and deployment
→ Source: GitHub Actions**. Bu dalda ana sayfa gazetenin son sayısını gösterir.

## Lisans

MIT. Proje [AstroPaper](https://github.com/satnaing/astro-paper) temelinden geliştirilmiştir; özgün telif bildirimi LICENSE dosyasında korunur.
