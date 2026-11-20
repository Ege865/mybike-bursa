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
      btn.disabled = true; out.className = "a-msg"; out.textContent = "Giriş yapılıyor…";
      const { error } = await db.auth.signInWithPassword({ email: f.email.value.trim(), password: f.pass.value });
      btn.disabled = false;
      if (error) { out.className = "a-msg err"; out.textContent = "E-posta ya da şifre hatalı."; return; }
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
    who.innerHTML = `<span>${esc(session.user.email)}</span><button class="btn btn--ghost a-small" type="button" id="out">Çıkış</button>`;
    document.getElementById("out").onclick = async () => { await db.auth.signOut(); renderLogin("Çıkış yapıldı.", "ok"); };
    await load();
  }

  async function load() {
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
            <td><b>${esc(p.name)}</b>${p.badge ? ` <span class="pill-on">${esc(p.badge)}</span>` : ""}</td>
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
