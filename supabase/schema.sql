-- ============================================================
-- 兰清堂后台 · Supabase 建表脚本
-- 在 Supabase Dashboard → SQL Editor → New query 整段执行
-- ============================================================

-- 扩展：生成 uuid（Supabase 默认已启用 pgcrypto，这里保险起见）
create extension if not exists pgcrypto;

-- ============================================================
-- 1. admins —— 管理员邮箱白名单
--    登录账号在 Auth > Users 创建，邮箱在此表登记后才算管理员
-- ============================================================
create table if not exists public.admins (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  remark     text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. 管理员判定函数（RLS 策略复用）
--    取当前登录用户的 email，比对 admins 表
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select true from public.admins
     where email = (auth.jwt() ->> 'email')),
    false
  );
$$;

-- ============================================================
-- 3. products —— 商品 / 价格表
--    前台读这里的价格；product_key 与代码里常量一一对应
-- ============================================================
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  product_key text unique not null,          -- 'lot_extra' | 'pray_month' | ...
  name        text not null,                  -- 显示名
  category    text not null,                  -- 'lot' | 'pray' | 'naming'
  price       numeric(10,2) not null,
  is_active   boolean not null default true,
  sort        int not null default 0,
  remark      text,
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- 4. orders —— 订单表
--    前台“我已完成付款”即写入一条，status=paid
-- ============================================================
create table if not exists public.orders (
  id            bigint generated always as identity primary key,
  order_no      text not null,                -- 前端生成（如时间戳+随机）
  type          text not null,                -- 'lot' | 'pray' | 'naming'
  product_key   text,                          -- 关联 products.product_key
  product_name  text,                          -- 快照：下单时的商品名
  amount        numeric(10,2) not null,        -- 快照：实付金额
  customer_name text,                          -- 点灯家人姓名 / 起名人
  customer_phone text,                         -- 手机号（可选）
  detail        jsonb,                         -- 扩展字段：lamp/duration/relationship/wish 等
  status        text not null default 'paid',  -- 'paid' | 'pending' | 'refunded'
  created_at    timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_type_idx       on public.orders (type);
create index if not exists orders_status_idx     on public.orders (status);

-- ============================================================
-- 5. wishes —— 祈愿墙 / 灵签许愿
--    审核通过且 is_public 的才在前台展示
-- ============================================================
create table if not exists public.wishes (
  id           bigint generated always as identity primary key,
  source       text not null,                  -- 'pray' | 'lot'
  customer_name text,                          -- 原始姓名
  masked_name  text,                           -- 脱敏名（王*英）
  lamp         text,                           -- 灯名（pray 来源）
  content      text,                           -- 愿望内容
  status       text not null default 'pending',-- 'pending' | 'approved' | 'rejected'
  is_public    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists wishes_status_idx    on public.wishes (status);
create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

-- ============================================================
-- RLS —— 行级安全
-- ============================================================
alter table public.admins   enable row level security;
alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.wishes   enable row level security;

-- admins：仅管理员可读
drop policy if exists "admins admin read" on public.admins;
create policy "admins admin read" on public.admins
  for select to authenticated using (public.is_admin());

-- products：所有人可读（价格公开）；仅管理员可写
drop policy if exists "products anon read" on public.products;
create policy "products anon read" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- orders：匿名/登录用户可插入（下单）；仅管理员可读/改/删
drop policy if exists "orders anon insert" on public.orders;
create policy "orders anon insert" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders admin all" on public.orders;
create policy "orders admin all" on public.orders
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- wishes：匿名/登录用户可插入（许愿）；
--         所有人只能读 已审核且公开 的；
--         管理员可读全部、可改/删
drop policy if exists "wishes anon insert" on public.wishes;
create policy "wishes anon insert" on public.wishes
  for insert to anon, authenticated with check (true);

drop policy if exists "wishes public read" on public.wishes;
create policy "wishes public read" on public.wishes
  for select to anon, authenticated
  using (status = 'approved' and is_public = true);

drop policy if exists "wishes admin all" on public.wishes;
create policy "wishes admin all" on public.wishes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 初始商品数据（与前台硬编码默认价一致，可后台改）
-- ============================================================
insert into public.products (product_key, name, category, price, is_active, sort, remark) values
  ('lot_extra',    '灵签加抽',     'lot',    3.9,  true, 1, '今日免费次数用完后加抽一签'),
  ('pray_month',   '点灯·一月供奉', 'pray',   9.9,  true, 11, '祈福点灯'),
  ('pray_hundred', '点灯·百日供奉', 'pray',  29.9,  true, 12, '祈福点灯'),
  ('pray_year',    '点灯·一年供奉', 'pray',  99,    true, 13, '祈福点灯'),
  ('pray_eternal', '点灯·永久长明', 'pray', 299,    true, 14, '祈福点灯'),
  ('naming_unlock','起名解锁全部',   'naming', 29.9, true, 21, '解锁全部15个名字')
on conflict (product_key) do nothing;

-- ============================================================
-- 提示：执行完后请到 Auth > Users 创建管理员账号，
--       再回到 SQL Editor 把邮箱加入 admins：
--       insert into public.admins (email) values ('你的邮箱@example.com');
-- ============================================================
