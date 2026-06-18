# 兰清堂 — Cloudflare Pages 部署指南

## 🚀 一键部署（推荐，3分钟搞定）

代码已推送到 GitHub：**https://github.com/sutongwuyanzu/lanqing-tang**

### 步骤 1：在 Cloudflare 创建项目

1. 打开 https://dash.cloudflare.com → 登录你的账号
2. 左侧菜单点 **Workers & Pages**
3. 点 **创建应用程序** → **Pages** → **连接到 Git**
4. 授权 GitHub，选择仓库 **`lanqing-tang`**
5. 构建设置：
   ```
   框架预设：       Next.js（静态导出） 或 None
   构建命令：       npm run build
   构建输出目录：   out
   ```
6. 环境变量（展开"环境变量"添加）：
   ```
   NODE_VERSION = 20
   ```
7. 点 **保存并部署**

### 步骤 2：等待构建

- Cloudflare 会自动 `npm install` + `npm run build`
- 约 2-3 分钟完成
- 完成后获得地址：**https://lanqing-tang.pages.dev**

### 步骤 3：（可选）绑定自定义域名

1. Pages 项目 → **自定义域** → **设置自定义域**
2. 输入你的域名（如 `lanqing.xxx.com`）
3. 按提示添加 CNAME 记录
4. Cloudflare 会自动配置 SSL 证书

---

## 📝 项目说明

- **框架**：Next.js 16（静态导出模式 `output: export`）
- **输出目录**：`out/`（纯静态 HTML/CSS/JS）
- **所有功能**：纯前端，无需服务器
- **数据存储**：localStorage（浏览器本地）

### 页面清单
| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 四大善门入口 |
| 关帝灵签 | `/lingqian` | 100支签文 |
| 周公解梦 | `/dream` | 双体系解读 |
| 祈福点灯 | `/pray` | 支付宝收款 |
| 八字起名 | `/bazi` | 排盘+起名 |
| 登录 | `/login` | 模拟登录 |
| 个人中心 | `/profile` | 功德记录 |

---

## 🔧 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 构建到 out/ 目录
```

---

## ❓ 常见问题

**Q: 构建失败怎么办？**
A: 检查 Cloudflare 构建日志，确认 NODE_VERSION=20 已设置。

**Q: 页面打开是 404？**
A: 确认构建输出目录填的是 `out`（不是 `.next`）。

**Q: 想更新网站？**
A: 修改代码后 `git push`，Cloudflare 会自动重新构建部署。
