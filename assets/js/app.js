/* ==========================================================================
   MY BIKE — Ortak arayüz: üst menü, footer, sepet, ürün kartları, sayfalar
   ========================================================================== */
(function () {
  "use strict";

  /* ---- WhatsApp: mesaj müşterinin kendi WhatsApp'ında hazır açılır; site hiçbir veriyi kaydetmez ---- */
  const waUrl = (text) => {
    const n = String(CONTACT.whatsapp || "").replace(/\D/g, "");
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : "";
  };
  const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:20px;height:20px"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.44 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.36 11.36 0 0 0 5.37 1.37h.01c6.26 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04"/></svg>';

  /* ---- İletişim bilgileri: yayına almadan önce gerçek bilgilerle değiştirin ---- */
  const CONTACT = {
    email: "tolgaakdeniz16@gmail.com",
    emailLabel: "tolgaakdeniz16@gmail.com",
    phoneLabel: "+90 531 886 81 20",     // WhatsApp ile aynı numara
    whatsapp: "905318868120",            // ülke koduyla, sadece rakam
    area: "Odunluk Mah., Orhangazi Cad., No: 13, Nilüfer, Bursa",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("My Bike, Odunluk Mah., Orhangazi Cad., No: 13, Nilüfer, Bursa"),
    hours: "Pzt–Cmt 10:00–19:00",        // TODO: gerçek çalışma saatleri
    // KVKK metinleri için (doldurulursa aydınlatma metinlerinde otomatik görünür):
    legalName: "",                       // ör. "Ad Soyad (şahıs işletmesi)" ya da şirket unvanı
    address: "Odunluk Mah., Orhangazi Cad., No: 13, Nilüfer, Bursa"
  };
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
  const prettyPhone = (n) => { const d = String(n || "").replace(/\D/g, ""); return d ? "+" + d.replace(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5") : ""; };

  /* Aydınlatma metinlerindeki [data-c] alanlarını CONTACT'tan doldurur; bilgi yoksa satırı gizler */
  function fillContact() {
    const email = validEmail(CONTACT.email) ? CONTACT.email : "";
    const phone = CONTACT.phoneLabel && /\d/.test(CONTACT.phoneLabel) ? CONTACT.phoneLabel : "";
    const wa = prettyPhone(CONTACT.whatsapp);
    const vals = {
      controller: CONTACT.legalName ? `${CONTACT.legalName} — My Bike Bursa` : null,
      address: CONTACT.address || CONTACT.area || "Bursa",
      phone, whatsapp: wa
    };
    document.querySelectorAll("[data-c]").forEach((el) => {
      const k = el.dataset.c;
      if (k === "email") { if (email) { el.textContent = email; el.href = "mailto:" + email; } return; }
      if (k === "email-text") { if (email) el.textContent = email + " adresine"; return; }
      if (k === "contact-sentence") {
        const parts = [email && `${email} adresine yazabilir`, phone && `${phone} numarasını arayabilir`, wa && `WhatsApp'tan (${wa}) mesaj gönderebilir`].filter(Boolean);
        if (parts.length) el.textContent = parts.join(", ") + " ya da atölyemize gelebilirsiniz.";
        return;
      }
      if (vals[k]) el.textContent = vals[k];
    });
    const has = { email, phone, whatsapp: wa };
    document.querySelectorAll("[data-c-row]").forEach((row) => { row.hidden = !has[row.dataset.cRow]; });
  }

  const M = window.MYBIKE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tl = (n) => (n == null || Number.isNaN(n)) ? "" : new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " TL";
  const lineTl = (p, q) => tl(p.price == null ? null : p.price * q);

  /* ---------------- Icons (Lucide çizgi seti, 24px) ---------------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    disc: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    seat: '<path d="M4 9c0-2 3-3 8-3 4 0 8 1 8 3s-4 3-8 3H8"/><path d="M12 12v9M9 21h6"/>',
    pedal: '<rect x="3" y="8" width="14" height="8" rx="2"/><path d="M17 12h4"/><circle cx="7" cy="12" r=".5"/><circle cx="13" cy="12" r=".5"/>',
    frame: '<path d="M5.5 17.5 10 8h7l1.5 9.5M10 8l2 9.5h6.5M5.5 17.5H12"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>'
  };
  const icon = (name, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[name] || ""}</svg>`;

  /* Sitedeki hazır fotoğraflar WebP olarak iki boyutta sunulur (480 ve 900 piksel) */
  const LOCAL_IMG = /^assets\/img\/(atolye|disiplin|urunler)\/([a-z0-9-]+)\.jpg$/;
  function imgAttrs(img, sizes) {
    const m = LOCAL_IMG.exec(img);
    if (!m) return `src="${esc(img)}"`;
    const base = `assets/img/${m[1]}/${m[2]}`;
    return `src="${base}.webp" srcset="${base}-480.webp 480w, ${base}.webp 900w" sizes="${sizes || "(max-width: 720px) 50vw, 300px"}"`;
  }
  /* ---------------- Görsel alanı ("Görsel eklenecek") ---------------- */
  function ph(img, hint, opts = {}) {
    const cls = ["ph", opts.dark ? "ph--dark" : "", opts.corner ? "ph--corner" : ""].join(" ").trim();
    if (img) return `<div class="${cls} has-img"><img ${imgAttrs(img, opts.sizes)} alt="${esc(opts.alt || hint || "")}" loading="lazy" decoding="async"></div>`;
    return `<div class="${cls}" role="img" aria-label="Görsel eklenecek: ${esc(hint || "")}">${icon(opts.icon || "image")}<b>Görsel eklenecek</b>${hint ? `<small>${esc(hint)}</small>` : ""}</div>`;
  }
  /* HTML içinde <div data-ph="ipucu" data-ph-dark data-ph-corner></div> yazılan alanları doldurur */
  function hydratePlaceholders(root = document) {
    $$("[data-ph]", root).forEach((el) => {
      el.outerHTML = ph(el.dataset.img, el.dataset.ph, {
        dark: el.hasAttribute("data-ph-dark"),
        corner: el.hasAttribute("data-ph-corner"),
        icon: el.dataset.phIcon || "camera",
        sizes: el.dataset.sizes
      });
    });
  }

  /* ---------------- Katalog yardımcıları ---------------- */
  const nodes = new Map(); // id -> {node, parent, depth, root}
  (function index(list, parent = null, depth = 0, root = null) {
    list.forEach((n) => {
      const r = root || n;
      nodes.set(n.id, { node: n, parent, depth, root: r });
      if (n.children) index(n.children, n, depth + 1, r);
    });
  })(M.categories);

  const leafIds = (id) => {
    const e = nodes.get(id);
    if (!e) return [];
    const out = [];
    (function walk(n) { if (n.children) n.children.forEach(walk); else out.push(n.id); })(e.node);
    return out;
  };
  const productsIn = (id) => { const s = new Set(leafIds(id)); return M.products.filter((p) => s.has(p.cat)); };
  const pathTo = (id) => { const out = []; let e = nodes.get(id); while (e) { out.unshift(e.node); e = e.parent ? nodes.get(e.parent.id) : null; } return out; };
  const catName = (id) => (nodes.get(id) ? nodes.get(id).node.name : "");
  const shopUrl = (id) => `magaza.html?kat=${encodeURIComponent(id)}`;
  const productUrl = (id) => `urun.html?id=${encodeURIComponent(id)}`;
  const byId = (id) => M.products.find((p) => p.id === id);
  const isUsed = (p) => p && p.durum === "ikinci-el";
  const DURUM = { "sifir": "Sıfır", "ikinci-el": "İkinci el" };
  const STOK = { "stokta": "Stokta", "siparis": "Sipariş üzerine", "satildi": "Satıldı" };
  const stokOf = (p) => (p && STOK[p.stok]) ? p.stok : "stokta";
  const isSold = (p) => stokOf(p) === "satildi";
  const stockTag = (p, always) => {
    const k = stokOf(p);
    if (k === "stokta" && !always) return "";
    return `<span class="stock stock--${k}">${STOK[k]}</span>`;
  };
  const sellable = (id) => { const p = byId(id); return !!p && p.price != null && !isSold(p); }; // fiyatsız ya da satılmış ürün = vitrin

  /* ---------------- Ürün kartı ---------------- */
  function card(p) {
    const badge = p.badge ? `<span class="badge${p.badge === "İndirim" ? " badge--sale" : ""}">${esc(p.badge)}</span>` : "";
    const old = p.oldPrice ? `<s>${tl(p.oldPrice)}</s>` : "";
    const sold = isSold(p);
    return `<article class="p-card${sold ? " is-sold" : ""}">
      ${badge}
      <div class="frame">${ph(p.img, "Ürün fotoğrafı", { alt: p.name })}</div>
      <div class="p-body">
        ${isUsed(p) ? `<span class="cond-tag">İkinci el</span>` : ""}
        <span class="p-cat">${esc(catName(p.cat))}</span>
        <h3 class="p-name"><a href="${productUrl(p.id)}">${esc(p.name)}</a></h3>
        ${stockTag(p)}
        ${p.price == null || sold ? "" : `<div class="p-foot">
          <div class="p-price">${old}<b>${tl(p.price)}</b></div>
          <button class="add-btn" type="button" data-add="${p.id}" aria-label="Sepete ekle: ${esc(p.name)}">${icon("cart")}</button>
        </div>`}
      </div>
    </article>`;
  }

  /* ---------------- Header ---------------- */
  function megaFor(cat) {
    const intro = `<div class="mega-intro"><h3>${esc(cat.name)}</h3><p>${esc(cat.lead || "")}</p><a class="link" href="${shopUrl(cat.id)}">Tüm ${esc(cat.name.toLocaleLowerCase("tr"))} ${icon("arrow")}</a></div>`;
    if (cat.id === "bisikletler") {
      const tiles = cat.children.map((c) => `<a class="mega-tile" href="${shopUrl(c.id)}"><div class="frame${c.fit === "contain" ? " fit-contain" : ""}">${ph(c.img, c.name, { alt: c.name + " bisiklet" })}</div><span>${esc(c.name)}</span></a>`).join("");
      return `<div class="mega"><div class="wrap">${intro}<div class="mega-cols mega-cols--tiles">${tiles}</div></div></div>`;
    }
    const cols = cat.children.map((g) => {
      const items = (g.children || []).map((l) => `<li><a href="${shopUrl(l.id)}">${esc(l.name)}</a></li>`).join("");
      return `<div class="mega-col"><h4><a href="${shopUrl(g.id)}">${esc(g.name)}</a></h4>${items ? `<ul>${items}</ul>` : ""}</div>`;
    }).join("");
    return `<div class="mega"><div class="wrap">${intro}<div class="mega-cols">${cols}</div></div></div>`;
  }

  function renderHeader() {
    const page = document.body.dataset.page;
    const activeRoot = (() => {
      const k = new URLSearchParams(location.search).get("kat");
      if (k && nodes.get(k)) return nodes.get(k).root.id;
      const id = new URLSearchParams(location.search).get("id");
      const p = id && byId(id);
      return p && nodes.get(p.cat) ? nodes.get(p.cat).root.id : null;
    })();

    const navItems = M.categories.map((c) =>
      `<li class="nav-item"><a class="nav-link" href="${shopUrl(c.id)}" ${activeRoot === c.id ? 'aria-current="page"' : ""}>${esc(c.name)} ${icon("down")}</a>${megaFor(c)}</li>`
    ).join("");

    const mItems = M.categories.map((c) => {
      const sub = c.children.map((g) => `<a href="${shopUrl(g.id)}">${esc(g.name)}</a>`).join("");
      return `<details><summary>${esc(c.name)} ${icon("down")}</summary><div class="sub"><a class="all" href="${shopUrl(c.id)}">Tüm ${esc(c.name.toLocaleLowerCase("tr"))}</a>${sub}</div></details>`;
    }).join("");

    const h = $("#site-header");
    h.outerHTML = `
    <header class="site-header" id="site-header">
      <div class="annc"><div class="wrap">
        <span class="hide-s">Bursa'nın downhill ve enduro atölyesi</span><span class="sep hide-s" aria-hidden="true">·</span>
        <span class="hide-s">Süspansiyon servisi, set-up ve montaj</span><span class="sep hide-s" aria-hidden="true">·</span>
        <a href="atolye.html#randevu">Servis randevusu al</a>
      </div></div>
      <div class="topbar"><div class="wrap">
        <a class="logo" href="index.html" aria-label="My Bike ana sayfa">
          <img src="assets/img/logo.webp" alt="My Bike" width="58" height="62">
          <span class="logo-text"><span>Bursa</span><span>Downhill · Enduro</span></span>
        </a>
        <form class="search" role="search" action="magaza.html">
          <label class="sr-only" for="q">Ürün ara</label>
          <input id="q" name="q" type="search" placeholder="Bisiklet, maşa, kask, gidon ara…" autocomplete="off" value="${esc(new URLSearchParams(location.search).get("q") || "")}">
          <button type="submit" aria-label="Ara">${icon("search")}</button>
        </form>
        <div class="actions">
          <a class="icon-btn" href="atolye.html" aria-label="Atölye" ${page === "atolye" ? 'aria-current="page"' : ""}>${icon("wrench")}<span class="label">Atölye</span></a>
          <button class="icon-btn" type="button" data-cart-open>${icon("bag")}<span class="cart-count" data-cart-count>0</span><span class="label"> Sepet</span></button>
          <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menüyü aç">${icon("menu")}</button>
        </div>
      </div></div>
      <nav class="mainnav" aria-label="Kategoriler"><div class="wrap"><ul style="display:contents">
        ${navItems}
        <li class="nav-item nav-item--push"><a class="nav-link" href="atolye.html" ${page === "atolye" ? 'aria-current="page"' : ""}>Atölye</a></li>
        <li class="nav-item"><a class="nav-link" href="rehber.html" ${location.pathname.endsWith("rehber.html") ? 'aria-current="page"' : ""}>Rehber</a></li>
        <li class="nav-item"><a class="nav-link" href="sss.html" ${location.pathname.endsWith("sss.html") ? 'aria-current="page"' : ""}>SSS</a></li>
        <li class="nav-item"><a class="nav-link" href="atolye.html#randevu">İletişim</a></li>
      </ul></div></nav>
    </header>
    <nav class="mnav" id="mnav" aria-label="Mobil menü">
      ${mItems}
      <a href="atolye.html">Atölye ${icon("arrow")}</a>
      <a href="atolye.html#randevu">Servis randevusu ${icon("arrow")}</a>
      <a href="rehber.html">Beden ve uyumluluk rehberi ${icon("arrow")}</a>
      <a href="sss.html">Sık sorulan sorular ${icon("arrow")}</a>
    </nav>`;

    const btn = $(".menu-btn");
    btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
      btn.innerHTML = icon(open ? "x" : "menu");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) btn.click();
    });

    const setH = () => document.documentElement.style.setProperty("--header-h", $(".site-header").offsetHeight + "px");
    setH();
    window.addEventListener("resize", setH);
  }

  /* ---------------- Footer ---------------- */
  function renderFooter() {
    const f = $("#site-footer");
    if (!f) return;
    const links = (cat) => cat.children.slice(0, 6).map((c) => `<li><a href="${shopUrl(c.id)}">${esc(c.name)}</a></li>`).join("");
    const [bikes, parts, prot, acc] = M.categories;
    f.outerHTML = `
    <section class="trust" aria-label="Neden My Bike">
      <div class="wrap">
        <div class="trust-item">${icon("mountain")}<div><b>Downhill,enduro ve freeride odaklı</b><span>Parkuru bilen ekipten ürün ve servis</span></div></div>
        <div class="trust-item">${icon("wrench")}<div><b>Atölyede montaj</b><span>Aldığın parçayı atölyede taktır, ayarlat</span></div></div>
        <div class="trust-item">${icon("gauge")}<div><b>Kişisel set-up</b><span>Süspansiyonu kilona ve sürüş stiline göre ayarlıyoruz</span></div></div>
        <div class="trust-item">${icon("badge")}<div><b>Orijinal ürün</b><span>Faturalı, garantili parçalar</span></div></div>
      </div>
    </section>
    <footer class="site-footer on-dark">
      <div class="wrap foot-grid">
        <div class="foot-brand">
          <a class="logo" href="index.html" aria-label="My Bike ana sayfa"><img src="assets/img/logo.webp" alt="My Bike" width="104" height="112" loading="lazy"></a>
          <p>Downhill ve enduro bisikletleri, yedek parça ve koruma ekipmanı. Bursa'daki atölyemizde servis ve set-up.</p>
          <address><span>${esc(CONTACT.area)}</span><a class="link" href="mailto:${CONTACT.email}" style="justify-self:start">${esc(CONTACT.emailLabel)}</a></address>
        </div>
        <div><h2 class="foot-h">${esc(bikes.name)}</h2><ul>${links(bikes)}</ul></div>
        <div><h2 class="foot-h">${esc(parts.name)}</h2><ul>${links(parts)}</ul></div>
        <div><h2 class="foot-h">Ekipman</h2><ul>${links(prot)}<li><a href="${shopUrl(acc.id)}">${esc(acc.name)}</a></li></ul></div>
        <div class="newsletter">
          <h2 class="foot-h">Atölye</h2>
          <p>${esc(CONTACT.hours)}<br>${esc(CONTACT.area)}</p>
          <a class="btn" href="atolye.html#randevu">Randevu al ${icon("arrow")}</a>
        </div>
      </div>
      <div class="foot-bottom"><div class="wrap">
        <span>© ${new Date().getFullYear()} My Bike Bursa. Tüm hakları saklıdır.</span>
        <span><a class="link" href="kvkk-aydinlatma.html">KVKK Aydınlatma Metni</a> &nbsp;·&nbsp; <a class="link" href="gizlilik-cerez.html">Gizlilik ve Çerez Politikası</a> &nbsp;·&nbsp; <a class="link" href="#" data-consent-open>Çerez tercihleri</a> &nbsp;·&nbsp; <a class="link" href="atolye.html">Hakkımızda</a> &nbsp;·&nbsp; <a class="link" href="rehber.html">Beden ve uyumluluk</a> &nbsp;·&nbsp; <a class="link" href="sss.html">SSS</a> &nbsp;·&nbsp; <a class="link" href="atolye.html#randevu">İletişim</a></span>
        <span class="credit">Web sitesi tasarımı ve yapımı: <a href="tel:+905550459337">0555 045 93 37</a></span>
      </div></div>
    </footer>`;
  }

  /* ---------------- Sepet ---------------- */
  const CART_KEY = "mybike-cart";
  const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; } };
  let cart = readCart();
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* özel pencere */ } };
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = () => Object.entries(cart).reduce((s, [id, q]) => s + ((byId(id) || {}).price || 0) * q, 0);

  function renderCartShell() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="drawer-backdrop" data-cart-close></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">
        <div class="drawer-head"><h2 id="cart-title">Sepetin</h2><button class="close-btn" type="button" data-cart-close aria-label="Sepeti kapat">${icon("x")}</button></div>
        <div class="drawer-body" data-cart-body></div>
        <div class="drawer-foot" data-cart-foot></div>
      </aside>
      <div class="toast" role="status" aria-live="polite">${icon("check")}<span></span></div>`);
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { addToCart(add.dataset.add, Number(add.dataset.qty || 1), add); return; }
      if (e.target.closest("[data-cart-open]")) { openCart(); return; }
      if (e.target.closest("[data-cart-close]")) { closeCart(); return; }
      const step = e.target.closest("[data-step]");
      if (step) {
        const id = step.dataset.id; cart[id] = Math.max(0, (cart[id] || 0) + Number(step.dataset.step));
        if (!cart[id]) delete cart[id]; saveCart(); updateCart(); return;
      }
      const rm = e.target.closest("[data-rm]");
      if (rm) { delete cart[rm.dataset.rm]; saveCart(); updateCart(); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("cart-open")) closeCart(); });
    updateCart();
  }
  let lastFocus = null;
  function openCart() { lastFocus = document.activeElement; document.body.classList.add("cart-open"); setTimeout(() => $(".drawer .close-btn").focus(), 60); }
  function closeCart() { document.body.classList.remove("cart-open"); if (lastFocus) lastFocus.focus(); }

  // İstatistik (assets/js/analytics.js): yalnızca ziyaretçi çerezlere izin verdiyse kaydedilir
  const track = (type, item) => { try { if (window.MYBIKE.track) window.MYBIKE.track(type, item); } catch (e) {} };

  function addToCart(id, qty, btn) {
    if (!sellable(id)) return; // fiyatı olmayan ürünler yalnızca vitrin
    cart[id] = (cart[id] || 0) + qty; saveCart(); updateCart(true);
    track("cart_add", id);
    toast(`${byId(id).name} sepete eklendi`);
    if (btn && btn.classList.contains("add-btn")) {
      btn.classList.add("done"); btn.innerHTML = icon("check");
      setTimeout(() => { btn.classList.remove("done"); btn.innerHTML = icon("cart"); }, 1400);
    }
  }
  let toastT;
  function toast(msg) {
    const t = $(".toast"); $("span", t).textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function updateCart(bump) {
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = cartCount();
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    const body = $("[data-cart-body]"), foot = $("[data-cart-foot]");
    if (!body) return;
    // Fiyatı kaldırılmış ya da silinmiş ürünler sepetten düşer
    let pruned = false;
    Object.keys(cart).forEach((id) => { if (!sellable(id)) { delete cart[id]; pruned = true; } });
    if (pruned) { saveCart(); document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = cartCount())); }
    const items = Object.entries(cart);
    if (!items.length) {
      body.innerHTML = `<div class="cart-empty">${icon("bag", 'style="width:40px;height:40px"')}<p>Sepetin boş. Bisikletlere ya da yedek parçalara göz at.</p><a class="btn btn--dark" href="magaza.html">Mağazaya git</a></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = items.map(([id, q]) => {
      const p = byId(id);
      return `<div class="c-item">
        <div class="frame">${ph(p.img, "", { alt: p.name })}</div>
        <div><h3><a href="${productUrl(id)}">${esc(p.name)}</a></h3>
          <div class="mini-qty"><button type="button" data-step="-1" data-id="${id}" aria-label="Bir azalt">${icon("minus")}</button><span>${q}</span><button type="button" data-step="1" data-id="${id}" aria-label="Bir artır">${icon("plus")}</button></div>
          <button class="rm" type="button" data-rm="${id}">Kaldır</button></div>
        <span class="line-total">${lineTl(p, q)}</span>
      </div>`;
    }).join("");
    const lines = items.map(([id, q]) => `${q} x ${byId(id).name}${isUsed(byId(id)) ? " (İkinci el)" : ""}${stokOf(byId(id)) === "siparis" ? " (Sipariş üzerine)" : ""} — ${lineTl(byId(id), q)}`).join("\n");
    const text = "Merhaba, My Bike sitesinden sipariş vermek istiyorum:\n\n" + lines +
      "\n\nToplam: " + tl(cartTotal()) +
      "\nTeslimat: kargo / atölyeden alım";
    const wa = waUrl(text);
    foot.innerHTML = `<div class="sum"><span>Toplam</span><b>${tl(cartTotal())}</b></div>
      ${wa ? `<a class="btn btn--block btn--wa" href="${wa}" target="_blank" rel="noopener">${waIcon} WhatsApp ile sipariş ver</a>`
           : `<button class="btn btn--block" type="button" disabled>WhatsApp numarası eklenecek</button>`}
      <p class="note">Siparişin WhatsApp'ta hazır bir mesaj olarak açılır; gönderdiğinde bize ulaşır. Sitemiz bu bilgileri kaydetmez. Ayrıntılar: <a href="kvkk-aydinlatma.html">KVKK Aydınlatma Metni</a>.</p>`;
  }

  /* ---------------- Sayfa: Ana sayfa ---------------- */
  function renderHome() {
    const disc = $("[data-disciplines]");
    if (disc) {
      disc.innerHTML = M.categories[0].children.map((c) => {
        const n = productsIn(c.id).length;
        return `<a class="disc" href="${shopUrl(c.id)}">
          <div class="frame${c.fit === "contain" ? " fit-contain" : ""}">${ph(c.img, c.name + " bisiklet fotoğrafı", { alt: c.name + " bisiklet" })}</div>
          <div class="disc-body"><h3>${esc(c.name)} ${icon("arrow")}</h3><p>${esc(c.note)}</p><span class="count">${n ? n + " model" : "Yakında"}</span></div>
        </a>`;
      }).join("");
    }
    const fresh = $("[data-new]");
    if (fresh) {
      const list = [...M.products].sort((a, b) => (b.badge === "Yeni") - (a.badge === "Yeni")).slice(0, 8);
      fresh.innerHTML = list.map(card).join("");
    }
    const parts = $("[data-parts]");
    if (parts) {
      const ic = { suspansiyon: "gauge", fren: "disc", aktarma: "cog", tekerlek: "disc", kokpit: "bike", "sele-grubu": "seat", pedal: "pedal", "kadro-grubu": "frame" };
      parts.innerHTML = M.categories[1].children.map((g) => {
        const sample = g.children.slice(0, 3).map((c) => c.name).join(", ");
        return `<a class="part" href="${shopUrl(g.id)}">
          <div class="frame"><div class="ph" role="img" aria-label="Görsel eklenecek: ${esc(g.name)}">${icon(ic[g.id] || "image")}</div></div>
          <div><h3>${esc(g.name)}</h3><p>${esc(sample)}</p></div>
        </a>`;
      }).join("");
    }
    const prot = $("[data-protection]");
    const fill = (el, list) => { if (!el) return; if (!list.length) { el.closest("section").remove(); return; } el.innerHTML = list.slice(0, 4).map(card).join(""); };
    fill(prot, productsIn("koruma"));

    // Kategori kutuları: sırayla Bisikletler, Yedek Parça, Aksesuarlar, Koruma Ekipmanları
    const tiles = $("[data-cat-tiles]");
    if (tiles) {
      tiles.innerHTML = ["bisikletler", "yedek-parca", "aksesuar", "koruma"].map((id) => {
        const c = nodes.get(id).node;
        const list = productsIn(id);
        const pic = list.find((p) => p.img);
        return `<a class="cat-tile" href="${shopUrl(id)}">
          <div class="frame">${pic ? ph(pic.img, c.name + " görseli", { alt: c.name }) : `<div class="ph ph--dark has-img cat-fallback"><img src="assets/img/logo.webp" alt="" loading="lazy" decoding="async"></div>`}</div>
          <div class="cat-tile-body">
            <div><h3>${esc(c.name)}</h3><p>${list.length ? list.length + " ürün" : "Yakında"}</p></div>
            <span class="round-arrow" aria-hidden="true">${icon("arrow")}</span>
          </div>
        </a>`;
      }).join("");
    }
  }

  /* ---- SEO: sayfaya göre açıklama, kanonik adres ve yapılandırılmış veri ---- */
  const SITE = "https://www.mybikestore.com.tr/";
  function setSeo({ title, desc, path, image, ld }) {
    const set = (sel, attr, val, make) => {
      let el = document.head.querySelector(sel);
      if (!el && make) { el = make(); document.head.appendChild(el); }
      if (el && val) el.setAttribute(attr, val);
    };
    const meta = (k, v) => () => { const m = document.createElement("meta"); m.setAttribute(k, v); return m; };
    if (title) { set('meta[property="og:title"]', "content", title, meta("property", "og:title")); }
    if (desc) {
      set('meta[name="description"]', "content", desc, meta("name", "description"));
      set('meta[property="og:description"]', "content", desc, meta("property", "og:description"));
    }
    if (path != null) {
      const url = SITE + path;
      set('link[rel="canonical"]', "href", url, () => { const l = document.createElement("link"); l.rel = "canonical"; return l; });
      set('meta[property="og:url"]', "content", url, meta("property", "og:url"));
    }
    if (image) set('meta[property="og:image"]', "content", new URL(image, SITE).href, meta("property", "og:image"));
    if (ld) {
      let s = document.getElementById("ld-page");
      if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "ld-page"; document.head.appendChild(s); }
      s.textContent = JSON.stringify(ld);
    }
  }

  /* ---------------- Sayfa: Mağaza ---------------- */
  /* Mağaza başlığı ve yol menüsü ürün listesine bağlı değil; ürünler gelmeden yazılır ki sayfa kaymasın */
  function shopHead() {
    const qs = new URLSearchParams(location.search);
    const kat = nodes.get(qs.get("kat")) ? qs.get("kat") : null;
    const q = (qs.get("q") || "").trim();
    const trail = kat ? pathTo(kat) : [];
    const title = q ? `“${q}” için sonuçlar` : kat ? catName(kat) : "Tüm ürünler";
    const kn = kat ? nodes.get(kat).node : null;
    const lead = kat ? (kn.lead || kn.note || (kn.children ? kn.children.map((c) => c.name).join(", ") + "." : `${nodes.get(kat).parent.name} kategorisinde ${kn.name.toLocaleLowerCase("tr")}.`)) :"Bisikletler, yedek parça, koruma ekipmanı ve aksesuarlar.";
    document.title = `${title} | My Bike Bursa`;
    setSeo({
      title: document.title,
      desc: kat ? `${catName(kat)}: ${String(lead).replace(/[.!?]?\s*$/, ".")} My Bike Bursa'da downhill ve enduro odaklı ürünler.` : null,
      path: kat && !q ? `magaza.html?kat=${kat}` : "magaza.html"
    });

    $("[data-crumbs]").innerHTML = `<a href="index.html">Ana sayfa</a><span aria-hidden="true">/</span><a href="magaza.html">Mağaza</a>` +
      trail.map((n, i) => `<span aria-hidden="true">/</span>${i === trail.length - 1 ? `<span aria-current="page">${esc(n.name)}</span>` : `<a href="${shopUrl(n.id)}">${esc(n.name)}</a>`}`).join("");
    $("[data-title]").innerHTML = `<div><h1>${esc(title)}</h1><p>${esc(lead || "")}</p></div>
      <button class="btn btn--ghost filter-toggle" type="button" aria-expanded="false" aria-controls="filters">${icon("sliders")} Kategoriler ve filtre</button>`;
    return trail;
  }

  function renderShop() {
    const qs = new URLSearchParams(location.search);
    const kat = nodes.get(qs.get("kat")) ? qs.get("kat") : null;
    const q = (qs.get("q") || "").trim();
    const sort = qs.get("sirala") || "onerilen";
    const min = Number(qs.get("min")) || 0;
    const max = Number(qs.get("max")) || 0;
    const durum = DURUM[qs.get("durum")] ? qs.get("durum") : "";
    const trail = shopHead();

    // Filtre ağacı
    const openSet = new Set(trail.map((n) => n.id));
    const treeHtml = (list, depth) => list.map((n) => {
      const count = productsIn(n.id).length;
      const cur = n.id === kat ? ' aria-current="true"' : "";
      const kids = n.children && (depth === 0 || openSet.has(n.id)) ? treeHtml(n.children, depth + 1) : "";
      return `<li class="lvl-${depth}"><a href="${shopUrl(n.id)}"${cur}><span>${esc(n.name)}</span><em>${count}</em></a>${kids ? `<ul>${kids}</ul>` : ""}</li>`;
    }).join("");
    const keep = (extra) => { const p = new URLSearchParams(location.search); Object.entries(extra).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k)); return "magaza.html?" + p.toString(); };
    $("#filters").innerHTML = `
      <h2>Kategoriler</h2>
      <ul class="ftree"><li class="lvl-0"><a href="magaza.html"${!kat ? ' aria-current="true"' : ""}><span>Tüm ürünler</span><em>${M.products.length}</em></a></li>${treeHtml(M.categories, 0)}</ul>
      <hr>
      <h2>Durum</h2>
      <ul class="ftree">${[["", "Tümü"], ["sifir", "Sıfır"], ["ikinci-el", "İkinci el"]].map(([v, l]) => `<li class="lvl-1"><a href="${keep({ durum: v })}"${durum === v ? ' aria-current="true"' : ""}><span>${l}</span></a></li>`).join("")}</ul>
      <hr>
      <h2>Fiyat (TL)</h2>
      <form class="price-filter" data-price>
        <div class="pair">
          <div class="field"><label for="min">En az</label><input id="min" name="min" type="number" inputmode="numeric" min="0" step="100" value="${min || ""}"></div>
          <div class="field"><label for="max">En çok</label><input id="max" name="max" type="number" inputmode="numeric" min="0" step="100" value="${max || ""}"></div>
        </div>
        <button class="btn btn--dark btn--block" type="submit">Fiyatı uygula</button>
      </form>`;
    $("[data-price]").addEventListener("submit", (e) => {
      e.preventDefault();
      location.href = keep({ min: $("#min").value, max: $("#max").value });
    });
    $(".filter-toggle").addEventListener("click", (e) => {
      const open = $("#filters").classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded", String(open));
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });

    // Hızlı geçiş çipleri
    let chipSrc = [];
    if (!kat) chipSrc = M.categories;
    else {
      const n = nodes.get(kat);
      chipSrc = n.node.children || (n.parent ? n.parent.children : []);
    }
    $("[data-chips]").innerHTML = chipSrc.map((c) => `<a class="chip" href="${shopUrl(c.id)}"${c.id === kat ? ' aria-current="true"' : ""}>${esc(c.name)}</a>`).join("");

    // Ürünler
    let list = kat ? productsIn(kat) : [...M.products];
    if (q) {
      const needle = q.toLocaleLowerCase("tr");
      list = list.filter((p) => (p.name + " " + catName(p.cat) + " " + pathTo(p.cat).map((n) => n.name).join(" ")).toLocaleLowerCase("tr").includes(needle));
    }
    if (min) list = list.filter((p) => p.price != null && p.price >= min);
    if (max) list = list.filter((p) => p.price != null && p.price <= max);
    if (durum) list = list.filter((p) => (p.durum || "sifir") === durum);
    if (sort === "artan") list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "azalan") list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (sort === "yeni") list.sort((a, b) => (b.badge === "Yeni") - (a.badge === "Yeni"));
    list.sort((a, b) => isSold(a) - isSold(b)); // satılanlar en sonda

    $("[data-count]").textContent = `${list.length} ürün`;
    const sel = $("#sirala"); sel.value = sort;
    sel.addEventListener("change", () => { location.href = keep({ sirala: sel.value === "onerilen" ? "" : sel.value }); });

    $("[data-grid]").innerHTML = list.length ? list.map(card).join("") :
      `<div class="empty" style="grid-column:1/-1"><h2>Bu aramada ürün yok</h2><p>Filtreleri temizleyip tekrar dene ya da aradığın parçayı bize sor; tedarik edebiliriz.</p><a class="btn btn--dark" href="magaza.html">Filtreleri temizle</a></div>`;
  }

  /* ---------------- Sayfa: Ürün ---------------- */
  function renderProduct() {
    const id = new URLSearchParams(location.search).get("id");
    const p = byId(id);
    const root = $("[data-pdp]");
    if (!p) {
      root.innerHTML = `<div class="empty" style="grid-column:1/-1;margin-top:32px"><h2>Ürün bulunamadı</h2><p>Bu ürün kaldırılmış olabilir. Mağazada benzerlerine bakabilirsin.</p><a class="btn btn--dark" href="magaza.html">Mağazaya git</a></div>`;
      return;
    }
    document.title = `${p.name} | My Bike Bursa`;
    const trail = pathTo(p.cat);
    {
      const used = isUsed(p);
      const pImgs = p.images || (p.img ? [p.img] : []);
      const avail = { stokta: "InStock", siparis: "BackOrder", satildi: "SoldOut" }[stokOf(p)];
      const ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        category: trail.map((n) => n.name).join(" > "),
        url: `${SITE}urun.html?id=${encodeURIComponent(p.id)}`,
        brand: { "@type": "Brand", name: p.name.split(" ")[0] },
        itemCondition: used ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition"
      };
      if (pImgs.length) ld.image = pImgs.map((u) => new URL(u, SITE).href);
      if (p.price != null) ld.offers = {
        "@type": "Offer", price: p.price, priceCurrency: "TRY", availability: `https://schema.org/${avail}`,
        itemCondition: ld.itemCondition, seller: { "@id": `${SITE}#isletme`, "@type": "BicycleStore", name: "My Bike Bursa" }
      };
      setSeo({
        title: document.title,
        desc: `${p.name}${used ? " (ikinci el)" : ""} — ${trail.map((n) => n.name).join(", ")}. My Bike Bursa'da; bilgi ve sipariş için WhatsApp'tan yazın.`,
        path: `urun.html?id=${encodeURIComponent(p.id)}`,
        image: pImgs[0],
        ld
      });
    }
    $("[data-crumbs]").innerHTML = `<a href="index.html">Ana sayfa</a>` +
      trail.map((n) => `<span aria-hidden="true">/</span><a href="${shopUrl(n.id)}">${esc(n.name)}</a>`).join("") +
      `<span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span>`;

    const isBike = trail[0].id === "bisikletler";
    const specs = p.specs ? `<h2>Teknik özellikler</h2><table class="specs"><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>` :
      `<h2>Ürün bilgisi</h2><p class="note">Uyumluluk (teker çapı, aks standardı, kelepçe çapı) için sipariş öncesi bize danış; bisikletine uygun olanı birlikte seçelim.</p>`;
    const imgs = p.images || (p.img ? [p.img] : []);
    let qty = 1;
    root.innerHTML = `
      <div class="gallery">
        <div class="main frame">${ph(imgs[0] || p.img, "Ürün fotoğrafı — ana görsel", { alt: p.name, sizes: "(max-width: 720px) 100vw, 50vw" })}</div>
        ${imgs.length > 1 ? `<div class="thumbs">${imgs.slice(0, 4).map((src, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="${i + 1}. görseli göster">${ph(src, "", { alt: "" })}</button>`).join("")}</div>` : ""}
      </div>
      <div class="buy">
        <div>
          <p class="meta"><a class="link" href="${shopUrl(p.cat)}">${esc(catName(p.cat))}</a>${isUsed(p) ? ` <span class="cond-tag cond-tag--inline">İkinci el</span>` : ""}</p>
          <h1 style="margin-top:10px">${esc(p.name)}</h1>
        </div>
        <p class="stock-line">${stockTag(p, true)}${stokOf(p) === "siparis" ? `<span>Tedarik süresini WhatsApp'tan sorabilirsin.</span>` : ""}</p>
        ${isSold(p) ? `<div class="sold-note"><p>Bu ürün satıldı. Benzerini arıyorsan yaz, bulmaya çalışalım.</p><a class="btn btn--wa" href="${waUrl(`Merhaba, sitenizde satıldı görünen "${p.name}" ürününün benzerini arıyorum.`)}" target="_blank" rel="noopener">WhatsApp'tan sor</a></div>` :
        p.price == null ? "" : `<div class="price">${p.oldPrice ? `<s>${tl(p.oldPrice)}</s>` : ""}<b>${tl(p.price)}</b></div>
        <div class="qty-row">
          <div class="qty"><button type="button" data-q="-1" aria-label="Adedi azalt">${icon("minus")}</button><output aria-live="polite" data-qv>1</output><button type="button" data-q="1" aria-label="Adedi artır">${icon("plus")}</button></div>
          <button class="btn" type="button" data-add="${p.id}" data-qty="1">${icon("cart")} Sepete ekle</button>
        </div>`}
        <ul class="perks">
          <li>${icon("wrench")}<div><b>${isBike ? "Kurulum ve set-up" : "Atölyede montaj"}</b><span>${isBike ? "Teslimden önce süspansiyonu kilona ve sürüşüne göre ayarlayalım." :"Parçanı atölyede taktırabilir, ayarını yaptırabilirsin."}</span></div></li>
          <li>${icon("clipboard")}<div><b>Uyumluluk kontrolü</b><span>Siparişten önce bisikletine uyup uymadığını birlikte kontrol ediyoruz. <a class="link" href="rehber.html">Uyumluluk rehberi</a></span></div></li>
          <li>${icon("badge")}<div><b>Orijinal ürün</b><span>Faturalı ve garantili.</span></div></li>
        </ul>
        <div style="display:grid;gap:12px">${specs}</div>
      </div>`;
    const addBtn = $("[data-add]", root);
    $$("[data-q]", root).forEach((b) => b.addEventListener("click", () => {
      qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q)));
      $("[data-qv]", root).textContent = qty; addBtn.dataset.qty = qty;
    }));
    $$(".thumbs button", root).forEach((b) => b.addEventListener("click", () => {
      $$(".thumbs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const src = b.querySelector("img");
      const main = $(".gallery .main img", root);
      if (src && main) main.src = src.src;
    }));

    const rel = $("[data-related]");
    if (rel) {
      const parent = nodes.get(p.cat).parent || nodes.get(p.cat).node;
      let list = productsIn(parent.id).filter((x) => x.id !== p.id);
      if (list.length < 4) list = list.concat(productsIn(trail[0].id).filter((x) => x.id !== p.id && !list.includes(x)));
      if (list.length) rel.innerHTML = list.slice(0, 4).map(card).join("");
      else rel.closest("section").remove();
    }
  }

  /* ---------------- Sayfa: Atölye ---------------- */
  function renderWorkshop() {
    const svcIcons = ["gauge", "sliders", "disc", "droplet", "bike", "clipboard"];
    const svc = $("[data-services]");
    if (svc) svc.innerHTML = M.services.map((s, i) => `<div class="svc">${icon(svcIcons[i] || "wrench")}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("");
    const sel = $("#hizmet");
    if (sel) sel.innerHTML = `<option value="">Seçin</option>` + M.services.map((s) => `<option>${esc(s.title)}</option>`).join("") + `<option>Diğer</option>`;
    $$("[data-hours]").forEach((el) => (el.textContent = CONTACT.hours));
    $$("[data-area]").forEach((el) => { el.innerHTML = `${esc(CONTACT.area)}<br><a class="link" href="${CONTACT.mapsUrl}" target="_blank" rel="noopener">Yol tarifi al</a>`; });
    $$("[data-email]").forEach((el) => { el.textContent = CONTACT.emailLabel; el.href = "mailto:" + CONTACT.email; });
    $$("[data-phone]").forEach((el) => (el.textContent = CONTACT.phoneLabel));

    const form = $("#randevu-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => {
        const input = $("input, select, textarea", f);
        const err = $(".err", f);
        let msg = "";
        if (input.required && !input.value.trim()) msg = "Bu alanı doldurun.";
        else if (input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) msg = "Geçerli bir e-posta yazın, ör. ad@alanadi.com";
        else if (input.type === "tel" && input.value && input.value.replace(/\D/g, "").length < 10) msg = "Telefon numarası en az 10 haneli olmalı.";
        f.classList.toggle("invalid", !!msg);
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        if (err) err.textContent = msg;
        if (msg && ok) { ok = false; input.focus(); }
      });
      if (!ok) return;
      const d = Object.fromEntries(new FormData(form));
      const text = `Merhaba, My Bike sitesinden servis randevusu istiyorum.\n\nAd: ${d.ad}\nHizmet: ${d.hizmet}\nBisiklet: ${d.bisiklet || "-"}` + (d.mesaj ? `\n\n${d.mesaj}` : "");
      const wa = waUrl(text);
      const status = $(".form-status", form);
      if (!wa) { status.textContent = "WhatsApp numarası henüz eklenmedi."; return; }
      track("wa_appointment");
      window.open(wa, "_blank", "noopener");
      status.textContent = "WhatsApp açıldı. Mesajı gönderdiğinde talebin bize ulaşır.";
    });
  }

  /* ---------------- Başlat ---------------- */
  window.MYBIKE.ui = { icon, ph, tl, esc, nodes, pathTo, catName };
  const page = document.body.dataset.page;
  if (page === "admin") return; // yönetim paneli kendi arayüzünü kurar

  // Eski iPhone'larda iki parmakla yakınlaştırmayı engelle (viewport ayarını yok sayan sürümler için)
  ["gesturestart", "gesturechange"].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));

  renderHeader();
  renderFooter();
  hydratePlaceholders();
  fillContact();
  // data-wa="mesaj" taşıyan bağlantılar WhatsApp'ı hazır mesajla açar
  $$("[data-wa]").forEach((a) => { a.href = waUrl(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  // SSS açılıp kapanınca yumuşak kaydırmanın sayfa yüksekliğini güncelle
  $$("details").forEach((d) => d.addEventListener("toggle", () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }));

  if (page === "shop") shopHead();
  // Ürünler Supabase'den gelir (assets/js/store.js); gelmezse data.js'teki liste kullanılır
  Promise.resolve(window.MYBIKE.ready).catch(() => {}).then(() => {
    if (page === "home") renderHome();
    if (page === "shop") renderShop();
    if (page === "product") renderProduct();
    if (page === "atolye") renderWorkshop();
    renderCartShell();
    if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
  });
})();
