# Space (kerntau Home)

> kerntau 的个人主页与数字空间。基于 React 19、Vite 6 与 Tailwind CSS 搭建，整合个人介绍、项目展示、站点导航与技术日志。

## 核心特性

- **主题与视觉**
  - 支持明暗主题切换，自动读取 `prefers-color-scheme` 系统偏好，并通过 `localStorage` 持久化。
  - 基于 CSS Custom Properties 与 Motion 动效系统，提供极简高质感视觉体验。
  - 内置桌面宠物交互组件（PetCompanion）与手绘签名背景（SignatureBackdrop）。

- **音频与互动体验**
  - 基于 Web Audio API 实现五声音阶风铃音效，包含颤音调制与指数衰减合成。
  - 点击一键复制 Email 地址，搭配 Toast 提示交互。

- **实时状态与数据管理**
  - 独立组件实时计算并显示站点运行时间（基准起点：2025-11-10）。
  - 结构化模块管理个人项目、文章索引、推荐站点与时间线记录。

- **无障碍与 SEO 优化**
  - 深度适配 `prefers-reduced-motion` 动效减缓策略。
  - 遵循 ARIA 规范与键盘 `focus-visible` 焦点样式。
  - 完整配置 Open Graph (OG) 社交分享元标签与动态 `theme-color`。

## 技术栈

| 领域 | 技术方案 |
| --- | --- |
| **核心框架** | React 19 + TypeScript |
| **构建工具** | Vite 6 |
| **样式与 UI** | Tailwind CSS v4 + Motion |
| **图标库** | Lucide React + @icons-pack/react-simple-icons |
| **音频合成** | Web Audio API |
| **部署托管** | Cloudflare Pages |

## 项目结构

```text
space/
├── public/                 # 静态资源 (含 OG 分享图、图片素材等)
├── src/
│   ├── components/         # 核心 UI 组件
│   │   ├── BackgroundAtmosphere.tsx # 背景氛围高光
│   │   ├── BrandLogos.tsx           # 品牌与社交图标组件
│   │   ├── PetCompanion.tsx         # 桌面互动宠物组件
│   │   ├── SignatureBackdrop.tsx    # 动态签名背景组件
│   │   └── SiteSections.tsx         # 内容区块 (文章/项目/站点/日志)
│   ├── data/               # 结构化数据
│   │   └── site.ts
│   ├── App.tsx             # 页面主体结构与状态控制
│   ├── main.tsx            # React 应用入口
│   └── index.css           # 全局设计系统与样式定义
├── index.html              # HTML 页面模板与 SEO 配置
├── package.json
└── vite.config.ts
```

## 本地开发

### 环境准备

- Node.js >= 18
- npm >= 9

### 命令说明

- **安装依赖**：
  ```bash
  npm install
  ```
- **启动开发服务器**（默认端口 `3000`）：
  ```bash
  npm run dev
  ```
- **类型检查**：
  ```bash
  npm run lint
  ```
- **构建生产产物**：
  ```bash
  npm run build
  ```

## 部署说明

项目支持部署至 **Cloudflare Pages** 或任何静态托管服务。构建输出目录为 `dist`。

---

*"起风了，唯有努力生存。"*
