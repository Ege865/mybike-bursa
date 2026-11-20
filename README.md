# My Bike Bursa — web sitesi

Statik site (HTML + CSS + JS), derleme adımı yok. Herhangi bir sunucuya olduğu gibi yüklenebilir.

## Sayfalar
- `index.html` — ana sayfa (atölye + vitrin)
- `magaza.html` — kategorili mağaza (`?kat=enduro`, `?kat=fren`, `?q=kask`, `?sirala=artan`)
- `urun.html` — ürün detay (`?id=e1`)
- `atolye.html` — atölye tanıtımı, hizmetler, servis randevu formu

## Yayına almadan önce
1. **İletişim:** `assets/js/app.js` en üstteki `CONTACT` (e-posta, telefon, ilçe/sokak, saatler).
   Atölye sayfasındaki saatler örnek olarak yazıldı.
2. **Ürünler ve fiyatlar:** `assets/js/data.js` → `MYBIKE.products`. Şu an örnek ürünler var.
3. **Ürün fotoğrafı:** ürüne `img: "assets/img/urunler/e1.jpg"` ekleyin (detay sayfası için
   `images: [...]`). "Görsel eklenecek" alanı otomatik fotoğrafla değişir.
4. **Atölye / banner fotoğrafları:** HTML'de `role="img"` olan `.ph` alanları ve
   `data-ph="..."` alanları. `data-ph` olanlara `data-img="assets/img/atolye-1.jpg"` eklemek yeterli.
5. **Sipariş:** sepet şimdilik siparişi e-posta ile gönderiyor. Online ödeme için
   iyzico / PayTR ya da ikas / Shopify gibi bir altyapı bağlanmalı.

## Tasarım
- Ana zemin: taş rengi `#ecece7`; vurgu: logodan altın `#d9a418` ve siyah `#0b0b0a`
  (`assets/css/style.css` en üstteki değişkenler).
- Yazı tipi: Work Sans. Hareket: GSAP ScrollSmoother (yumuşak kaydırma) + açılış girişi;
  "hareketi azalt" tercihinde kapanır.
- Logo `assets/img/logo.jpg` siyah zeminli; koyu alanlarda `mix-blend-mode: screen` ile
  zemin görünmez. Şeffaf PNG/SVG logo gelirse bu ayara gerek kalmaz.

## Supabase ve yönetim paneli
- Ürünler Supabase'deki `products` tablosundan okunur (`assets/js/store.js`). Bağlantı kurulamazsa
  `assets/js/data.js` içindeki liste gösterilir.
- Yönetim paneli: `admin.html` (arama motorlarına kapalı). Supabase'de oluşturulan ve `admins`
  tablosuna eklenen hesapla giriş yapılır; ürün ekleme, düzenleme, silme, fiyat ve fotoğraf yükleme.
- Kurulum dosyaları: `supabase/schema.sql` (tablolar, güvenlik kuralları, fotoğraf alanı) ve
  `supabase/seed.sql` (ilk ürünler).
- Kategoriler hâlâ `assets/js/data.js` içinde tanımlı; yeni kategori gerekirse oraya eklenir.

## Yayın (Cloudflare Pages)
- Cloudflare Pages, GitHub deposuna bağlıdır; `main` dalına her gönderimde site otomatik yayınlanır.
- Derleme ayarları: Build command `sh build.sh`, Build output directory `dist`.
- `build.sh` yalnızca site dosyalarını `dist/` klasörüne kopyalar (SQL ve README yayına çıkmaz).
- `_headers`: güvenlik başlıkları, yönetim panelinin arama motorlarına kapalı olması, font ve kütüphanelerin önbellek süresi.
