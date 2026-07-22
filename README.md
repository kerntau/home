# kerntau Home

kerntau 的统一个人主页。原 `homepage` 项目的介绍、文章、项目、站点与日志已合并到 Space 的设计语言和 React 架构中。

## 技术栈

React 19 + Vite 6 + TypeScript + Tailwind CSS v4 + Motion

## 功能

- 明暗主题：localStorage 持久化，首次访问读取 `prefers-color-scheme` 系统偏好
- 欢迎横幅：可关闭，sessionStorage 记忆关闭状态
- 统一内容：首页内整合个人介绍、文章索引、项目、站点与时间线
- 社交链接：Email（点击复制到剪贴板）、GitHub、抖音、Bilibili
- 风铃音效：Web Audio API 合成五声音阶，带颤音和指数衰减
- 运行时间：从 2025-11-10 起实时计时，独立组件隔离重渲染
- 无障碍：`prefers-reduced-motion` 支持、键盘 focus-visible 样式、ARIA 标签
- SEO：meta description + Open Graph 标签，theme-color 随主题动态更新
- 响应式：移动端/桌面端断点适配

## 项目结构

- `src/App.tsx`：主题、背景、宠物、通知与页面壳层
- `src/components/`：主页内容区组件
- `src/data/`：文章、项目、站点与时间线数据

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

Cloudflare Pages — 构建产物 `dist/` 目录。

---

*"起风了，唯有努力生存。"*
