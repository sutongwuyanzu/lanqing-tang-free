# 兰清堂后台 · Supabase 配置指南

> 本站是 Next.js 静态导出站点（Cloudflare Pages），没有服务端。
> 后台采用 **Supabase + RLS（行级安全）** 方案：
> - 前台读价格 / 写订单 / 写愿望 → 匿名即可（RLS 放行）
> - 后台增删改 → 仅管理员（Supabase Auth 登录 + `admins` 表白名单）
> - 数据安全由 RLS 保证，前端跳转只是体验层防护

---

## 一、创建 Supabase 项目

1. 打开 https://supabase.com 注册并 **New Project**
2. 记下：
   - **Project URL**（形如 `https://xxxx.supabase.co`）
   - **anon public key**（Settings → API → `anon` `public`）

> 服务端 `service_role` key **不要**放进前端，本项目用不到。

---

## 二、建表

1. 进入 Dashboard → **SQL Editor** → New query
2. 把本项目 `supabase/schema.sql` 整段粘贴进去 → **Run**
3. 执行后会创建 4 张表（`admins` / `products` / `orders` / `wishes`）+ RLS 策略 + 6 条初始商品

---

## 三、创建管理员账号

1. Dashboard → **Authentication** → **Users** → **Add user**
2. 填邮箱 + 密码（这就是后台登录账号）
3. 回到 **SQL Editor**，把邮箱登记进白名单：

```sql
insert into public.admins (email, remark) values ('你的邮箱@example.com', '主管理员');
```

> 没在 `admins` 表里的账号，即使能在 Auth 登录，也会被 RLS 挡在数据外。

---

## 四、配置环境变量

### 本地开发
在项目根目录新建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...你的anon key
```

> 静态导出会在 `build` 时把 `NEXT_PUBLIC_` 前缀变量内联进 JS，所以必须 build 前就有。

### Cloudflare Pages 线上
项目 → Settings → Environment variables，添加同样两个变量（Production / Preview 都加）。
之后触发一次重新部署即可生效。

---

## 五、验证

1. 本地 `npm run dev`，打开 `/admin/` → 跳到 `/admin/login`
2. 用第三步的邮箱密码登录 → 进入仪表盘
3. 试改一个商品价格 → 回前台看是否生效（前台有缓存，刷新即可）
4. 前台点一盏灯 / 加抽一签 / 解锁起名 → 后台「订单」能看到记录
5. 前台许愿 → 后台「愿望」审核通过并设为公开 → 前台祈愿墙展示

---

## 六、表结构速查

| 表 | 用途 | 谁能写 |
|----|------|--------|
| `admins` | 管理员邮箱白名单 | 仅管理员读 |
| `products` | 商品 / 价格 | 所有人读；管理员写 |
| `orders` | 订单 | 匿名可插入；管理员读/改/删 |
| `wishes` | 祈愿墙愿望 | 匿名可插入；公开审核项所有人可读；管理员读/改/删 |

### product_key 对照（代码常量）
| key | 含义 | 默认价 |
|-----|------|--------|
| `lot_extra` | 灵签加抽 | 3.9 |
| `pray_month` | 点灯一月 | 9.9 |
| `pray_hundred` | 点灯百日 | 29.9 |
| `pray_year` | 点灯一年 | 99 |
| `pray_eternal` | 点灯永久 | 299 |
| `naming_unlock` | 起名解锁 | 29.9 |

---

## 七、降级说明

若 Supabase 未配置或不可达：
- 前台价格回退到 `lib/pricing.ts` 里的硬编码默认值（与上表一致）
- 订单 / 愿望写入静默失败，不影响前台付款流程体验
- 后台页面会提示「未配置 Supabase」

所以即使后台没配好，前台也能正常运转。
