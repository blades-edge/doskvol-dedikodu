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

CMS’de **Gravür ayarları → Gece görünümü uygulanacak gravürler** alanından medya kütüphanesindeki görselleri seçin. Seçim isteğe bağlıdır ve başlangıçta boştur. Seçilen dosyalar kapakta ve Markdown görsellerinde `engraving-dark` class’ını alır; yalnızca gece temasında `filter: invert(1) hue-rotate(120deg)` ve `background-color: #d3ddc3` uygulanır. Kaydedip site yeniden derlendiğinde seçim bütün kullanımlara yansır.

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

`build.yml` PR’larda test ve derlemeyi kontrol eder. Aynı depodaki PR’ların başarılı çıktıları `/doskvol-dedikodu/taslak/pr-42/` biçiminde yayımlanır; PR’a bağlantı yorumu eklenir ve her başarılı derlemede güncellenir. PR kapandığında önizleme silinir. Fork PR’ları yalnızca derleme kontrolünden geçer.

`pages.yml`, üretim ve PR çıktılarını `gh-pages` dalında birleştirir; `main` yayını açık PR önizlemelerini korur. Pages kaynağı **GitHub Actions** olarak kalmalıdır. İlk kurulumda bu değişiklikleri `main` dalına alıp üretim yayınını tamamlayın. `github-pages` environment’ının `main` dalına izin vermesi yeterlidir: önizleme yayını `workflow_run` üzerinden ana daldaki güvenilir workflow ile yapılır. `gh-pages` dalına Actions botunun yazabilmesi gerekir.

Önizlemeler herkese açıktır ve `noindex` taşır; bu bir erişim koruması değildir. Yerelde aynı yolu denemek için `PREVIEW_BASE=/doskvol-dedikodu/taslak/pr-42/ npm run build` kullanılabilir.

`npm run test:editorial` içerik ilişkilerini, seçim sırasını, tefrika gruplamasını, adresleri ve görünüm tercihlerini test eder. `astro check` ve `npm run lint` ek kontrollerdir.

## Lisans

MIT. Proje [AstroPaper](https://github.com/satnaing/astro-paper) temelinden geliştirilmiştir; özgün telif bildirimi LICENSE dosyasında korunur.

## Taslak sayılar

**Taslak sayı** açık olan sayılar ana yayında görünmez. PR önizlemesinde taslaklar da arşive ve sayı sayfalarına dahil edilir; manşet tamamlanmadan görüntülenebilir. Ayrı bir sayı önizleme anahtarı veya `/taslak/sayi/NUMARA/` adresi yoktur. Örneğin PR #42 içindeki ikinci sayı `/doskvol-dedikodu/taslak/pr-42/sayi/002/` adresindedir.

## Gravür üretim standardı

[doskvol-gravur skill’i](skills/doskvol-gravur/SKILL.md), onaylı çizgi referansını, üretim kurallarını ve AVIF doğrulama aracını içerir. Örnek: `$doskvol-gravur Sis içindeki kanalda terk edilmiş bir yolcu teknesi.`

Sabitler: `#211e1a` mürekkep, tamamen saydam zemin, AVIF teslimi; dış mekânda aksi belirtilmedikçe karanlık ve kapalı gökyüzü. Tonlar paralel/çapraz taramayla kurulur. Gazete kâğıdının rengi görsele gömülmez.

Skill’in `scripts/finalize.py` aracı Python 3, ImageMagick 7 ve AV1 destekli libheif kullanır. RGB rengini ve alfa kanalını AVIF’i tekrar açarak doğrular. Mevcut site görselleri bu standardı tanımlarken değiştirilmedi. Görsel üretim tarzı referansla yönlendirilir; çizimlerin birebir aynı olması garanti edilmez.

Başka bir bilgisayarda bu skill klasörünü kişisel Codex skills dizinine kopyalayabilir veya bağlayabilirsiniz. Yerel kurulum bu depodaki kaynağa bağlıdır; depoyu taşırsanız bağlantıyı güncelleyin.
