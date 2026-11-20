-- ==========================================================================
-- MY BIKE — Supabase kurulumu
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştırıp Run.
-- Ardından seed.sql dosyasını aynı şekilde çalıştırın (mevcut ürünleri ekler).
-- ==========================================================================

-- 1) Yöneticiler: sadece bu tabloya eklenen hesaplar ürün ekleyip düzenleyebilir
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
drop policy if exists "admin kendini görür" on public.admins;
create policy "admin kendini görür" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- 2) Ürünler
create table if not exists public.products (
  id         text primary key,
  cat        text not null,                 -- kategori id'si (assets/js/data.js içindeki ağaç)
  name       text not null,
  price      numeric(12,2),                 -- boşsa sitede "Fiyat sorunuz"
  old_price  numeric(12,2),
  badge      text check (badge in ('Yeni', 'İndirim')),
  img        text,                          -- kapak görseli (URL ya da site içi yol)
  images     text[] not null default '{}',  -- galeri
  specs      jsonb  not null default '{}',  -- teknik özellikler {"Özellik": "Değer"}
  active     boolean not null default true, -- false: sitede görünmez
  sort       integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

drop policy if exists "herkes aktif ürünleri görür" on public.products;
create policy "herkes aktif ürünleri görür" on public.products
  for select to anon, authenticated using (active or public.is_admin());

drop policy if exists "admin ekler" on public.products;
create policy "admin ekler" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin günceller" on public.products;
create policy "admin günceller" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin siler" on public.products;
create policy "admin siler" on public.products
  for delete to authenticated using (public.is_admin());

-- 3) Ürün fotoğrafları için depolama alanı (herkes görür, sadece admin yükler/siler)
insert into storage.buckets (id, name, public)
values ('urunler', 'urunler', true)
on conflict (id) do update set public = true;

drop policy if exists "urunler: admin yükler" on storage.objects;
create policy "urunler: admin yükler" on storage.objects
  for insert to authenticated with check (bucket_id = 'urunler' and public.is_admin());

drop policy if exists "urunler: admin günceller" on storage.objects;
create policy "urunler: admin günceller" on storage.objects
  for update to authenticated using (bucket_id = 'urunler' and public.is_admin());

drop policy if exists "urunler: admin siler" on storage.objects;
create policy "urunler: admin siler" on storage.objects
  for delete to authenticated using (bucket_id = 'urunler' and public.is_admin());

-- 4) Yönetici hesabını tanımlama (bir kez):
--    Authentication → Users → Add user ile e-posta ve şifrenizi oluşturun,
--    sonra aşağıdaki satırdaki e-postayı kendi adresinizle değiştirip çalıştırın:
-- insert into public.admins (user_id) select id from auth.users where email = 'sizin@adresiniz.com';
