---
name: doskvol-gravur
description: "Doskvol Dedikoduları için onaylı tarihî gravür referanslarının çizgi dilinde, #211e1a mürekkepli, saydam zeminli AVIF görseller üret. Kullanıcı Doskvol gravürü istediğinde veya bu stilde yalnızca bir sahne tarif ettiğinde kullan."
---

# Doskvol gravürü

Kullanıcının sahnesini aşağıdaki referansların çizgi dilinde resimle. Görsel üretir; siteye ekleme, içerik değiştirme veya yayımlama izni vermez.

## Stil referansları

Yalnızca aşağıdaki iki onaylı referansı kullan. İkisi de beyaz zeminli, opak siyah-beyaz PNG’dir; son mürekkep/alfa dönüşümü uygulanmamıştır. Kılıç talimi temel çizgi referansıdır; meyhane kavgası aynı dilin başarılı uygulamasıdır. Referansları **yalnızca stil için** kullan; konularını veya kompozisyonlarını yeni sahneye taşıma.

- [Onaylı kılıç talimi](assets/reference-approved-duel-bw.png): keskin konturlar, belirgin paralel ve çapraz taramalar, güçlü siyah-beyaz karşıtlık.
- [Onaylı meyhane kavgası](assets/reference-approved-tavern-brawl-bw.png): yüzlerde, kumaşlarda ve iç mekânda ayrı ayrı okunabilen gravür çizgileri.

## Değişmeyen görsel dil

- 19. yüzyıl resimli gazete ahşap gravürü: keskin, hafif düzensiz, kalınlığı değişen ve tek tek seçilebilen oyma çizgileri. Konturlar, paralel taramalar ve çapraz taramalar formu kurar. Karanlık, çizgi sıklığı ve yönüyle oluşur; çizgiler arasında boyasız boşluklar kalır.
- Yumuşak gri yüzeyler, airbrush, fotoğraf filtresi, sepya yıkama, kâğıt dokusu, 3B render ve kesintisiz büyük koyu dolgular kullanma. Belirgin çizgi yapısı olmadan yalnızca “eski resim” hissi yeterli değildir.
- Dış mekânda aksi belirtilmedikçe gökyüzü karanlık ve kapalıdır; yönlü taramalar arasında beyaz boşluklar kalır. İç mekâna gökyüzü ekleme.
- Doskvol'un gotik/endüstriyel kent hissini koru. Ayın “Dimmer Sisters”ı istenirse iki sönük optik yansımadır; insan değildir.
- Yazı, imza, filigran ve dekoratif çerçeve ekleme. Varsayılan kadraj geniş yataydır; kullanıcı biçimi önceliklidir.

## Üretim

Mevcut görsel üretim aracını kullan; gerektiğinde imagegen skill’ini oku. **ImageGen yalnızca düz beyaz üzerine siyah mürekkepli gravür üretsin.** `transparent_background: false` kullan. Üretim isteminde saydamlık, alfa, arka plan kaldırma veya son mürekkep rengi #211e1a hakkında hiçbir talimat verme. Beyaz alanlar üretim aşamasında doğaldır; bunları yeniden çizdirerek gidermeye çalışma.

Kısa bir sahne tarifi, onaylı stil referansı ve çizgi dili yeterlidir: keskin, kalınlığı değişen konturlar; ayrı ayrı okunabilen paralel/çapraz taramalar; çizgiler arasında beyaz boşluklar; yumuşak gri yıkama ve boyalı gölgeler yok. Kullanıcı mevcut görseli dönüştürüyorsa onu ayrıca **konu ve kompozisyon hedefi** olarak tanımla; çizgi üslubunu onaylı referanstan al. Eski başarısız üretimleri referans olarak taşıma.

Özgün siyah-beyaz üretimi aracın çıktı konumunda koru; `src/assets/images/` içine PNG veya ara dosya kopyalama. Onaylanıp kalıcı stil referansı olacak opak siyah-beyaz PNG’leri bu skill’in `assets/` klasöründe tut. Geçici işlem ve önizleme dosyalarını geçici dizinde tut. Çizgi dili doğruysa aşağıdaki ImageMagick adımıyla beyazı kaldırıp son mürekkep rengini uygula. Bu işlem yeni çizgi yaratmaz; yumuşak tonlu bir üretimi gravüre dönüştürmez.

## Standart saydamlık dönüşümü

Bu aşama ImageGen’den sonradır. Son üründe tek mürekkep sRGB **#211e1a (33, 30, 26)** olur. Yüzler ve kumaşlardaki açık alanlar dahil bütün boyasız alanlar saydamdır; çizgi kenarlarında kısmi alfa korunur.

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
