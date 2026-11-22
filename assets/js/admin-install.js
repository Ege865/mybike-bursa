/* ==========================================================================
   MY BIKE — Yönetim panelini telefona / bilgisayara uygulama olarak indirme
   Chrome, Edge, Samsung Internet: tek tıkla yükleme penceresi açılır.
   iPhone / iPad ve Mac Safari: tarayıcı buna izin vermediği için adımlar gösterilir.
   ========================================================================== */
(function () {
  "use strict";
  ["gesturestart", "gesturechange"].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  const slot = document.getElementById("install");
  if (!slot) return;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("admin-sw.js", { scope: "./admin" }).catch(() => {});
  }

  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone()) return; // zaten uygulama olarak açılmış

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMacSafari = !isIOS && /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua);
  const isFirefox = /Firefox|FxiOS/.test(ua);

  let deferred = null;
  slot.innerHTML = `<button class="btn a-small a-install-btn" type="button" aria-label="Uygulamayı indir">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
      <span>Uygulamayı indir</span></button>`;
  const btn = slot.querySelector("button");

  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  window.addEventListener("appinstalled", () => {
    slot.innerHTML = `<span class="a-installed">Uygulama yüklendi</span>`;
    deferred = null;
  });

  btn.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      if (outcome === "accepted") slot.innerHTML = `<span class="a-installed">Uygulama yükleniyor…</span>`;
      return;
    }
    showSteps();
  });

  const share = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Paylaş simgesi" style="display:inline-block;width:18px;height:18px;vertical-align:-3px"><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>`;
  function steps() {
    if (isIOS) return {
      title: "iPhone / iPad'e indir",
      list: [`Bu sayfayı <b>Safari</b>'de açın.`, `Alttaki ${share} <b>Paylaş</b> düğmesine dokunun.`, `Listeyi aşağı kaydırıp <b>Ana Ekrana Ekle</b>'yi seçin.`, `Sağ üstteki <b>Ekle</b>'ye dokunun. Panel, ana ekranda My Bike simgesiyle görünür.`]
    };
    if (isAndroid) return {
      title: "Android telefona indir",
      list: [`Bu sayfayı <b>Chrome</b>'da açın.`, `Sağ üstteki <b>⋮</b> menüsüne dokunun.`, `<b>Uygulamayı yükle</b> ya da <b>Ana ekrana ekle</b>'yi seçin.`, `<b>Yükle</b>'ye dokunun. Panel, uygulamalar arasında My Bike simgesiyle görünür.`]
    };
    if (isMacSafari) return {
      title: "Mac'e indir",
      list: [`Üst menüden <b>Dosya</b>'yı açın.`, `<b>Dock'a Ekle…</b>'yi seçin.`, `<b>Ekle</b>'ye tıklayın. Panel, Dock'ta ve Uygulamalar klasöründe görünür.`]
    };
    if (isFirefox) return {
      title: "Bilgisayara indir",
      list: [`Firefox uygulama yüklemeyi desteklemiyor.`, `Bu sayfayı <b>Chrome</b> ya da <b>Edge</b>'de açın.`, `Adres çubuğunun sağındaki <b>yükle</b> simgesine tıklayın ve <b>Yükle</b>'yi seçin.`]
    };
    return {
      title: "Bilgisayara indir",
      list: [`Adres çubuğunun sağındaki <b>yükle</b> simgesine tıklayın (ekran ve aşağı ok).`, `Simge yoksa sağ üstteki <b>⋮</b> menüsünden <b>Kaydet ve paylaş › Sayfayı uygulama olarak yükle</b> (Chrome) ya da <b>Uygulamalar › Bu siteyi uygulama olarak yükle</b> (Edge) yolunu izleyin.`, `<b>Yükle</b>'ye tıklayın. Panel, masaüstünde ve başlat menüsünde My Bike simgesiyle görünür.`]
    };
  }

  function showSteps() {
    const s = steps();
    let dlg = document.getElementById("install-dlg");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "install-dlg";
      dlg.className = "a-dlg";
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = `<div class="a-install-steps">
        <div class="head"><h2>${s.title}</h2><button class="btn btn--ghost a-small" type="button" data-close>Kapat</button></div>
        <ol>${s.list.map((li) => `<li>${li}</li>`).join("")}</ol>
        <p class="note">Yüklenen uygulama her açıldığında güncel paneli gösterir; ayrıca güncellemeniz gerekmez. Giriş bilgileriniz yalnızca bu cihazda saklanır.</p>
      </div>`;
    dlg.querySelector("[data-close]").onclick = () => dlg.close();
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.showModal();
  }
})();
