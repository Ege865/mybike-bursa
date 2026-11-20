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
        { id: "zincir-kilavuzu", name: "Zincir Kılavuzu" },
        { id: "grup-seti", name: "Grup Seti" },
        { id: "tek-vites", name: "Tek Vites Kiti" }
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
      { id: "bakim", name: "Bakım ve Temizlik" },
      { id: "aydinlatma", name: "Aydınlatma" }
    ]
  }
];

/* badge: "Yeni" | "İndirim" — specs: ürün sayfasındaki teknik tablo */
MYBIKE.products = [
  /* price: null → sitede "Fiyat sorunuz" yazar. Fiyatı öğrenince sayı olarak yazın (ör. price: 4500). */
  { id: "yt-dh", cat: "downhill", name: "YT Industries Downhill Bisikleti — Fox 40 / Float X2", price: null,
    img: "assets/img/urunler/yt-dh-4.jpg", images: ["assets/img/urunler/yt-dh-4.jpg", "assets/img/urunler/yt-dh-1.jpg", "assets/img/urunler/yt-dh-2.jpg", "assets/img/urunler/yt-dh-3.jpg"],
    specs: { "Ön maşa": "Fox 40 Factory, çift taç", "Arka amortisör": "Fox Float X2", "Ön lastik": "Maxxis Assegai", "Arka lastik": "Schwalbe Eddy Current" } },

  { id: "sram-gx-eagle", cat: "grup-seti", name: "SRAM GX Eagle 12 Vites Grup Seti", price: null,
    img: "assets/img/urunler/sram-gx-eagle.jpg",
    specs: { "Vites": "1×12", "Set içeriği": "Arka aktarıcı, vites kolu, krank ve aynakol, kaset, zincir, orta göbek" } },

  { id: "muc-off-valf", cat: "tubeless", name: "Muc-Off Tubeless Valf 44 mm — 7075 Alüminyum", price: null,
    img: "assets/img/urunler/muc-off-tubeless-valf.jpg",
    specs: { "Uzunluk": "44 mm", "Valf tipi": "Presta", "Malzeme": "7075 alüminyum", "Renkler": "Turkuaz, yeşil, pembe, gümüş, kırmızı, mor, altın, mavi, turuncu, yanardöner" } },

  { id: "impact-elcik-siyah", cat: "elcik", name: "Impact Kilitli Elcik — Siyah", price: null, img: "assets/img/urunler/impact-elcik-siyah.jpg" },
  { id: "impact-elcik-kirmizi", cat: "elcik", name: "Impact Kilitli Elcik — Kırmızı", price: null, img: "assets/img/urunler/impact-elcik-kirmizi.jpg" },
  { id: "impact-elcik-mavi", cat: "elcik", name: "Impact Kilitli Elcik — Mavi", price: null, img: "assets/img/urunler/impact-elcik-mavi.jpg" },
  { id: "impact-elcik-yesil", cat: "elcik", name: "Impact Kilitli Elcik — Yeşil", price: null, img: "assets/img/urunler/impact-elcik-yesil.jpg" },

  { id: "tek-vites-mor", cat: "tek-vites", name: "Tek Vites Dönüşüm Kiti — Mor", price: null, img: "assets/img/urunler/tek-vites-kiti-mor.jpg",
    specs: { "İçerik": "Tek dişli ve spacer seti" } },
  { id: "tek-vites-siyah", cat: "tek-vites", name: "Tek Vites Dönüşüm Kiti — Siyah", price: null, img: "assets/img/urunler/tek-vites-kiti-siyah.jpg",
    specs: { "İçerik": "Tek dişli ve spacer seti", "Malzeme": "7075 alüminyum" } },

  { id: "hassns-gobek-mavi", cat: "gobek", name: "Hassns Arka Göbek — Mavi", price: null, img: "assets/img/urunler/hassns-gobek-mavi.jpg",
    specs: { "Bağlantı": "Çabuk sökmeli (QR)", "Fren": "6 cıvatalı disk" } },
  { id: "hassns-gobek-kirmizi", cat: "gobek", name: "Hassns Arka Göbek — Kırmızı", price: null, img: "assets/img/urunler/hassns-gobek-kirmizi.jpg",
    specs: { "Bağlantı": "Çabuk sökmeli (QR)", "Fren": "6 cıvatalı disk" } },
  { id: "hassns-gobek-yanardoner", cat: "gobek", name: "Hassns Arka Göbek — Yanardöner", price: null, img: "assets/img/urunler/hassns-gobek-yanardoner.jpg",
    specs: { "Bağlantı": "Çabuk sökmeli (QR)", "Fren": "6 cıvatalı disk" } },

  { id: "led-isik", cat: "aydinlatma", name: "LED Işık", price: null, img: "assets/img/urunler/led-isik.jpg" }
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
