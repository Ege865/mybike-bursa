/* ==========================================================================
   MY BIKE — Yönetim paneli (Supabase)
   Giriş → ürün listesi → ekle / düzenle / sil / fotoğraf yükle
   ========================================================================== */
(function () {
  "use strict";
  const M = window.MYBIKE;
  const { esc, tl, nodes } = M.ui;
  const db = M.db;
  const app = document.getElementById("app");
  const who = document.getElementById("who");
  const BUCKET = "urunler";
  const BADGES = ["", "Yeni", "İndirim"];

  // Yaprak kategoriler: "Yedek Parça › Kokpit › Elcik"
  const leaves = [];
  (function walk(list, trail) {
    list.forEach((n) => {
      const t = trail.concat(n.name);
      if (n.children) walk(n.children, t); else leaves.push({ id: n.id, label: t.join(" › ") });
    });
  })(M.categories, []);
  const catLabel = (id) => (leaves.find((l) => l.id === id) || { label: id }).label;

  const slug = (s) => s.toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "urun";

  let products = [];
  let filter = "";

  /* ---------- Kurulum yoksa ---------- */
  if (!db) {
    app.innerHTML = `<div class="a-card a-login"><h1>Supabase bağlı değil</h1>
      <p><code>assets/js/config.js</code> dosyasına Project URL ve anon key yazılmalı.</p></div>`;
    return;
  }

  /* ---------- Giriş ---------- */
  const LOCK_KEY = "mybike-admin-lock";
  const readLock = () => { try { return JSON.parse(localStorage.getItem(LOCK_KEY)) || { fails: 0, until: 0 }; } catch (e) { return { fails: 0, until: 0 }; } };
  const writeLock = (v) => { try { localStorage.setItem(LOCK_KEY, JSON.stringify(v)); } catch (e) {} };
  function renderLogin(msg = "", cls = "err") {
    who.innerHTML = "";
    app.innerHTML = `
      <form class="a-card a-login" id="login" novalidate>
        <h1>Yönetim paneli</h1>
        <p class="note">Ürün eklemek ve düzenlemek için giriş yapın.</p>
        <div class="field"><label for="email">E-posta</label><input id="email" type="email" autocomplete="username" required></div>
        <div class="field"><label for="pass">Şifre</label><input id="pass" type="password" autocomplete="current-password" required></div>
        <button class="btn btn--dark btn--block" type="submit">Giriş yap</button>
        <p class="a-msg ${cls}" role="status">${esc(msg)}</p>
      </form>`;
    const f = document.getElementById("login");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = f.querySelector("button"); const out = f.querySelector(".a-msg");
      // Art arda hatalı denemede bekleme: 5 hatadan sonra 2 dk, sonraki her hatada süre ikiye katlanır (en fazla 30 dk).
      // Supabase de sunucu tarafında IP başına giriş denemelerini sınırlar.
      const lock = readLock();
      if (lock.until > Date.now()) {
        out.className = "a-msg err";
        out.textContent = `Çok fazla hatalı deneme. ${Math.ceil((lock.until - Date.now()) / 60000)} dakika sonra tekrar deneyin.`;
        return;
      }
      btn.disabled = true; out.className = "a-msg"; out.textContent = "Giriş yapılıyor…";
      const { error } = await db.auth.signInWithPassword({ email: f.email.value.trim(), password: f.pass.value });
      btn.disabled = false;
      if (error) {
        const fails = lock.fails + 1;
        const until = fails >= 5 ? Date.now() + Math.min(30, 2 * 2 ** (fails - 5)) * 60000 : 0;
        writeLock({ fails, until });
        out.className = "a-msg err";
        out.textContent = /rate|too many/i.test(error.message) ? "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin."
          : until ? "E-posta ya da şifre hatalı. Güvenlik için bir süre beklemeniz gerekiyor."
          : `E-posta ya da şifre hatalı. (${5 - fails} deneme hakkı kaldı)`;
        return;
      }
      writeLock({ fails: 0, until: 0 });
      start();
    });
  }

  /* ---------- Oturum ve yetki ---------- */
  async function start() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) return renderLogin();
    const { data: isAdmin, error } = await db.rpc("is_admin");
    if (error || !isAdmin) {
      await db.auth.signOut();
      return renderLogin("Bu hesabın yönetici yetkisi yok. Supabase'de admins tablosuna eklenmeli.");
    }
    who.innerHTML = `<nav class="a-tabs" aria-label="Panel bölümleri">
        <a href="#urunler" data-tab="urunler">Ürünler</a><a href="#istatistik" data-tab="istatistik">İstatistik</a>
      </nav><span class="hide-s">${esc(session.user.email)}</span><button class="btn btn--ghost a-small" type="button" id="out">Çıkış</button>`;
    document.getElementById("out").onclick = async () => { await db.auth.signOut(); location.hash = ""; renderLogin("Çıkış yapıldı.", "ok"); };
    window.onhashchange = route;
    await route();
  }

  async function route() {
    const tab = location.hash === "#istatistik" ? "istatistik" : "urunler";
    who.querySelectorAll("[data-tab]").forEach((a) => a.toggleAttribute("aria-current", a.dataset.tab === tab));
    if (tab === "istatistik") return renderStats();
    await load();
  }

  /* ---------- İstatistik ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const PAGE_NAMES = { index: "Ana sayfa", magaza: "Mağaza", urun: "Ürün sayfaları", atolye: "Atölye", sss: "SSS", rehber: "Rehber", "kvkk-aydinlatma": "KVKK metni", "gizlilik-cerez": "Gizlilik ve çerez" };
  function periods() {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return {
      bugun: { label: "Bugün", from: t, to: t },
      dun: { label: "Dün", from: addDays(t, -1), to: addDays(t, -1) },
      "7gun": { label: "Son 7 gün", from: addDays(t, -6), to: t },
      "30gun": { label: "Son 30 gün", from: addDays(t, -29), to: t },
      buay: { label: "Bu ay", from: new Date(t.getFullYear(), t.getMonth(), 1), to: t },
      gecenay: { label: "Geçen ay", from: new Date(t.getFullYear(), t.getMonth() - 1, 1), to: new Date(t.getFullYear(), t.getMonth(), 0) },
      buyil: { label: "Bu yıl", from: new Date(t.getFullYear(), 0, 1), to: t },
      "12ay": { label: "Son 12 ay", from: new Date(t.getFullYear(), t.getMonth() - 11, 1), to: t }
    };
  }
  let statPeriod = "30gun";

  async function renderStats() {
    const P = periods();
    const per = P[statPeriod];
    app.innerHTML = `
      <div class="a-bar">
        <h1>İstatistik</h1>
        <div class="tools a-periods" role="group" aria-label="Dönem">
          ${Object.entries(P).map(([k, v]) => `<button type="button" class="chip" data-per="${k}" aria-pressed="${k === statPeriod}">${v.label}</button>`).join("")}
        </div>
      </div>
      <div id="stats"><p class="note">Yükleniyor…</p></div>`;
    app.querySelectorAll("[data-per]").forEach((b) => (b.onclick = () => { statPeriod = b.dataset.per; renderStats(); }));

    db.rpc("analytics_cleanup").then(() => {}, () => {});
    if (!products.length) { const r = await db.from("products").select("id,name"); if (r.data) products = r.data; }
    const { data, error } = await db.rpc("analytics_report", { p_from: iso(per.from), p_to: iso(per.to) });
    const box = document.getElementById("stats");
    if (!box) return;
    if (error) {
      box.innerHTML = `<div class="a-card"><p class="a-msg err">İstatistik alınamadı: ${esc(error.message)}</p>
        <p class="note">Supabase'de <code>supabase/migration-istatistik.sql</code> dosyası çalıştırılmamış olabilir.</p></div>`;
      return;
    }
    const T = data.totals;
    const pctN = (n) => (T.visitors ? Math.round((n / T.visitors) * 1000) / 10 : 0);
    const pct = (n) => pctN(n).toLocaleString("tr-TR");
    const num = (n) => Number(n || 0).toLocaleString("tr-TR");
    const pname = (id) => { const p = products.find((x) => x.id === id) || (M.products || []).find((x) => x.id === id); return p ? p.name : id; };

    // Grafik: dönemdeki her gün (ya da ay) için ziyaretçi
    const series = new Map((data.series || []).map((r) => [r.d, r]));
    const cols = [];
    if (data.bucket === "month") {
      for (let d = new Date(per.from.getFullYear(), per.from.getMonth(), 1); d <= per.to; d = new Date(d.getFullYear(), d.getMonth() + 1, 1))
        cols.push({ key: iso(d), label: MONTHS[d.getMonth()] + (d.getMonth() === 0 ? " " + String(d.getFullYear()).slice(2) : "") });
    } else {
      for (let d = new Date(per.from); d <= per.to; d = addDays(d, 1))
        cols.push({ key: iso(d), label: `${d.getDate()} ${MONTHS[d.getMonth()]}` });
    }
    const vals = cols.map((c) => ({ ...c, v: Number((series.get(c.key) || {}).visitors || 0), wa: Number((series.get(c.key) || {}).wa || 0), pv: Number((series.get(c.key) || {}).pageviews || 0) }));
    const max = Math.max(1, ...vals.map((x) => x.v));
    const every = Math.ceil(vals.length / 10);
    const chart = vals.length > 1 ? `
      <div class="a-card a-chart-card">
        <h2>Ziyaretçi (${data.bucket === "month" ? "aylık" : "günlük"})</h2>
        <div class="a-chart" style="--n:${vals.length}">
          ${vals.map((x, i) => `<div class="a-col" title="${x.label}: ${x.v} ziyaretçi, ${x.pv} sayfa, ${x.wa} WhatsApp">
            <span class="a-bar-v" style="height:${(x.v / max) * 100}%"><span class="a-bar-wa" style="height:${x.v ? (x.wa / x.v) * 100 : 0}%"></span></span>
            <small>${i % every === 0 ? x.label : ""}</small></div>`).join("")}
        </div>
        <p class="note a-legend"><span class="sw sw-v"></span> Ziyaretçi <span class="sw sw-wa"></span> WhatsApp'a yönlenen</p>
      </div>` : "";

    const list = (title, rows, fmt, empty) => `<div class="a-card"><h2>${title}</h2>${rows.length ? `<ol class="a-list">${rows.map(fmt).join("")}</ol>` : `<p class="note">${empty}</p>`}</div>`;

    box.innerHTML = `
      <p class="note a-scope">${esc(per.label)}: ${per.from.toLocaleDateString("tr-TR")}${+per.from !== +per.to ? " – " + per.to.toLocaleDateString("tr-TR") : ""}. Yalnızca çerezlere izin veren ziyaretçiler sayılır.</p>
      <div class="a-kpis">
        <div class="a-kpi"><span>Ziyaretçi</span><b>${num(T.visitors)}</b><small>${num(T.returning)} tanesi birden fazla kez geldi</small></div>
        <div class="a-kpi"><span>Ziyaret (oturum)</span><b>${num(T.sessions)}</b><small>${num(T.pageviews)} sayfa görüntüleme</small></div>
        <div class="a-kpi"><span>Sepet oluşturan</span><b>%${pct(T.cart_visitors)}</b><small>${num(T.cart_visitors)} ziyaretçi, ${num(T.cart_adds)} ürün ekleme</small></div>
        <div class="a-kpi a-kpi--wa"><span>WhatsApp'a yönlenen</span><b>%${pct(T.wa_visitors)}</b><small>${num(T.wa_visitors)} ziyaretçi</small></div>
      </div>
      <div class="a-card">
        <h2>WhatsApp talepleri</h2>
        <div class="a-funnel">
          ${[["Sipariş (sepetten)", T.wa_order], ["Servis randevusu", T.wa_appointment], ["Soru / bilgi", T.wa_contact]].map(([l, n]) => `
            <div><span>${l}</span><b>${num(n)} kişi</b><i style="--w:${pctN(n)}%"></i><small>Ziyaretçilerin %${pct(n)}'i</small></div>`).join("")}
        </div>
        <p class="note">WhatsApp düğmesine basıp uygulamayı açanlar sayılır; mesajı gerçekten gönderip göndermedikleri siteden görülemez.</p>
      </div>
      ${chart}
      <div class="a-two">
        ${list("En çok bakılan ürünler", data.products || [], (r) => `<li><span>${esc(pname(r.item))}</span><b>${num(r.views)}</b></li>`, "Henüz ürün görüntülemesi yok.")}
        ${list("En çok sepete eklenenler", data.carted || [], (r) => `<li><span>${esc(pname(r.item))}</span><b>${num(r.adds)}</b></li>`, "Henüz sepete ekleme yok.")}
        ${list("Sayfalar", data.pages || [], (r) => `<li><span>${esc(PAGE_NAMES[r.page] || r.page)}</span><b>${num(r.views)}</b></li>`, "Henüz sayfa görüntülemesi yok.")}
      </div>`;
  }

  async function load() {
    if (location.hash === "#istatistik") return;
    app.innerHTML = `<p class="note">Ürünler yükleniyor…</p>`;
    const { data, error } = await db.from("products").select("*").order("sort").order("created_at", { ascending: false });
    if (error) { app.innerHTML = `<p class="a-msg err">Ürünler alınamadı: ${esc(error.message)}</p>`; return; }
    products = data;
    renderList();
  }

  /* ---------- Liste ---------- */
  function renderList(msg = "") {
    const q = filter.toLocaleLowerCase("tr");
    const list = products.filter((p) => !q || (p.name + " " + catLabel(p.cat)).toLocaleLowerCase("tr").includes(q));
    app.innerHTML = `
      <div class="a-bar">
        <h1>Ürünler <span class="note">(${products.length})</span></h1>
        <div class="tools">
          <label class="sr-only" for="flt">Ürün ara</label>
          <input type="search" id="flt" placeholder="Ürün ya da kategori ara" value="${esc(filter)}">
          <button class="btn" type="button" id="add">+ Ürün ekle</button>
        </div>
      </div>
      <p class="a-msg ok" role="status">${esc(msg)}</p>
      <table class="a-table">
        <thead><tr><th>Görsel</th><th>Ürün</th><th class="hide-s">Kategori</th><th>Fiyat</th><th class="hide-s">Durum</th><th><span class="sr-only">İşlemler</span></th></tr></thead>
        <tbody>${list.map((p) => `
          <tr>
            <td>${p.img ? `<img class="a-thumb" src="${esc(p.img)}" alt="" loading="lazy">` : `<span class="a-thumb"></span>`}</td>
            <td><b>${esc(p.name)}</b>${p.durum === "ikinci-el" ? ` <span class="pill-off">İkinci el</span>` : ""}${p.stok === "siparis" ? ` <span class="pill-off">Sipariş üzerine</span>` : p.stok === "satildi" ? ` <span class="pill-off">Satıldı</span>` : ""}${p.badge ? ` <span class="pill-on">${esc(p.badge)}</span>` : ""}</td>
            <td class="hide-s">${esc(catLabel(p.cat))}</td>
            <td>${p.price == null ? `<span class="note">Vitrin (fiyatsız)</span>` : tl(Number(p.price))}</td>
            <td class="hide-s">${p.active ? `<span class="pill-on">Yayında</span>` : `<span class="pill-off">Gizli</span>`}</td>
            <td><div class="a-row-actions">
              <button class="btn btn--ghost a-small" type="button" data-edit="${esc(p.id)}">Düzenle</button>
              <button class="btn btn--ghost a-small" type="button" data-del="${esc(p.id)}">Sil</button>
            </div></td>
          </tr>`).join("") || `<tr><td colspan="6" class="note">Ürün yok.</td></tr>`}
        </tbody>
      </table>`;
    const flt = document.getElementById("flt");
    flt.oninput = () => { filter = flt.value; const pos = flt.selectionStart; renderList(); const n = document.getElementById("flt"); n.focus(); n.setSelectionRange(pos, pos); };
    document.getElementById("add").onclick = () => openEditor(null);
    app.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => openEditor(products.find((p) => p.id === b.dataset.edit))));
    app.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => removeProduct(products.find((p) => p.id === b.dataset.del))));
  }

  async function removeProduct(p) {
    if (!p || !confirm(`"${p.name}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    const { error } = await db.from("products").delete().eq("id", p.id);
    if (error) return alert("Silinemedi: " + error.message);
    products = products.filter((x) => x.id !== p.id);
    renderList(`"${p.name}" silindi.`);
  }

  /* ---------- Düzenleyici ---------- */
  function openEditor(p) {
    const isNew = !p;
    const st = {
      images: p ? (p.images && p.images.length ? [...p.images] : (p.img ? [p.img] : [])) : [],
      cover: p ? p.img || "" : "",
      specs: p ? Object.entries(p.specs || {}) : []
    };
    const dlg = document.createElement("dialog");
    dlg.className = "a-dlg";
    dlg.innerHTML = `
      <form method="dialog" novalidate>
        <div class="head"><h2>${isNew ? "Yeni ürün" : "Ürünü düzenle"}</h2>
          <button class="close-btn" type="button" data-close aria-label="Kapat">${M.ui.icon("x")}</button></div>
        <div class="a-grid">
          <div class="field full"><label for="f-name">Ürün adı</label><input id="f-name" required value="${esc(p ? p.name : "")}"><p class="err"></p></div>
          <div class="field full"><label for="f-cat">Kategori</label><select id="f-cat" required>
            <option value="">Seçin</option>${leaves.map((l) => `<option value="${l.id}" ${p && p.cat === l.id ? "selected" : ""}>${esc(l.label)}</option>`).join("")}
          </select><p class="err"></p></div>
          <div class="field"><label for="f-price">Fiyat (TL) — boş bırakılırsa ürün yalnızca vitrinde görünür, sepete eklenemez</label><input id="f-price" type="number" min="0" step="1" inputmode="numeric" value="${p && p.price != null ? Number(p.price) : ""}"></div>
          <div class="field"><label for="f-old">Eski fiyat (indirim için, isteğe bağlı)</label><input id="f-old" type="number" min="0" step="1" inputmode="numeric" value="${p && p.old_price != null ? Number(p.old_price) : ""}"></div>
          <div class="field"><label for="f-durum">Durum</label><select id="f-durum"><option value="sifir" ${!p || (p.durum || "sifir") === "sifir" ? "selected" : ""}>Sıfır</option><option value="ikinci-el" ${p && p.durum === "ikinci-el" ? "selected" : ""}>İkinci el</option></select></div>
          <div class="field"><label for="f-stok">Stok</label><select id="f-stok">${[["stokta", "Stokta"], ["siparis", "Sipariş üzerine"], ["satildi", "Satıldı"]].map(([v, l]) => `<option value="${v}" ${((p && p.stok) || "stokta") === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label for="f-badge">Etiket</label><select id="f-badge">${BADGES.map((b) => `<option value="${b}" ${p && (p.badge || "") === b ? "selected" : ""}>${b || "Yok"}</option>`).join("")}</select></div>
          <div class="field"><label for="f-sort">Sıra (küçük sayı önce görünür)</label><input id="f-sort" type="number" step="1" value="${p ? p.sort : 100}"></div>
          <label class="a-check full"><input type="checkbox" id="f-active" ${!p || p.active ? "checked" : ""}> Sitede yayında</label>
        </div>

        <div class="field">
          <label>Fotoğraflar <span class="note">(sarı çerçeveli olan kapak görseli)</span></label>
          <div class="a-imgs" data-imgs></div>
          <div style="margin-top:10px"><label class="btn btn--ghost a-small" style="cursor:pointer">Fotoğraf yükle<input type="file" accept="image/*" multiple hidden data-upload></label>
          <span class="a-msg" data-upmsg role="status"></span></div>
        </div>

        <div class="field">
          <label>Teknik özellikler</label>
          <div class="a-specs" data-specs></div>
          <button class="btn btn--ghost a-small" type="button" data-addspec style="margin-top:8px;justify-self:start">+ Özellik ekle</button>
        </div>

        <p class="a-msg err" data-msg role="status"></p>
        <div class="a-foot">
          <button class="btn btn--ghost" type="button" data-close>Vazgeç</button>
          <button class="btn btn--dark" type="submit">${isNew ? "Ürünü ekle" : "Kaydet"}</button>
        </div>
      </form>`;
    document.body.appendChild(dlg);
    const $ = (s) => dlg.querySelector(s);

    function drawImgs() {
      if (st.images.length && !st.images.includes(st.cover)) st.cover = st.images[0];
      $("[data-imgs]").innerHTML = st.images.map((src, i) => `
        <div class="a-img ${src === st.cover ? "cover" : ""}">
          <img src="${esc(src)}" alt="">
          <div class="bar"><button type="button" data-cover="${i}">Kapak yap</button><button type="button" data-rmimg="${i}">Kaldır</button></div>
        </div>`).join("") || `<p class="note">Henüz fotoğraf yok.</p>`;
      dlg.querySelectorAll("[data-cover]").forEach((b) => (b.onclick = () => { st.cover = st.images[+b.dataset.cover]; drawImgs(); }));
      dlg.querySelectorAll("[data-rmimg]").forEach((b) => (b.onclick = () => { st.images.splice(+b.dataset.rmimg, 1); drawImgs(); }));
    }
    function drawSpecs() {
      $("[data-specs]").innerHTML = st.specs.map(([k, v], i) => `
        <div class="a-spec">
          <input aria-label="Özellik adı" placeholder="ör. Teker" value="${esc(k)}" data-sk="${i}">
          <input aria-label="Değer" placeholder="ör. 29&quot;" value="${esc(v)}" data-sv="${i}">
          <button class="btn btn--ghost a-small" type="button" data-rmspec="${i}" aria-label="Özelliği sil">Sil</button>
        </div>`).join("");
      dlg.querySelectorAll("[data-sk]").forEach((x) => (x.oninput = () => (st.specs[+x.dataset.sk][0] = x.value)));
      dlg.querySelectorAll("[data-sv]").forEach((x) => (x.oninput = () => (st.specs[+x.dataset.sv][1] = x.value)));
      dlg.querySelectorAll("[data-rmspec]").forEach((b) => (b.onclick = () => { st.specs.splice(+b.dataset.rmspec, 1); drawSpecs(); }));
    }
    drawImgs(); drawSpecs();
    $("[data-addspec]").onclick = () => { st.specs.push(["", ""]); drawSpecs(); dlg.querySelector(`[data-sk="${st.specs.length - 1}"]`).focus(); };

    $("[data-upload]").onchange = async (e) => {
      const files = [...e.target.files]; e.target.value = "";
      const out = $("[data-upmsg]");
      const folder = p ? p.id : slug($("#f-name").value || "yeni");
      for (const [i, file] of files.entries()) {
        out.className = "a-msg"; out.textContent = `Yükleniyor ${i + 1}/${files.length}…`;
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${folder}/${Date.now()}-${i}.${ext}`;
        const { error } = await db.storage.from(BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
        if (error) { out.className = "a-msg err"; out.textContent = "Yüklenemedi: " + error.message; return; }
        st.images.push(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
        drawImgs();
      }
      out.className = "a-msg ok"; out.textContent = "Fotoğraflar yüklendi. Kaydetmeyi unutmayın.";
    };

    const close = () => { dlg.close(); dlg.remove(); };
    dlg.querySelectorAll("[data-close]").forEach((b) => (b.onclick = close));
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });

    $("form").onsubmit = async (e) => {
      e.preventDefault();
      const name = $("#f-name").value.trim(), cat = $("#f-cat").value;
      const setErr = (sel, m) => { const f = $(sel).closest(".field"); f.classList.toggle("invalid", !!m); f.querySelector(".err").textContent = m; };
      setErr("#f-name", name ? "" : "Ürün adını yazın."); setErr("#f-cat", cat ? "" : "Bir kategori seçin.");
      if (!name || !cat) return;
      const num = (v) => (v === "" ? null : Number(v));
      const row = {
        cat, name,
        price: num($("#f-price").value),
        old_price: num($("#f-old").value),
        badge: $("#f-badge").value || null,
        durum: $("#f-durum").value,
        stok: $("#f-stok").value,
        active: $("#f-active").checked,
        sort: Number($("#f-sort").value || 100),
        images: st.images,
        img: st.cover || st.images[0] || null,
        specs: Object.fromEntries(st.specs.filter(([k, v]) => k.trim() && v.trim()).map(([k, v]) => [k.trim(), v.trim()]))
      };
      const btn = $("button[type=submit]"); btn.disabled = true;
      const msg = $("[data-msg]"); msg.textContent = "";
      let res;
      if (isNew) {
        let id = slug(name);
        if (products.some((x) => x.id === id)) id += "-" + Date.now().toString(36);
        res = await db.from("products").insert({ id, ...row }).select().single();
      } else {
        res = await db.from("products").update(row).eq("id", p.id).select().single();
      }
      btn.disabled = false;
      if (res.error) { msg.textContent = "Kaydedilemedi: " + res.error.message; return; }
      products = isNew ? [res.data, ...products] : products.map((x) => (x.id === p.id ? res.data : x));
      close();
      renderList(`"${name}" ${isNew ? "eklendi" : "kaydedildi"}. Sitede birkaç saniye içinde görünür.`);
    };

    dlg.showModal();
    $("#f-name").focus();
  }

  start();
})();
