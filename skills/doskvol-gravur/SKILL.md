---
name: doskvol-gravur
description: "Doskvol Dedikoduları için onaylı tarihî gravür referanslarının çizgi dilinde, #211e1a mürekkepli, saydam zeminli AVIF görseller üret. Kullanıcı Doskvol gravürü istediğinde veya bu stilde yalnızca bir sahne tarif ettiğinde kullan."
---

# Doskvol gravürü

Kullanıcının sahnesini aşağıdaki referansın çizgi dilinde resimle. Son onaydan sonra AVIF üretip medya kaydını ekle; makaleye yerleştirme veya yayımlama bu kapsamda değildir.

## Girdi ve referans seçimi

- İlk sahne girdisi yazılı veya sözlü bir anlatımsa doğrudan üretime başla.
- İlk girdi bir resimse, ImageGen çağrısından önce sor: “Resmi doğrudan görsel referans olarak mı kullanayım, yoksa gördüklerini muhabirin gazete ressamına anlatması gibi yalnızca yazıyla mı tasvir edeyim?” Kullanıcı zaten tercihini belirttiyse tekrar sorma.
- Tasvir seçildiyse resmi incele ve konu, nesne, kıyafet, mekân veya kompozisyon özelliklerini yazıyla anlat. **O resmi ImageGen'e gönderme.** Sonradan gelen nesne/giysi resimleri için de aynı ayrımı uygula.
- Doğrudan görsel referans seçildiyse onu yalnızca konu/kompozisyon hedefi olarak etiketle; stil referansı yapma.
- Sıfırdan üretim istendiğinde önceki üretimleri, başarılı olsalar bile, referans olarak gönderme. Yalnızca mevcut görsel üzerinde açıkça değişiklik istendiğinde onu düzenleme hedefi olarak kullan.

## Stil referansı

Tek stil referansı [onaylı kılıç talimi](assets/reference-approved-duel-bw.png) görselidir. Beyaz zeminli, opak siyah-beyaz PNG'dir; son mürekkep/alfa dönüşümü uygulanmamıştır. İnsanların çizimi, yüzler, kumaşlar ve taramalar için bunu esas al. Konusunu veya kompozisyonunu yeni sahneye taşıma. Meyhane kavgasını veya önceki üretimleri stil referansı olarak kullanma.

## Değişmeyen görsel dil

- 19. yüzyıl resimli gazete ahşap gravürü: vakti bol bir sanatçının ince işçiliğini değil, aceleci bir gazete ressamının canlı, ekonomik çizgisini taklit et. Referanstan biraz daha kalın, güçlü konturlar ve daha kalın, tek tek seçilebilen tarama çizgileri kullan; çizgilerin kalınlığı değişsin, hafif düzensizlikleri kalsın. Gereksiz ince ayrıntı ve saç teli gibi sık çizgilerden kaçın. Konturlar, paralel taramalar ve çapraz taramalar formu kurar. Karanlık, çizgi sıklığı ve yönüyle oluşur; çizgiler arasında boyasız boşluklar kalır.
- Yumuşak gri yüzeyler, airbrush, fotoğraf filtresi, sepya yıkama, kâğıt dokusu, 3B render ve kesintisiz büyük koyu dolgular kullanma. Belirgin çizgi yapısı olmadan yalnızca “eski resim” hissi yeterli değildir.
- Doskvol’da dış mekân gökyüzü hep karanlık ve kapalıdır; yönlü taramalar arasında beyaz boşluklar kalır. İç mekâna gökyüzü ekleme.
- Doskvol'un sıkışık, dikey, gotik/endüstriyel kent hissini koru. Yoksul mahallelerde küçük salaş işletmeler yaşam alanlarıyla iç içedir; dar sokaklar, üst üste katlar ve bol çamaşır ipi kullan. Ayın “Dimmer Sisters”ı istenirse iki sönük optik yansımadır; insan değildir.
- Yazı, imza, filigran ve dekoratif çerçeve ekleme. Varsayılan kadraj geniş yataydır; kullanıcı biçimi önceliklidir.

## Üretim

Mevcut görsel üretim aracını kullan; gerektiğinde imagegen skill’ini oku. **ImageGen yalnızca düz beyaz üzerine siyah mürekkepli gravür üretsin.** `transparent_background: false` kullan. Üretim isteminde saydamlık, alfa, arka plan kaldırma veya son mürekkep rengi #211e1a hakkında hiçbir talimat verme. Beyaz alanlar üretim aşamasında doğaldır; bunları yeniden çizdirerek gidermeye çalışma.

Kısa bir sahne tarifi, tek onaylı stil referansı ve çizgi dili yeterlidir: keskin, biraz daha kalın ve kalınlığı değişen konturlar; ayrı ayrı okunabilen paralel/çapraz taramalar; çizgiler arasında beyaz boşluklar; yumuşak gri yıkama ve boyalı gölgeler yok. Kullanıcı mevcut görseli dönüştürüyorsa onu ayrıca **konu ve kompozisyon hedefi** olarak tanımla; çizgi üslubunu onaylı referanstan al. Eski başarısız üretimleri referans olarak taşıma.

Özgün siyah-beyaz üretimi aracın çıktı konumunda koru; `src/assets/images/` içine PNG veya ara dosya kopyalama. Onaylanıp kalıcı stil referansı olacak opak siyah-beyaz PNG’leri bu skill’in `assets/` klasöründe tut. Geçici işlem ve önizleme dosyalarını geçici dizinde tut. Önce siyah-beyaz gravürü kullanıcıya sun ve son onayı bekle. Revizyonları bu aşamada yap. **Kullanıcı son görseli onaylayıp AVIF üretimini istediğinde** aşağıdaki ImageMagick adımıyla beyazı kaldırıp son mürekkep rengini uygula. Sadece kendi kalite değerlendirmen dönüşümü başlatmak için yeterli değildir. Bu işlem yeni çizgi yaratmaz; yumuşak tonlu bir üretimi gravüre dönüştürmez.

## Standart saydamlık dönüşümü

Bu aşama siyah-beyaz üretimin son kullanıcı onayından sonradır. Son üründe tek mürekkep sRGB **#211e1a (33, 30, 26)** olur. Yüzler ve kumaşlardaki açık alanlar dahil bütün boyasız alanlar saydamdır; çizgi kenarlarında kısmi alfa korunur.

ImageMagick 7 yeterlidir; bu adım için ek Python script’i gerekmez. Kaynağı sRGB/8 bit olarak oku. **Alfa = (255 − kırmızı kanal) × mevcut alfa / 255**; ardından bütün RGB’yi #211e1a yap. Böylece beyaz saydam, siyah opak, ara değerler kısmen saydam olur. Mevcut alfa ile çarpma, zaten saydam alanların gizli siyah RGB’sinin opaklaşmasını engeller.

Aşağıdaki komutlarda `source` özgün üretim, `scratch` yeni bir geçici dizindir. Çıktılar için yeni dosya adları seç:

```sh
source='/absolute/path/generated.png'
scratch=$(mktemp -d)
magick "$source" -colorspace sRGB -depth 8 \
  -channel R -separate +channel -negate "$scratch/inverse-red.png"
magick "$source" -alpha extract -depth 8 "$scratch/original-alpha.png"
magick "$scratch/inverse-red.png" "$scratch/original-alpha.png" \
  -compose Multiply -composite "$scratch/alpha.png"
magick "$source" -colorspace sRGB -alpha off \
  -fill '#211e1a' -colorize 100 "$scratch/alpha.png" \
  -alpha off -compose CopyOpacity -composite -depth 8 "$scratch/ink.png"
```

Eşikleme uygulama; çizgi kenarlarının alfa ayrıntısını koru. Açık alanlar artık saydam olmalıdır; yalnızca görüntünün dış çevresini kesmek yeterli değildir.

## AVIF ve doğrulama

Son ürün **AVIF**. ImageMagick kanal dönüşümünü yapar; mevcut [scripts/finalize.py](scripts/finalize.py) ise kayıpsız AVIF kodlama ve kesin renk/alfa doğrulaması için korunur. Python 3, ImageMagick 7 ve AV1 kodlayıcılı libheif (`heif-enc`) gerekir. Script Homebrew libheif konumlarını da bulur.

```sh
python3 <skill-dizini>/scripts/finalize.py "$scratch/ink.png" <yeni-cikti.avif>
```

Araç boyutları ve alfayı korur, RGB kimlik matrisiyle kayıpsız AVIF kodlar, tekrar açıp görünür her pikselin #211e1a olduğunu ve tüm alfa değerlerinin değişmediğini doğrular. Mevcut dosyayı ezmez. **Özgün üretimi doğrudan bu script’e verme:** script beyazı alfaya dönüştürmez; önce yukarıdaki kanal işlemi gerekir. Doğrulama başarısızsa dosyayı son ürün olarak sunma veya sessizce PNG’ye geçme.

AVIF’i açık gazete zemini ve farklı bir renk/dama zemini üzerinde incele: yüzler, kumaşlar ve çizgiler arasındaki boşluklar alttaki zemini göstermeli; opak beyazlar, haleler veya koyu dikdörtgen oluşmamalı. Önizleme için geçici zeminli kopyalar yapılabilir; bunları teslim edilen AVIF’e gömme. Krem zeminli önizlemenin yalnızca önizleme olduğunu belirt.

Bu projede üretilen son AVIF’leri yalnızca `src/assets/images/` içine yeni adla kaydet. Bu klasöre üretimden yalnızca son AVIF dosyaları gider; referans PNG’leri, özgün üretimler ve önizlemeler gitmez. Açık değiştirme isteği yoksa mevcut varlığı değiştirme. Dosya bağlantısını ver. Çizgi üslubunun her üretimde birebir aynı olacağını garanti etme.

## Medya kaydı

Doğrulanmış her son AVIF'i **mutlaka** proje kökündeki `src/settings/media.json` dosyasının `darkModeImages` listesine ekle. Mevcut kayıtları koru, aynı yolu iki kez ekleme. Yol biçimi: `../../assets/images/<dosya-adi>.avif`. Bu kayıt gravürün dark mode'da doğru gösterilmesi içindir; AVIF üretiminin bir parçasıdır ve ayrıca izin istemez. Taslak PNG'leri veya üretilmemiş dosyaları kaydetme.

Teslimden önce JSON'un geçerli olduğunu ve eklenen yolun üretilen AVIF'e karşılık geldiğini doğrula. Makalenin kapak alanını veya içeriğini değiştirmek bu kayıt işlemine dahil değildir.

## Makaleye ekleme

Eğer orijinal talepte mevcut bir makale varsa, son AVIF dosayasını bu makaleye bir kapak resmi (`cover`) olarak ekle. Alternatif metin (`coverAlt`) ve altyazısını (`coverCaption`) da yaz. Eğer zaten kapak resmi varsa kullanıcının tercihini sor. Yenilemek veya eskiyi tutmak.
