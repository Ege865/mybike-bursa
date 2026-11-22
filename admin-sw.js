/* MY BIKE — Yönetim paneli uygulaması (yalnızca admin.html sayfasını kapsar)
   Önce internetten yükler; bağlantı yoksa son açılan paneli gösterir.
   Supabase istekleri (ürünler, giriş, istatistik) hiç önbelleğe alınmaz. */
const CACHE = "mybike-panel-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("mybike-panel-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" }))
  );
});
