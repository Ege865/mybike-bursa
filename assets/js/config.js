/* ==========================================================================
   Supabase bağlantısı
   Supabase panelinde: Project Settings → API (ya da Data API)
   - Project URL      → url
   - anon / publishable key → anonKey   (bu anahtar herkese açık olmak için tasarlandı;
     yazma yetkisini veritabanındaki güvenlik kuralları (RLS) kısıtlar)
   ASLA service_role / secret anahtarını buraya yazmayın.
   ========================================================================== */
window.MYBIKE = window.MYBIKE || {};
MYBIKE.supabase = {
  url: "https://vzsizdxejrnahdxeeici.supabase.co",
  anonKey: "sb_publishable_7OxnpqAhIFPSRfZtJ9hU3A_iQGusffg"
};
