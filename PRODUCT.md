# PlayNow.fun — 产品设计文档 v2

> 最后更新：2026-02-18
> 负责人：毛毛
> 目标：全球英文 H5 小游戏聚合站，日均 1000 UV，申请 AdSense

---

## 一、产品定位

- **目标用户**：全球英语用户，主要是学生和上班摸鱼族
- **核心卖点**：经典游戏即点即玩，无需下载，无需注册
- **SEO 关键词策略**：瞄准 "play [game] online free"、"[game] unblocked" 等长尾词
- **竞争策略**：不跟大站拼数量（Poki 有 1000+ 游戏），靠内容深度和页面质量取胜

## 二、技术栈

| 项 | 选择 | 理由 |
|---|---|---|
| 框架 | Next.js 14 (App Router) | SSG 静态生成，SEO 友好 |
| 样式 | Tailwind CSS | 快速开发，响应式 |
| 部署 | Cloudflare Pages | 免费，全球 CDN，速度快 |
| 游戏 | 自研 Canvas/React 组件 | 无外部依赖，加载快 |
| 分析 | Google Analytics 4 | 免费，AdSense 审核加分 |
| 广告 | Google AdSense | 目标变现渠道 |

## 三、页面结构

### 3.1 全局组件

**Header（所有页面共享）**
- Logo（左）：PlayNow 文字 Logo + 🎮 图标
- 导航（中）：Home | Categories（下拉菜单）| New | Popular
- 搜索框（右）：placeholder "Search games..."
- 移动端：Logo + 汉堡菜单 + 搜索图标

**Footer（所有页面共享）**
- 分类链接列表（内链，SEO 用）
- 法律链接：Privacy Policy | Terms of Service | Contact
- 版权信息 + 简短介绍文案
- "Free online games - no download required"

### 3.2 首页 `/`

```
[Header]
[Hero Section] — 标语 + 简介 + CTA 按钮
[Popular Games] — 2 行热门游戏卡片（大卡片）
[Categories Grid] — 分类入口卡片（Puzzle/Classic/Casual/Board/Strategy）
[New Games] — 最新游戏横向滚动
[All Games] — 完整游戏网格
[SEO Text Block] — 关于网站的介绍文案（300+ 字，含关键词）
[Footer]
```

### 3.3 游戏详情页 `/games/[slug]`

```
[Header]
[Breadcrumb] — Home > Puzzle Games > 2048
[Game Area] — 游戏组件，居中，最大宽度限制
[Game Info Bar] — 标题 | 分类标签 | 分享按钮
[Ad Slot 1] — 游戏下方横幅广告位
[How to Play] — 详细操作说明（桌面 + 移动端分开写）
[Game Features] — 游戏特色要点列表
[Tips & Tricks] — 游戏技巧（3-5 条）
[FAQ] — 3-5 个结构化问答（Schema markup）
[Related Games] — 同分类推荐（5 个卡片）
[Ad Slot 2] — 页面底部广告位
[Footer]
```

**关键：每个游戏页面至少 800 字内容**，包含：
- 游戏历史/背景（50-100 字）
- 详细玩法说明（200+ 字）
- 操作指南（桌面 + 移动端）
- 3-5 个技巧
- 3-5 个 FAQ

### 3.4 分类页 `/category/[slug]`

```
[Header]
[Category Title + Description] — 分类介绍（100+ 字）
[Games Grid] — 该分类下所有游戏
[SEO Text Block] — 分类相关长文案
[Footer]
```

### 3.5 法律/信息页面

- `/privacy-policy` — 隐私政策（AdSense 必需）
- `/terms` — 使用条款
- `/about` — 关于我们
- `/contact` — 联系方式（AdSense 必需）

## 四、游戏卡片设计

```
┌─────────────────────┐
│                     │
│   [Canvas 缩略图]    │  ← 游戏实际截图，不是 emoji
│                     │
├─────────────────────┤
│ 🧩 Puzzle           │  ← 分类标签
│ 2048                │  ← 游戏标题
│ Slide tiles to win  │  ← 一句话描述
└─────────────────────┘
```

**缩略图方案**：用 Canvas 渲染游戏初始状态截图，build 时生成静态图片。
这样不需要外部图片资源，保持纯静态部署。

## 五、SEO 策略

### 5.1 技术 SEO
- `sitemap.xml` — 自动生成，包含所有页面
- `robots.txt` — 允许所有爬虫
- Canonical URL — 每页设置
- Open Graph + Twitter Card — 社交分享优化
- JSON-LD Schema — Game 类型结构化数据 + FAQ Schema

### 5.2 内容 SEO
- 每个游戏页 800+ 字原创内容
- H1/H2 层级清晰
- 内链策略：游戏页互相推荐，分类页链接到游戏页
- 长尾关键词：每个游戏页瞄准 3-5 个关键词

### 5.3 URL 结构
```
/                          首页
/games/2048                游戏详情
/games/snake               游戏详情
/category/puzzle           分类页
/category/classic          分类页
/privacy-policy            隐私政策
/terms                     使用条款
/about                     关于
/contact                   联系
/sitemap.xml               站点地图
```

## 六、广告位规划（AdSense）

| 位置 | 类型 | 尺寸 |
|------|------|------|
| 游戏下方 | 横幅广告 | 728x90 / 响应式 |
| 页面底部 | 横幅广告 | 728x90 / 响应式 |
| 侧边栏（桌面端） | 矩形广告 | 300x250 |

**原则**：
- 游戏区域内不放广告
- 不用弹窗广告
- 移动端最多 2 个广告位
- 先预留位置，AdSense 审核通过后再接入

## 七、10 个游戏选择

| 游戏 | 分类 | 月搜索量（估） | 难度 |
|------|------|---------------|------|
| 2048 | Puzzle | 1.8M | 低 |
| Snake | Classic | 1.2M | 低 |
| Tetris | Puzzle | 2.5M | 中 |
| Flappy Bird | Casual | 800K | 低 |
| Minesweeper | Puzzle | 1.5M | 中 |
| Pac-Man | Classic | 1.0M | 高 |
| Sudoku | Puzzle | 2.0M | 中 |
| Chess | Board | 3.0M | 高 |
| Tic Tac Toe | Casual | 600K | 低 |
| Memory Match | Puzzle | 400K | 低 |

## 八、AdSense 审核清单

- [x] 原创内容（自研游戏 + 原创文案）
- [ ] 隐私政策页面
- [ ] 使用条款页面
- [ ] 联系方式页面
- [ ] 关于页面
- [ ] 至少 15-20 页有实质内容
- [ ] 网站运行 2-4 周
- [ ] Google Analytics 接入
- [ ] 移动端友好
- [ ] 页面加载速度 < 3 秒

## 九、开发计划

### Phase 1：核心框架（子 agent 1）
- 全局 Layout（Header + Footer）
- 首页
- 游戏详情页模板
- 分类页模板
- 法律页面（4 页）
- SEO 基础（sitemap、robots、Schema）
- 响应式适配

### Phase 2：10 个游戏组件（子 agent 2）
- 每个游戏独立组件
- 触屏支持
- 游戏缩略图生成

### Phase 3：内容填充（子 agent 3）
- 每个游戏的详细文案（800+ 字）
- FAQ 内容
- 分类页文案
- 首页 SEO 文案

### Phase 4：优化 & 部署
- 性能优化（Lighthouse 90+）
- 最终审核
- 部署到 Cloudflare Pages

---

> 这份文档是开发的唯一依据。所有代码必须符合这里的规范。
