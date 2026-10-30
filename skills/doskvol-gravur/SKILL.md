---
name: doskvol-gravur
description: "Doskvol Dedikoduları için onaylı tarihî gravür referanslarının çizgi dilinde, #211e1a mürekkepli, saydam zeminli AVIF görseller üret. Kullanıcı Doskvol gravürü istediğinde veya bu stilde yalnızca bir sahne tarif ettiğinde kullan."
---

# Doskvol gravürü

Kullanıcının sahnesini aşağıdaki referansların çizgi dilinde resimle. Görsel üretir; siteye ekleme, içerik değiştirme veya yayımlama izni vermez.

## Stil referansları

Referansları incele ve sahneye uygun olanları üretim aracına **yalnızca stil referansı** olarak ver. Referansın konusunu, kompozisyonunu, yazılarını, imzasını veya filigranını kopyalama.

- [1 — Meyhanede insanlar](assets/reference-01-tavern.png): figürler, yüzler ve organik çapraz tarama.
- [2 — Matbaa](assets/reference-02-printing-press.png): iç mekân, makineler ve mimari tarama.
- [3 — Kent yangını](assets/reference-03-city-fire.png): kent, kalabalık, duman.
- [4 — Gece kampı](assets/reference-04-night-camp.png): karanlık gök, ateş ve yoğun taramalar.
- [5 — Portreler](assets/reference-05-portraits.png): belirgin, kalınlığı değişen çizgiler ve düzenli paralel/çapraz tarama. Figürlü sahneler için güçlü başlangıç referansı.
- [6 — Onaylı kılıç talimi](assets/reference-06-approved-duel-raw.png): kullanıcının **tarzını beğendiği, ImageMagick işleminden geçmemiş üretim**. Stil referansıdır; beyaz dolguları teslim standardı değildir.
- [Önceki kent referansı](assets/reference.png): ek mimari çizgi referansı; yeni altı referans önceliklidir.

## Değişmeyen görsel dil

- 19. yüzyıl resimli gazete ahşap gravürü: keskin, hafif düzensiz, kalınlığı değişen ve tek tek seçilebilen oyma çizgileri. Konturlar, paralel taramalar ve çapraz taramalar formu kurar. Karanlık, çizgi sıklığı ve yönüyle oluşur; çizgiler arasında boyasız boşluklar kalır.
- Yumuşak gri yüzeyler, airbrush, fotoğraf filtresi, sepya yıkama, kâğıt dokusu, 3B render ve kesintisiz büyük koyu dolgular kullanma. Belirgin çizgi yapısı olmadan yalnızca “eski resim” hissi yeterli değildir.
- **Son üründe tek mürekkep: sRGB #211e1a (33, 30, 26).** Çizgi kenarlarında kısmi alfa olabilir. Bütün boyasız alanlar, yüzler ve kumaşlardaki açık alanlar dahil saydamdır. Beyaz dolgu veya hale yoktur.
- Dış mekânda aksi belirtilmedikçe gökyüzü karanlık ve kapalıdır; yönlü taramalar arasında saydam boşluklar kalır. İç mekâna gökyüzü ekleme.
- Doskvol'un gotik/endüstriyel kent hissini koru. Ayın “Dimmer Sisters”ı istenirse iki sönük optik yansımadır; insan değildir.
- Yazı, imza, filigran ve dekoratif çerçeve ekleme. Varsayılan kadraj geniş yataydır; kullanıcı biçimi önceliklidir.

## Üretim

Mevcut görsel üretim aracını kullan; gerektiğinde imagegen skill’ini oku. Yeni sahne için kısa bir sahne tarifi ve seçilen stil referanslarıyla başla. Eski başarısız üretimleri referans olarak taşıma. Kullanıcı mevcut bir görseli dönüştürüyorsa onu ayrıca düzenleme hedefi olarak tanımla.

Saydam zemin seçeneğini aç, ancak üretimde beyaz dolgular kalmasını tekrar tekrar yeniden çizdirerek çözmeye çalışma. Çizgi dili doğruysa **standart kırmızı kanal → alfa dönüşümü** ile beyazı kaldır. Bu işlem yeni çizgi yaratmaz; yumuşak tonlu bir üretimi gravüre dönüştürmez. Özgün üretimi koru.

## Standart saydamlık dönüşümü

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

Kullanıcı konum belirtirse oraya; bu projede `src/assets/images/` içine yeni adla kaydet. Açık değiştirme isteği yoksa mevcut varlığı değiştirme. Dosya bağlantısını ver. Çizgi üslubunun her üretimde birebir aynı olacağını garanti etme.
