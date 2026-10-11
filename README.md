<div align="center">

# Space · kerntau Home

**带主题、动效和互动组件的个人数字空间**<br>
*A motion-rich personal space built with React and Vite*

[![Status](https://img.shields.io/badge/Status-Active-2ea44f?style=for-the-badge)](https://github.com/kerntau/home)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://github.com/kerntau/home)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://github.com/kerntau/home)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://github.com/kerntau/home)

</div>

---

## 01. 项目定位 // POSITIONING

Space 是一个静态个人主页和数字空间，整合个人介绍、项目展示、文章索引、站点导航和技术时间线。它在浏览器中完成主题、音频和互动效果，不依赖后端服务。

## 02. 功能与边界 // SCOPE

- 明暗主题切换，跟随系统偏好并使用 localStorage 持久化。
- Motion 动效、CSS Custom Properties、响应式和 prefers-reduced-motion。
- PetCompanion 桌面互动宠物与 SignatureBackdrop 手绘签名背景。
- Web Audio API 合成五声音阶风铃音效，一键复制 Email 并显示 Toast。
- Open Graph、动态 theme-color、ARIA 和 focus-visible 支持。
- 项目、文章、站点和时间线来自结构化前端数据，不提供在线编辑或账号系统。

## 03. 技术矩阵 // TECHNICAL MATRIX

| 模块 | 技术 | 责任 |
| --- | --- | --- |
| 应用 | React 19、TypeScript | 页面和状态 |
| 构建 | Vite 6 | 开发服务器和静态构建 |
| 样式 | Tailwind CSS 4、CSS variables | 响应式主题 |
| 动效 | Motion | 过渡、背景和交互 |
| 图标 | Lucide React、Simple Icons | 品牌和 UI 图标 |
| 音频 | Web Audio API | 浏览器端风铃合成 |

## 04. 目录拓扑 // REPOSITORY TOPOLOGY

~~~text
.
├── public/                    # OG 图和静态资源
├── src/
│   ├── components/            # 背景、品牌、宠物、签名和内容区块
│   ├── data/site.ts           # 项目、文章、站点和时间线数据
│   ├── App.tsx                # 页面结构与状态控制
│   ├── main.tsx               # React 入口
│   └── index.css              # 全局设计系统
├── index.html                 # 页面模板与 SEO
├── package.json
└── vite.config.ts
~~~

## 05. 快速开始 // QUICK START

环境要求：Node.js 18+、npm 9+。

~~~bash
npm install
npm run dev
# 默认打开 http://localhost:3000
~~~

## 06. 部署与验证 // DEPLOYMENT & VALIDATION

~~~bash
npm run lint
npm run build
npm run preview
~~~

将 dist/ 发布到 Cloudflare Pages 或其他静态托管服务。上线前检查明暗主题、键盘焦点、减少动效、音频权限和移动端布局；仓库没有固定线上地址。



## 09. 许可证 // LICENSE

仓库当前未附带 LICENSE 文件。使用或再分发前，请先补充许可证并同步更新本节。
