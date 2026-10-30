---
name: doskvol-gravur
description: "Doskvol Dedikoduları için referans gravürün çizgi dilinde, #211e1a mürekkepli, saydam zeminli AVIF görseller üret. Kullanıcı Doskvol gravürü istediğinde veya bu stilde yalnızca bir sahne tarif ettiğinde kullan."
---

# Doskvol gravürü

Kullanıcının verdiği sahneyi bu üslupla resimle. Eksik olan yalnızca görsel tercihlerse soru sormadan aşağıdaki varsayılanları kullan. Bu skill bir görsel üretir; siteye ekleme, içerik değiştirme veya yayımlama izni vermez.

## Değişmeyen görsel dil

- İncele ve üretimde stil referansı olarak ver: [assets/reference.png](assets/reference.png). Referansın konusunu veya kompozisyonunu kopyalama; çizgi karakterini kullan. Referanstaki açık gökyüzü, aşağıdaki yeni varsayılanın istisnasıdır.
- Eski bir edebi gazete için elle oyulmuş bakır/çelik baskı gravürü. Kalınlığı değişen keskin, hafif düzensiz kontur çizgileri; ince paralel taramalar ve çapraz taramalar. Gölgeyi çizgi yoğunluğu ve yönü kurar. Taş, su, ahşap ve duman kendi çizgi ritmine sahip olur.
- Fotoğraf, fotoğraf üzerine kenar filtresi, yumuşak gri tonlama, airbrush, suluboya, sepya yıkama, kâğıt dokusu ve 3B render kullanma. Siyah bir dikdörtgen veya kesintisiz büyük dolgu alanlarıyla karanlık üretme.
- **Tek mürekkep: sRGB `#211e1a` (33, 30, 26).** Diğer tonları renk değiştirerek değil tarama sıklığı ve çizgi kalınlığıyla kur. Kenar yumuşatması için kısmi alfa olabilir.
- **Zemin tamamen saydam.** Beyaz, krem veya gazete kâğıdı görselin parçası değildir. Işıklı ve boş alanlar da boyasız/saydamdır. Dama tahtası deseni çizme. Nesnelerin altında beyaz dolgu veya kenarlarında beyaz hale bırakma.
- **Dış mekânda, aksi belirtilmedikçe gökyüzü karanlık ve kapalıdır.** Bulutları ve geceyi sık, yönlü taramalarla göster; aralarda saydam boşluklar kalsın. Gün ışığı, açık gökyüzü veya güneş kendiliğinden eklenmez. İç mekân için gökyüzü ekleme.
- Doskvol konularında gotik ve endüstriyel kent hissini koru. Ayın “Dimmer Sisters”ı istenirse bunlar iki yanındaki sönük optik yansımalardır; insan figürleri değildir.
- Yazı, imza, filigran ve dekoratif çerçeve ekleme. Kullanıcı biçim vermediyse gazete gravürü için referans gibi geniş yatay kadraj kullan; küçük ikon isteniyorsa o kullanıma uygun kadraj seç.

## Üretim ve teslim

1. Mevcut görsel üretim aracını kullan (bu ortamda `image_gen`; gerektiğinde `imagegen` skill’ini oku). Saydam zemin seçeneğini aç. Sahneyi, yukarıdaki sabitleri ve referansın yalnızca üslup için kullanıldığını üretim isteğine açıkça ekle. Yeni sahne için referansı düzenleme hedefi olarak tarif etme.
2. Üretim çıktısını görsel olarak incele. Kâğıt/zemin, fotoğraf hissi, gri yıkama veya açık gökyüzü oluşmuşsa uygun bir yeniden üretim/düzenleme yap. Özgün çıktıyı koru; sonucu farklı adla kaydet.
3. Kesin renk ve format için aşağıdaki aracı çalıştır. Python 3, ImageMagick 7 (`magick`) ve AV1 kodlayıcısı bulunan libheif (`heif-enc`) gerekir. Araç macOS’ta Homebrew libheif konumlarını da bulur. Kaynak PNG’nin saydamlığı zaten mevcut olmalıdır; araç kâğıt silmez veya sahnenin tonlarını yeniden yorumlamaz.

   ```sh
   python3 <skill-dizini>/scripts/finalize.py <saydam-kaynak.png> <yeni-cikti.avif>
   ```

   Araç boyutları ve alfayı korur, bütün çizgileri `#211e1a` yapar, RGB kimlik matrisiyle kayıpsız AVIF kodlar ve tekrar açarak **görünür her pikselin RGB’sini ve tüm alfa değerlerini** doğrular. Eski bir dosyanın üzerine yazmaz. Doğrulama başarısızsa yanlış dosyayı son ürün olarak sunma veya sessizce PNG’ye geçme; nedeni bildir.
4. AVIF’i hem açık gazete zemini üzerinde hem saydamlık kontrolünde görsel olarak incele. Önizleme için zeminli geçici kopya oluşturabilirsin; teslim edilen AVIF’e zemin gömme. Önizleme PNG’si oluşturulduysa bunun yalnızca önizleme olduğunu belirt.
5. Son ürün `.avif` olmalı. Kullanıcı konum belirtirse oraya, proje içinse projenin görsel klasörüne kaydet. Bu repoda konum `src/assets/images/`. Bir varlığı açıkça değiştirme isteği yoksa mevcut dosyaya dokunma. Dosya bağlantısını ver; görsel üslubun her üretimde birebir aynı olacağını garanti etme.

## Örnek kullanım

`$doskvol-gravur Sis içindeki kanalda terk edilmiş bir yolcu teknesi.`

Bu istek tek başına yeterlidir: mürekkep, saydamlık, kapalı gece göğü ve AVIF teslimi yukarıdan gelir. Kullanıcının açıkça belirttiği hava ve kadraj tercihi varsayılanı geçersiz kılar.
