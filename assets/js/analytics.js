/* ==========================================================================
   MY BIKE — Çerez onayı ve ziyaretçi istatistiği
   Yalnızca ziyaretçi "Kabul et" derse çalışır. Rastgele bir ziyaretçi numarası
   tarayıcıda saklanır; ad, telefon, IP, form içeriği ya da mesaj metni gönderilmez.
   ========================================================================== */
(function () {
  "use strict";
  const M = window.MYBIKE || {};
  const cfg = M.supabase || {};
  const page = document.body.dataset.page;
  if (page === "admin") return;

  const KEY_CONSENT = "mybike-consent";   // "granted" | "denied"
  const KEY_VISITOR = "mybike-vid";       // rastgele ziyaretçi numarası
  const KEY_SESSION = "mybike-sid";       // {id, t} — 30 dk hareketsizlikte yenilenir
  const SESSION_MS = 30 * 60 * 1000;

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));

  const granted = () => ls.get(KEY_CONSENT) === "granted";
  const isBot = () => navigator.webdriver || /bot|crawl|spider|preview|lighthouse/i.test(navigator.userAgent);

  function ids() {
    let v = ls.get(KEY_VISITOR);
    if (!v) { v = uuid(); ls.set(KEY_VISITOR, v); }
    let s = null;
    try { s = JSON.parse(ls.get(KEY_SESSION) || "null"); } catch (e) {}
    const now = Date.now();
    if (!s || !s.id || now - s.t > SESSION_MS) s = { id: uuid(), t: now };
    s.t = now; ls.set(KEY_SESSION, JSON.stringify(s));
    return { visitor: v, session: s.id };
  }

  // Sayfa adı: "urun", "magaza", "index" …
  const pageName = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
  const pageItem = () => {
    const q = new URLSearchParams(location.search);
    return (pageName === "urun" ? q.get("id") : pageName === "magaza" ? (q.get("kat") || null) : null);
  };

  function send(type, item) {
    if (!granted() || isBot() || !cfg.url || !cfg.anonKey) return;
    const { visitor, session } = ids();
    const body = JSON.stringify({ visitor, session, type, page: pageName.slice(0, 40), item: item ? String(item).slice(0, 80) : null });
    try {
      fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/analytics_events", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey, Prefer: "return=minimal" },
        body
      }).catch(() => {});
    } catch (e) {}
  }
  M.track = send;

  /* ---- WhatsApp'a giden bağlantılar ---- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (!a) return;
    send(a.closest("[data-cart-foot]") ? "wa_order" : "wa_contact", pageItem());
  }, true);

  /* ---- Onay bandı ---- */
  function banner() {
    if (document.querySelector(".consent")) return;
    const el = document.createElement("div");
    el.className = "consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Çerez tercihi");
    el.innerHTML = `
      <p><b>Siteyi geliştirmek için ziyaret istatistiği tutalım mı?</b>
      İzin verirsen tarayıcına rastgele bir ziyaretçi numarası kaydedilir; hangi sayfalara bakıldığını ve WhatsApp'a kaç kişinin yönlendiğini sayarız. Adın, numaran ya da IP adresin kaydedilmez. <a href="gizlilik-cerez.html#cerezler">Ayrıntılar</a></p>
      <div class="consent-actions">
        <button class="btn btn--ghost" type="button" data-consent="denied">Reddet</button>
        <button class="btn btn--dark" type="button" data-consent="granted">Kabul et</button>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-consent]");
      if (!b) return;
      setConsent(b.dataset.consent);
      el.remove();
    });
  }

  function setConsent(v) {
    const was = granted();
    ls.set(KEY_CONSENT, v);
    if (v === "granted") { if (!was) send("pageview", pageItem()); }
    else { ls.del(KEY_VISITOR); ls.del(KEY_SESSION); }
  }
  M.consent = { open: banner, set: setConsent, state: () => ls.get(KEY_CONSENT) };

  // "Çerez tercihleri" bağlantıları bandı yeniden açar
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("[data-consent-open]");
    if (!a) return;
    e.preventDefault();
    banner();
  });

  if (!ls.get(KEY_CONSENT)) banner();
  else send("pageview", pageItem());
})();
