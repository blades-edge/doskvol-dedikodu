# Doskvol Dedikoduları

Doskvol’dan haber, dedikodu ve tefrika yayımlayan edebi gazete.

## Geliştirme

Node.js 24 kullanın (`nvm use`).

```sh
npm ci
npm run dev
npm run test:editorial
npm run build
npm run preview
```

Yerel kök: `http://localhost:4321/doskvol-dedikodu/`.
Üretim: `https://blades-edge.github.io/doskvol-dedikodu/`.
Astro’nun `base` ayarı `/doskvol-dedikodu` olduğundan iç bağlantılar ve dosya adresleri `import.meta.env.BASE_URL` kullanır.

## İçerik ve CMS

Koleksiyon kimlikleri, klasörler ve CMS menüleri tekil adlar kullanır:

| CMS            | Klasör                 | İşlev                                                    |
| -------------- | ---------------------- | -------------------------------------------------------- |
| Sayı           | `src/content/sayi/`    | Tarih, manşet, kapak, makale ve tefrika bölümü seçimleri |
| Makale         | `src/content/makale/`  | Haber veya dedikodu metni                                |
| Tefrika        | `src/content/tefrika/` | Serinin adı ve tanıtımı                                  |
| Tefrika bölümü | `src/content/bolum/`   | Seriye bağlı bölüm, bölüm numarası ve metin              |
| Yazar          | `src/content/yazar/`   | Ortak imza ve tanıtım                                    |

[Pages CMS](https://app.pagescms.org/) içinde `blades-edge/doskvol-dedikodu` deposunun `main` dalını kullanın. Kaydetmek GitHub’a commit oluşturur ve Pages yayınını tetikler.

İçerik dosyalarının adı kalıcı kimliktir; başlık değişse de dosya adı değişmez. CMS referansları `.md` ve `.json` uzantılarıyla saklanabilir; Astro bunları kimliğe dönüştürür. Mevcut uzantısız referanslar da desteklenir. İçerik şemasındaki alan anahtarları, eski kayıtların korunması için değişmedi.

Yeni sayı için:

1. Gerekli yazar, makale, tefrika ve bölümleri hazırlayın.
2. Sayıyı **Taslak sayı** açıkken oluşturun; kapak, tarih, spot ve bedeli girin.
3. **Bu sayıdaki makaleler** ve **Bu sayıdaki tefrika bölümleri** listelerinden içeriği seçin.
4. Makale listesinde bulunan bir metni **Manşet makalesi** olarak seçin.
5. Hazır olduğunda **Taslak sayı** seçeneğini kapatın.

Seçim listelerinin sırası gazeteye yansır. Makaleler kendi bölümlerinde gruplanır; manşet kapakta önce gelir. Aynı tefrikanın bölümleri tek kutudadır. Okuma sayfalarındaki önceki/sonraki bölüm bağlantıları bölüm numarasına göre ilerler. Bir metin yalnızca bir yayımlanmış sayıya bağlanabilir. Seçilmemiş içerikler ve taslak sayılar normal yayında, arşivde, RSS’te ve tefrika geçişlerinde görünmez.

Mahalle alanı sabit seçenekler içerir; serbest mekân alanına yeni mahalle, sokak veya bina yazılabilir. Görseller `src/assets/images/` içinde saklanır. CMS’nin yazdığı `../../assets/images/...` yolu bütün içerik koleksiyonlarında aynı konuma ulaşır.

## URL düzeni

Aşağıdaki yollar `/doskvol-dedikodu/` kökü altındadır:

| İçerik                   | Yol                      |
| ------------------------ | ------------------------ |
| Son yayımlanan sayı      | `/`                      |
| Sayı arşivi              | `/sayi/`                 |
| Sayı                     | `/sayi/001/`             |
| Makale                   | `/makale/dosya-kimligi/` |
| Tefrika listesi          | `/tefrika/`              |
| Tefrika ve bölüm listesi | `/tefrika/kor-nokta/`    |
| Tefrika bölümü           | `/tefrika/kor-nokta/2/`  |
| RSS                      | `/rss.xml`               |

Tefrika adresi serinin JSON dosyasının kalıcı kimliğini kullanır. Bölüm adresi seri kimliği ve bölüm numarasından oluşur. Eski `/editorial-preview/` adresleri yeni karşılıklarına yönlendirilir; bağlantıdaki `#manset` gibi bölüm işaretleri korunur. GitHub Pages statik olduğu için bu geçiş HTML/JavaScript yönlendirmesidir; sunucudan HTTP 301 yanıtı değildir. Eski adresler site haritasına eklenmez.

## Yayın ve kontroller

`build.yml` PR’larda test ve derlemeyi kontrol eder. `pages.yml`, yalnızca `main` dalından GitHub Pages’e yayın yapar. Pages kaynağı **GitHub Actions** olmalıdır.

`npm run test:editorial` içerik ilişkilerini, seçim sırasını, tefrika gruplamasını, adresleri ve görünüm tercihlerini test eder. `astro check` ve `npm run lint` ek kontrollerdir.

## Lisans

MIT. Proje [AstroPaper](https://github.com/satnaing/astro-paper) temelinden geliştirilmiştir; özgün telif bildirimi LICENSE dosyasında korunur.

## Taslak sayı önizlemesi

Sayıda **Önizleme bağlantısını aç** seçeneğini açıp kaydedin. GitHub Pages derlemesi tamamlanınca `/doskvol-dedikodu/taslak/sayi/002/` gibi, sayı numarası üç basamaklı olan bağlantıyı paylaşabilirsiniz. Önizleme makale ve tefrika bölümü okuma sayfalarını da içerir; manşet seçimi tamamlanmadan da açılır.

Önizleme bağlantısı olan herkes erişebilir. Arşive, RSS’e ve site haritasına eklenmez; sayfalarda `noindex` bulunur. Bu bir erişim koruması değildir. Seçenek varsayılan olarak kapalıdır; kapatıp yeniden yayımladığınızda önizleme adresleri kaldırılır. **Taslak sayı** seçeneği normal yayına çıkmayı, önizleme seçeneği ise paylaşılabilir önizlemeyi ayrı ayrı yönetir.
