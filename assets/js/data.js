/* ==========================================================================
   MY BIKE — Katalog verisi
   Ürünleri, fiyatları ve kategorileri buradan düzenleyin.
   - Her ürünün "cat" alanı aşağıdaki kategori ağacındaki bir yaprak id'sidir.
   - "img" alanına görsel yolu yazıldığında (ör. "assets/img/urunler/e1.jpg")
     kartlardaki "Görsel eklenecek" alanı otomatik olarak fotoğrafla değişir.
   - Fiyatlar TL cinsindendir. "oldPrice" girilirse indirimli gösterilir.
   ========================================================================== */

window.MYBIKE = window.MYBIKE || {};

MYBIKE.categories = [
  {
    id: "bisikletler",
    name: "Bisikletler",
    lead: "Parkura göre seçilmiş enduro, downhill, XC, hardtail ve dirt jump bisikletler.",
    children: [
      { id: "enduro", name: "Enduro", note: "150–180 mm, tırmanıp inen bisikletler" },
      { id: "downhill", name: "Downhill", note: "180–203 mm, park ve yarış" },
      { id: "xc", name: "XC", note: "Hafif, hızlı, uzun mesafe" },
      { id: "hardtail", name: "Hardtail", note: "Arka süspansiyonsuz, sade ve sağlam" },
      { id: "dirt-jump", name: "Dirt Jump", note: "26\" kadro, pump track ve rampa" }
    ]
  },
  {
    id: "yedek-parca",
    name: "Yedek Parça",
    lead: "Süspansiyondan pedal pimine; downhill ve enduro için seçilmiş parçalar.",
    children: [
      { id: "suspansiyon", name: "Süspansiyon", children: [
        { id: "on-masa", name: "Ön Maşa" },
        { id: "arka-amortisor", name: "Arka Amortisör" },
        { id: "yay-token", name: "Yay ve Token" },
        { id: "servis-kiti", name: "Servis Kiti ve Keçe" }
      ]},
      { id: "fren", name: "Fren Grubu", children: [
        { id: "disk-fren", name: "Disk Fren Seti" },
        { id: "fren-diski", name: "Fren Diski (Rotor)" },
        { id: "balata", name: "Balata" },
        { id: "fren-adaptor", name: "Adaptör ve Bağlantı" },
        { id: "fren-yagi", name: "Fren Yağı ve Hortum" }
      ]},
      { id: "aktarma", name: "Aktarma Grubu", children: [
        { id: "arka-aktarici", name: "Arka Aktarıcı" },
        { id: "vites-kolu", name: "Vites Kolu" },
        { id: "kaset", name: "Kaset" },
        { id: "zincir", name: "Zincir" },
        { id: "aynakol", name: "Aynakol" },
        { id: "krank", name: "Krank" },
        { id: "orta-gobek", name: "Orta Göbek" },
        { id: "zincir-kilavuzu", name: "Zincir Kılavuzu" }
      ]},
      { id: "tekerlek", name: "Tekerlek ve Lastik", children: [
        { id: "jant-seti", name: "Jant Seti" },
        { id: "cember", name: "Çember" },
        { id: "gobek", name: "Göbek" },
        { id: "jant-teli", name: "Jant Teli ve Nipel" },
        { id: "dis-lastik", name: "Dış Lastik" },
        { id: "ic-lastik", name: "İç Lastik" },
        { id: "tubeless", name: "Tubeless ve Lastik İçi Koruma" }
      ]},
      { id: "kokpit", name: "Kokpit", children: [
        { id: "gidon", name: "Gidon" },
        { id: "gidon-bogazi", name: "Gidon Boğazı" },
        { id: "elcik", name: "Elcik" },
        { id: "furs", name: "Furş (Headset)" },
        { id: "spacer", name: "Spacer ve Kapak" }
      ]},
      { id: "sele-grubu", name: "Sele Grubu", children: [
        { id: "sele", name: "Sele" },
        { id: "dropper", name: "Dropper Sele Borusu" },
        { id: "sele-borusu", name: "Sele Borusu" },
        { id: "sele-kelepcesi", name: "Sele Kelepçesi" }
      ]},
      { id: "pedal", name: "Pedal", children: [
        { id: "duz-pedal", name: "Düz Pedal" },
        { id: "klipsli-pedal", name: "Klipsli Pedal" },
        { id: "pedal-yedek", name: "Pim ve Pedal Yedekleri" }
      ]},
      { id: "kadro-grubu", name: "Kadro ve Bağlantı", children: [
        { id: "kadro", name: "Kadro" },
        { id: "aks", name: "Aks (Thru-Axle)" },
        { id: "vites-kulagi", name: "Vites Kulağı" },
        { id: "kadro-koruma", name: "Kadro Koruma" }
      ]}
    ]
  },
  {
    id: "koruma",
    name: "Koruma Ekipmanları",
    lead: "Parkta ve patikada düşmeye hazır olmak için.",
    children: [
      { id: "kask", name: "Kask", children: [
        { id: "full-face", name: "Full-Face Kask" },
        { id: "enduro-kask", name: "Enduro / Trail Kask" }
      ]},
      { id: "dizlik", name: "Dizlik" },
      { id: "dirseklik", name: "Dirseklik" },
      { id: "body-armour", name: "Body Armour" }
    ]
  },
  {
    id: "aksesuar",
    name: "Aksesuarlar",
    lead: "Giyimden sticker'a, sürüşün geri kalanı.",
    children: [
      { id: "giyim", name: "Giyim", children: [
        { id: "tshirt", name: "T-shirt" },
        { id: "forma", name: "Forma" },
        { id: "sort", name: "Alt Giyim" }
      ]},
      { id: "ayakkabi", name: "Ayakkabı" },
      { id: "eldiven", name: "Eldiven" },
      { id: "gozluk", name: "Gözlük ve Goggle" },
      { id: "sticker", name: "Sticker ve Süs" },
      { id: "canta", name: "Çanta ve Hidrasyon" },
      { id: "alet", name: "Alet ve Pompa" },
      { id: "bakim", name: "Bakım ve Temizlik" }
    ]
  }
];

/* badge: "Yeni" | "İndirim" — specs: ürün sayfasındaki teknik tablo */
MYBIKE.products = [
  /* ---------- Bisikletler ---------- */
  { id: "e1", cat: "enduro", name: "Enduro Full Süspansiyon 29\" — 170/160 mm", price: 185000, badge: "Yeni",
    specs: { "Teker": "29\"", "Ön süspansiyon": "170 mm", "Arka süspansiyon": "160 mm", "Kadro": "Alüminyum", "Vites": "1×12", "Fren": "4 pistonlu hidrolik disk" } },
  { id: "e2", cat: "enduro", name: "Yt Capra Mullet 29/27.5 — 160/150 mm", price: 129500,
    specs: { "Teker": "29\" ön / 27.5\" arka", "Ön süspansiyon": "160 mm", "Arka süspansiyon": "150 mm", "Kadro": "Alüminyum", "Vites": "1×12" } },
  { id: "e3", cat: "enduro", name: "Mondraker Foxy 29\" — 170 mm, 1×12", price: 265000, oldPrice: 289000, badge: "İndirim",
    specs: { "Teker": "29\"", "Ön süspansiyon": "170 mm", "Arka süspansiyon": "165 mm", "Kadro": "Karbon", "Vites": "1×12" } },
  { id: "d1", cat: "downhill", name: "Downhill 27.5\" — 200 mm Çift Taç Maşa", price: 210000, badge: "Yeni",
    specs: { "Teker": "27.5\"", "Ön süspansiyon": "200 mm, çift taç", "Arka süspansiyon": "200 mm", "Kadro": "Alüminyum", "Vites": "1×7 DH" } },
  { id: "d2", cat: "downhill", name: "Downhill Mullet — 200/200 mm Yaylı Amortisör", price: 248000,
    specs: { "Teker": "29\" ön / 27.5\" arka", "Ön süspansiyon": "200 mm", "Arka süspansiyon": "200 mm, yaylı", "Kadro": "Alüminyum" } },
  { id: "x1", cat: "xc", name: "XC Full Süspansiyon 29\" — 120 mm Karbon", price: 172000,
    specs: { "Teker": "29\"", "Ön süspansiyon": "120 mm", "Arka süspansiyon": "120 mm", "Kadro": "Karbon", "Vites": "1×12" } },
  { id: "x2", cat: "xc", name: "XC Hardtail Yarış 29\" — 100 mm Kilitli Maşa", price: 64500,
    specs: { "Teker": "29\"", "Ön süspansiyon": "100 mm, kilitli", "Kadro": "Alüminyum", "Vites": "1×12" } },
  { id: "h1", cat: "hardtail", name: "Trail Hardtail 29\" — 140 mm", price: 58900,
    specs: { "Teker": "29\"", "Ön süspansiyon": "140 mm", "Kadro": "Alüminyum", "Vites": "1×11" } },
  { id: "h2", cat: "hardtail", name: "Hardtail 27.5\" — 130 mm, Hidrolik Disk", price: 42500,
    specs: { "Teker": "27.5\"", "Ön süspansiyon": "130 mm", "Kadro": "Alüminyum", "Vites": "1×10" } },
  { id: "j1", cat: "dirt-jump", name: "Dirt Jump 26\" — 100 mm, Tek Vites", price: 38900, badge: "Yeni",
    specs: { "Teker": "26\"", "Ön süspansiyon": "100 mm", "Kadro": "Krom-moli çelik", "Vites": "Tek vites" } },
  { id: "j2", cat: "dirt-jump", name: "Dirt Jump Kadro Kiti 26\"", price: 14900,
    specs: { "Teker": "26\"", "Kadro": "Krom-moli çelik", "Dropout": "Yatay, tek vites" } },

  /* ---------- Yedek Parça ---------- */
  { id: "p1", cat: "on-masa", name: "Enduro Ön Maşa 29\" — 170 mm, 38 mm Bacak", price: 42500, badge: "Yeni" },
  { id: "p2", cat: "on-masa", name: "Downhill Çift Taç Maşa 27.5\" — 200 mm", price: 56000 },
  { id: "p3", cat: "arka-amortisor", name: "Yaylı Arka Amortisör 230×65 mm", price: 24800 },
  { id: "p4", cat: "arka-amortisor", name: "Havalı Arka Amortisör 205×60 mm", price: 21500 },
  { id: "p5", cat: "servis-kiti", name: "Maşa Toz Keçesi Seti — 38 mm", price: 1850 },
  { id: "p6", cat: "yay-token", name: "Amortisör Yayı 450 lbs — 65 mm Strok", price: 3200 },
  { id: "p7", cat: "disk-fren", name: "4 Pistonlu Hidrolik Disk Fren — Ön + Arka", price: 14200, badge: "Yeni" },
  { id: "p8", cat: "fren-diski", name: "Fren Diski 220 mm — 6 Cıvata", price: 2450 },
  { id: "p9", cat: "balata", name: "Sinterli Metal Balata — 4 Pistonlu", price: 890 },
  { id: "p10", cat: "fren-yagi", name: "Mineral Fren Yağı 100 ml", price: 420 },
  { id: "p11", cat: "fren-adaptor", name: "Post Mount Adaptör +20 mm", price: 480 },
  { id: "p12", cat: "arka-aktarici", name: "12 Vites Arka Aktarıcı — Uzun Kafes", price: 6900 },
  { id: "p13", cat: "kaset", name: "12 Vites Kaset 10–51T", price: 5400 },
  { id: "p14", cat: "zincir", name: "12 Vites Zincir — 126 Bakla", price: 1950 },
  { id: "p15", cat: "aynakol", name: "Tekli Aynakol 32T — Dar-Geniş Diş", price: 1650 },
  { id: "p16", cat: "krank", name: "Alüminyum DH Krank 165 mm", price: 7800 },
  { id: "p17", cat: "zincir-kilavuzu", name: "ISCG-05 Zincir Kılavuzu — Kaya Korumalı", price: 3400, badge: "Yeni" },
  { id: "p18", cat: "orta-gobek", name: "BSA 73 mm Orta Göbek", price: 1250 },
  { id: "p19", cat: "vites-kolu", name: "12 Vites Tetik Vites Kolu", price: 2100 },
  { id: "p20", cat: "jant-seti", name: "Enduro Jant Seti 29\" — 30 mm İç Genişlik", price: 18900 },
  { id: "p21", cat: "cember", name: "Alüminyum Çember 27.5\" — 32 Delik", price: 2950 },
  { id: "p22", cat: "gobek", name: "Arka Göbek 12×148 Boost", price: 5600 },
  { id: "p23", cat: "dis-lastik", name: "Enduro Dış Lastik 29×2.5 — Çift Kat", price: 2650 },
  { id: "p24", cat: "tubeless", name: "Lastik İçi Koruma Köpüğü 29\"", price: 3900 },
  { id: "p25", cat: "tubeless", name: "Tubeless Sıvısı 500 ml", price: 650 },
  { id: "p26", cat: "ic-lastik", name: "İç Lastik 29×2.3–2.6 — Presta", price: 280 },
  { id: "p27", cat: "jant-teli", name: "Paslanmaz Jant Teli Seti — 32 Adet", price: 1350 },
  { id: "p28", cat: "gidon", name: "Alüminyum Gidon 800 mm — 35 mm, 25 mm Rise", price: 2350 },
  { id: "p29", cat: "gidon-bogazi", name: "Gidon Boğazı 40 mm — 35 mm Kelepçe", price: 1950 },
  { id: "p30", cat: "elcik", name: "Kilitli Elcik — Ergonomik Desen", price: 650 },
  { id: "p31", cat: "furs", name: "Konik Furş Seti ZS44/ZS56", price: 1450 },
  { id: "p32", cat: "spacer", name: "Alüminyum Spacer Seti — 5/10 mm", price: 240 },
  { id: "p33", cat: "dropper", name: "Dropper Sele Borusu 31.6 mm — 170 mm", price: 8900, badge: "Yeni" },
  { id: "p34", cat: "sele", name: "Enduro Sele — Kaymaz Kapak", price: 2400 },
  { id: "p35", cat: "sele-kelepcesi", name: "Sele Kelepçesi 34.9 mm", price: 320 },
  { id: "p36", cat: "duz-pedal", name: "Alüminyum Düz Pedal — 10 Pimli", price: 2100 },
  { id: "p37", cat: "klipsli-pedal", name: "Enduro Klipsli Pedal — Kafesli", price: 3600 },
  { id: "p38", cat: "pedal-yedek", name: "Pedal Pimi Seti — 20 Adet", price: 180 },
  { id: "p39", cat: "vites-kulagi", name: "Vites Kulağı — Universal (UDH)", price: 650 },
  { id: "p40", cat: "kadro-koruma", name: "Kadro Koruma Bandı Seti", price: 550 },
  { id: "p41", cat: "aks", name: "Thru-Axle 12×148 mm", price: 850 },
  { id: "p42", cat: "kadro", name: "Enduro Kadro 29\" — 160 mm, Amortisörlü", price: 64000 },

  /* ---------- Koruma ---------- */
  { id: "k1", cat: "full-face", name: "Full-Face Downhill Kask — Darbe Emici Astar", price: 9800, badge: "Yeni" },
  { id: "k2", cat: "full-face", name: "Çıkarılabilir Çeneli Enduro Kask", price: 7900 },
  { id: "k3", cat: "enduro-kask", name: "Trail / Enduro Yarım Kask", price: 3900 },
  { id: "k4", cat: "dizlik", name: "Enduro Dizlik — Esnek Darbe Pedi", price: 2900 },
  { id: "k5", cat: "dizlik", name: "Downhill Dizlik ve Kaval Koruma", price: 3400 },
  { id: "k6", cat: "dirseklik", name: "Dirseklik — Esnek Pedli", price: 2200 },
  { id: "k7", cat: "body-armour", name: "Body Armour — Göğüs ve Sırt Koruma", price: 6800, badge: "Yeni" },
  { id: "k8", cat: "body-armour", name: "Sırt Korumalı Yelek", price: 4900 },

  /* ---------- Aksesuarlar ---------- */
  { id: "a1", cat: "tshirt", name: "Grafik Baskılı Pamuk T-shirt", price: 750, badge: "Yeni" },
  { id: "a2", cat: "forma", name: "Uzun Kollu Enduro Forma", price: 1450 },
  { id: "a3", cat: "sort", name: "Enduro Şort — Esnek Kumaş", price: 2250 },
  { id: "a4", cat: "ayakkabi", name: "Düz Tabanlı MTB Ayakkabı", price: 4800 },
  { id: "a5", cat: "eldiven", name: "Uzun Parmak MTB Eldiveni", price: 950 },
  { id: "a6", cat: "gozluk", name: "Downhill Goggle — Çift Cam", price: 1650 },
  { id: "a7", cat: "sticker", name: "Sticker Seti — 12 Parça", price: 180 },
  { id: "a8", cat: "canta", name: "Hidrasyon Sırt Çantası 10 L", price: 2400 },
  { id: "a9", cat: "alet", name: "Mini Pompa — Yüksek Hacim", price: 750 },
  { id: "a10", cat: "alet", name: "Çok Amaçlı Alet — 18 Fonksiyon", price: 890 },
  { id: "a11", cat: "bakim", name: "Zincir Yağı — Islak Hava 120 ml", price: 320 }
];

/* Atölyede verilen servisler (atolye.html) */
MYBIKE.services = [
  { title: "Süspansiyon servisi", text: "Maşa ve amortisör için alt bacak bakımı, keçe ve yağ değişimi, tam servis." },
  { title: "Set-up ve sag ayarı", text: "Kilonuza ve sürüşünüze göre basınç, rebound ve kompresyon ayarı." },
  { title: "Fren bakımı", text: "Hava alma, balata ve disk değişimi, kaliper hizalama." },
  { title: "Tubeless kurulum", text: "Bant, valf, sıvı ve lastik içi koruma köpüğü montajı." },
  { title: "Teker toplama", text: "Çember düzeltme, jant teli değişimi ve sıfırdan teker örme." },
  { title: "Komple bakım", text: "Sezon öncesi ve yarış sonrası, bisikletin baştan sona kontrolü." }
];
