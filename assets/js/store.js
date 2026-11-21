/* ==========================================================================
   MY BIKE — Ürünleri Supabase'den yükler
   Bağlantı ayarı yoksa ya da istek başarısız olursa data.js'teki liste kalır.
   ========================================================================== */
(function () {
  "use strict";
  const M = window.MYBIKE;
  const cfg = M.supabase || {};

  // Veritabanı satırını sitenin ürün biçimine çevirir
  M.fromRow = (r) => ({
    id: r.id,
    cat: r.cat,
    name: r.name,
    price: r.price == null ? null : Number(r.price),
    durum: r.durum || "sifir",
    stok: r.stok || "stokta",
    oldPrice: r.old_price == null ? undefined : Number(r.old_price),
    badge: r.badge || undefined,
    img: r.img || undefined,
    images: r.images && r.images.length ? r.images : undefined,
    specs: r.specs && Object.keys(r.specs).length ? r.specs : undefined
  });

  if (!cfg.url || !cfg.anonKey || !window.supabase) { M.ready = Promise.resolve(); return; }

  M.db = window.supabase.createClient(cfg.url, cfg.anonKey);
  if (document.body.dataset.page === "admin") { M.ready = Promise.resolve(); return; }

  M.ready = M.db
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error;
      if (Array.isArray(data)) M.products = data.map(M.fromRow);
    })
    .catch((e) => { console.warn("Supabase ürünleri yüklenemedi, yerel liste kullanılıyor:", e.message || e); });
})();
