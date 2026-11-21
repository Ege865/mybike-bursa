-- ==========================================================================
-- MY BIKE — Ziyaretçi istatistikleri
-- Supabase panelinde: SQL Editor → New query → tamamını yapıştırıp Run (Run as: postgres)
--
-- Ne tutulur: yalnızca çerezlere izin veren ziyaretçiler için rastgele bir
-- ziyaretçi numarası, oturum numarası, olay türü, sayfa adı ve ürün/kategori kodu.
-- Ne tutulmaz: IP adresi, ad, telefon, e-posta, form içerikleri, mesaj metni.
-- Kayıtlar 13 ay sonra otomatik silinir (aşağıdaki temizlik fonksiyonu).
-- ==========================================================================

create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor    uuid not null,
  session    uuid not null,
  type       text not null check (type in ('pageview', 'cart_add', 'wa_order', 'wa_appointment', 'wa_contact')),
  page       text check (page ~ '^[a-z0-9-]{1,40}$'),
  item       text check (char_length(item) <= 80 and item !~ '[<>"''`]')
);
create index if not exists analytics_events_created_idx on public.analytics_events (created_at);
create index if not exists analytics_events_visitor_idx on public.analytics_events (visitor, created_at);

-- Tarihi ziyaretçi değil sunucu belirler + hız sınırı (bot koruması):
--   • bir ziyaretçi numarasından dakikada en fazla 30 kayıt
--   • tüm siteden dakikada en fazla 600 kayıt
-- Sınırı aşan kayıtlar hata vermeden sessizce atılır.
create or replace function public.analytics_stamp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_at = now();
  if (select count(*) from public.analytics_events
      where visitor = new.visitor and created_at > now() - interval '1 minute') >= 30 then
    return null;
  end if;
  if (select count(*) from public.analytics_events
      where created_at > now() - interval '1 minute') >= 600 then
    return null;
  end if;
  return new;
end $$;
drop trigger if exists analytics_stamp on public.analytics_events;
create trigger analytics_stamp before insert on public.analytics_events
  for each row execute function public.analytics_stamp();

alter table public.analytics_events enable row level security;

-- Site ziyaretçileri yalnızca kayıt ekleyebilir; okuyamaz, değiştiremez, silemez
drop policy if exists "ziyaretçi olay ekler" on public.analytics_events;
create policy "ziyaretçi olay ekler" on public.analytics_events
  for insert to anon, authenticated with check (true);

drop policy if exists "admin olayları görür" on public.analytics_events;
create policy "admin olayları görür" on public.analytics_events
  for select to authenticated using (public.is_admin());

-- Rapor: yalnızca yönetici çağırabilir. Tarihler Türkiye saatine göre, bitiş günü dahil.
create or replace function public.analytics_report(p_from date, p_to date)
returns json
language plpgsql stable security definer set search_path = public
as $$
declare
  t0 timestamptz := (p_from::timestamp at time zone 'Europe/Istanbul');
  t1 timestamptz := ((p_to + 1)::timestamp at time zone 'Europe/Istanbul');
  bucket text := case when p_to - p_from > 62 then 'month' else 'day' end;
  result json;
begin
  if not public.is_admin() then
    raise exception 'yetki yok';
  end if;

  with ev as (
    select *, date_trunc(bucket, created_at at time zone 'Europe/Istanbul')::date as d
    from public.analytics_events
    where created_at >= t0 and created_at < t1
  ),
  wa as (select * from ev where type like 'wa\_%')
  select json_build_object(
    'bucket', bucket,
    'totals', json_build_object(
      'visitors',     (select count(distinct visitor) from ev),
      'sessions',     (select count(distinct session) from ev),
      'pageviews',    (select count(*) from ev where type = 'pageview'),
      'cart_visitors',(select count(distinct visitor) from ev where type = 'cart_add'),
      'cart_adds',    (select count(*) from ev where type = 'cart_add'),
      'wa_visitors',  (select count(distinct visitor) from wa),
      'wa_order',     (select count(distinct visitor) from ev where type = 'wa_order'),
      'wa_appointment',(select count(distinct visitor) from ev where type = 'wa_appointment'),
      'wa_contact',   (select count(distinct visitor) from ev where type = 'wa_contact'),
      'returning',    (select count(*) from (
                          select visitor from ev group by visitor having count(distinct session) > 1) r)
    ),
    'series', coalesce((
      select json_agg(s order by s.d) from (
        select d,
               count(distinct visitor) as visitors,
               count(*) filter (where type = 'pageview') as pageviews,
               count(distinct visitor) filter (where type like 'wa\_%') as wa
        from ev group by d
      ) s), '[]'::json),
    'pages', coalesce((
      select json_agg(p) from (
        select page, count(*) as views, count(distinct visitor) as visitors
        from ev where type = 'pageview' group by page order by views desc limit 10
      ) p), '[]'::json),
    'products', coalesce((
      select json_agg(p) from (
        select item, count(*) as views, count(distinct visitor) as visitors
        from ev where type = 'pageview' and page = 'urun' and item is not null
        group by item order by views desc limit 10
      ) p), '[]'::json),
    'carted', coalesce((
      select json_agg(p) from (
        select item, count(*) as adds
        from ev where type = 'cart_add' and item is not null
        group by item order by adds desc limit 10
      ) p), '[]'::json)
  ) into result;

  return result;
end $$;

revoke all on function public.analytics_report(date, date) from public, anon;
grant execute on function public.analytics_report(date, date) to authenticated;

-- 13 aydan eski kayıtları siler. Panel her açıldığında çağrılır.
create or replace function public.analytics_cleanup()
returns void
language sql security definer set search_path = public
as $$
  delete from public.analytics_events
  where created_at < now() - interval '13 months' and public.is_admin();
$$;
revoke all on function public.analytics_cleanup() from public, anon;
grant execute on function public.analytics_cleanup() to authenticated;
