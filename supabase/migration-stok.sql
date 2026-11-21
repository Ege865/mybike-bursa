-- Stok durumu: stokta / sipariş üzerine / satıldı
-- Supabase panelinde: SQL Editor → New query → yapıştırıp Run (Run as: postgres)
alter table public.products
  add column if not exists stok text not null default 'stokta'
  check (stok in ('stokta', 'siparis', 'satildi'));
