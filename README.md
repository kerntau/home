# Space｜kerntau Home

一个基于 React 19、Vite 6 和 Tailwind CSS 4 的个人主页与数字空间，整合个人介绍、项目展示、文章索引、站点导航和技术时间线。

## 特性

- 明暗主题切换，跟随系统偏好并用 localStorage 持久化
- Motion 动效、CSS Custom Properties 和响应式布局
- PetCompanion 桌面互动宠物与 SignatureBackdrop 手绘签名背景
- Web Audio API 合成五声音阶风铃音效
- 一键复制 Email 并显示 Toast
- 运行时间、项目、文章和时间线等结构化数据
- prefers-reduced-motion、ARIA 和 focus-visible 无障碍支持
- Open Graph、动态 theme-color 等 SEO 元数据

## 技术栈

- React 19、TypeScript
- Vite 6
- Tailwind CSS 4、Motion
- Lucide React、Simple Icons
- Web Audio API
- 静态部署（输出 dist/）

## 目录

    public/                         # OG 图与静态资源
    src/
    ├── components/                 # 背景、品牌图标、宠物、签名和内容区块
    ├── data/site.ts                # 项目、文章、站点和时间线数据
    ├── App.tsx                     # 页面结构与状态
    ├── main.tsx                    # 应用入口
    └── index.css                   # 全局设计系统

## 本地开发

需要 Node.js 18+ 与 npm 9+。

    npm install
    npm run dev
    # 默认打开 http://localhost:3000

常用命令：

    npm run lint      # TypeScript 类型检查
    npm run build     # 生产构建
    npm run preview   # 预览 dist/

## 部署

运行 npm run build 后，将 dist/ 发布到 Cloudflare Pages 或其他静态托管服务。请在部署平台配置自己的站点域名；仓库未固定线上地址。
