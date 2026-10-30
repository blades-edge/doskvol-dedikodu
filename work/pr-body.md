Doskvol Dedikoduları’nı edebi gazete düzenine taşır. Ana sayfa son yayıma hazır sayıyı gösterir; her sayının arşiv sayfası ve yazıların ayrı okuma sayfaları vardır. Manşet sayıdaki bir yazıdan, imzalar ortak yazar kayıtlarından gelir; tefrikalar sayılar arasında devam edebilir.

- Gazete tipografisi, mobil düzen ve mürekkep çizgilerinden oluşan gravür.
- Sayı, yazı, yazar ve tefrika koleksiyonları; Pages CMS düzenleme yapılandırması ve taslak sayı desteği.
- İlk kurulumun örnek yazıları, görselleri, eski blog sayfaları ve kullanılmayan tema bağımlılıkları kaldırıldı. RSS gazetenin yazılarını kullanır; özgün MIT telif bildirimi korunur.
- GitHub Pages için site ve base ayarları hazır. PR kontrolü derleme ve içerik testlerini çalıştırır; yayın iş akışı yalnızca main üzerinde çalışır.

Doğrulama: Node.js 24 ile npm ci, 16 içerik testi, üretim derlemesi, Astro check ve lint başarılı. Bağımlılık denetimi 0 güvenlik açığı bildirdi. Yerel üretim önizlemesinde ana sayfa, arşiv ve yeni Roric yazısı 1440/390 pikselde; ana sayfa bağlantıları, görseller ve 5 RSS kaydı doğrulandı.

Taslak PR olarak kalır. Mevcut editorial-preview adresleri ve noindex işareti korunmuştur. GitHub Pages yayını ve CMS üzerinden gerçek kayıt işlemi bu kontrolde denenmedi; merge veya yayın yapılmadı.
