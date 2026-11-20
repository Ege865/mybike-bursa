-- Ürün durumu: sıfır / ikinci el
-- Supabase panelinde: SQL Editor → New query → yapıştırıp Run (Run as: postgres)
alter table public.products
  add column if not exists durum text not null default 'sifir'
  check (durum in ('sifir', 'ikinci-el'));

-- İlandaki YT downhill bisikleti ikinci el
update public.products set durum = 'ikinci-el' where id = 'yt-dh';
