# CHANGELOG — playsnow.top

## [v1.1.0] - 2026-02-26 — SEO 全面修复

### 新增
- `vercel.json`：cleanUrls + trailingSlash:false + HSTS header（修复 P0-3，解决游戏页面 URL 格式不一致问题）
- 所有游戏页面加 `canonical` 标签（修复 P0-1，16个游戏页面 + 7个分类页面）
- 所有游戏页面加 `BreadcrumbList` JSON-LD schema（修复 P1-1）
- `VideoGame` schema 新增 `url` 字段（修复 P1-2）

### 修改
- `sitemap.ts`：首页 URL 改为 `https://playsnow.top/`（加尾部斜杠，修复 P0-2）
- `games/[slug]/page.tsx`：meta title 改为 `Play {Game} Online Free - No Download`（修复 P0-5）
- `games/[slug]/page.tsx`：meta description 扩展至 120+ 字符，包含长尾关键词（修复 P0-6）
- `layout.tsx`：全局 metadata 加 `alternates.canonical`
- `category/[slug]/page.tsx`：分类页加 `canonical`（修复 P1-3）
- `page.tsx`：首页游戏数量改为动态 `{games.length}`（修复 P1-4）

### 背景
GSC 显示 27 个游戏子页面"已找到-目前尚未建立索引"，根因：
1. 所有页面缺 canonical → Google 无法确定权威 URL
2. 无 vercel.json → cleanUrls 未配置，静态导出 .html 文件与 sitemap URL 不一致
3. sitemap 首页 URL 无尾部斜杠 → 与 GSC 收录 URL 不一致

修复后需在 GSC 手动重新提交 sitemap：https://playsnow.top/sitemap.xml
