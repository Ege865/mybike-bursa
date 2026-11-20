-- Mevcut 13 ürünü tabloya ekler (bir kez çalıştırın)
insert into public.products (id, cat, name, price, old_price, badge, img, images, specs, sort) values
  ('yt-dh', 'downhill', 'YT Industries Downhill Bisikleti — Fox 40 / Float X2', null, null, null, 'assets/img/urunler/yt-dh-4.jpg', array['assets/img/urunler/yt-dh-4.jpg','assets/img/urunler/yt-dh-1.jpg','assets/img/urunler/yt-dh-2.jpg','assets/img/urunler/yt-dh-3.jpg']::text[], '{"Ön maşa":"Fox 40 Factory, çift taç","Arka amortisör":"Fox Float X2","Ön lastik":"Maxxis Assegai","Arka lastik":"Schwalbe Eddy Current"}'::jsonb, 10),
  ('sram-gx-eagle', 'grup-seti', 'SRAM GX Eagle 12 Vites Grup Seti', null, null, null, 'assets/img/urunler/sram-gx-eagle.jpg', '{}'::text[], '{"Vites":"1×12","Set içeriği":"Arka aktarıcı, vites kolu, krank ve aynakol, kaset, zincir, orta göbek"}'::jsonb, 20),
  ('muc-off-valf', 'tubeless', 'Muc-Off Tubeless Valf 44 mm — 7075 Alüminyum', null, null, null, 'assets/img/urunler/muc-off-tubeless-valf.jpg', '{}'::text[], '{"Uzunluk":"44 mm","Valf tipi":"Presta","Malzeme":"7075 alüminyum","Renkler":"Turkuaz, yeşil, pembe, gümüş, kırmızı, mor, altın, mavi, turuncu, yanardöner"}'::jsonb, 30),
  ('impact-elcik-siyah', 'elcik', 'Impact Kilitli Elcik — Siyah', null, null, null, 'assets/img/urunler/impact-elcik-siyah.jpg', '{}'::text[], '{}'::jsonb, 40),
  ('impact-elcik-kirmizi', 'elcik', 'Impact Kilitli Elcik — Kırmızı', null, null, null, 'assets/img/urunler/impact-elcik-kirmizi.jpg', '{}'::text[], '{}'::jsonb, 50),
  ('impact-elcik-mavi', 'elcik', 'Impact Kilitli Elcik — Mavi', null, null, null, 'assets/img/urunler/impact-elcik-mavi.jpg', '{}'::text[], '{}'::jsonb, 60),
  ('impact-elcik-yesil', 'elcik', 'Impact Kilitli Elcik — Yeşil', null, null, null, 'assets/img/urunler/impact-elcik-yesil.jpg', '{}'::text[], '{}'::jsonb, 70),
  ('tek-vites-mor', 'tek-vites', 'Tek Vites Dönüşüm Kiti — Mor', null, null, null, 'assets/img/urunler/tek-vites-kiti-mor.jpg', '{}'::text[], '{"İçerik":"Tek dişli ve spacer seti"}'::jsonb, 80),
  ('tek-vites-siyah', 'tek-vites', 'Tek Vites Dönüşüm Kiti — Siyah', null, null, null, 'assets/img/urunler/tek-vites-kiti-siyah.jpg', '{}'::text[], '{"İçerik":"Tek dişli ve spacer seti","Malzeme":"7075 alüminyum"}'::jsonb, 90),
  ('hassns-gobek-mavi', 'gobek', 'Hassns Arka Göbek — Mavi', null, null, null, 'assets/img/urunler/hassns-gobek-mavi.jpg', '{}'::text[], '{"Bağlantı":"Çabuk sökmeli (QR)","Fren":"6 cıvatalı disk"}'::jsonb, 100),
  ('hassns-gobek-kirmizi', 'gobek', 'Hassns Arka Göbek — Kırmızı', null, null, null, 'assets/img/urunler/hassns-gobek-kirmizi.jpg', '{}'::text[], '{"Bağlantı":"Çabuk sökmeli (QR)","Fren":"6 cıvatalı disk"}'::jsonb, 110),
  ('hassns-gobek-yanardoner', 'gobek', 'Hassns Arka Göbek — Yanardöner', null, null, null, 'assets/img/urunler/hassns-gobek-yanardoner.jpg', '{}'::text[], '{"Bağlantı":"Çabuk sökmeli (QR)","Fren":"6 cıvatalı disk"}'::jsonb, 120),
  ('led-isik', 'aydinlatma', 'LED Işık', null, null, null, 'assets/img/urunler/led-isik.jpg', '{}'::text[], '{}'::jsonb, 130)
on conflict (id) do nothing;
