export interface Article {
  title: string;
  summary: string;
  published: string;
  url: string;
  tags: string[];
}

export interface Project {
  name: string;
  description: string;
  repository: string;
  stack: string;
}

export interface Destination {
  name: string;
  address: string;
  description: string;
  url: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

export const ARTICLES: Article[] = [
  {
    title: "2026 国内外 AI 大模型发展态势深度分析",
    summary: "从技术路线、开源生态到应用落地，对主流模型与国内模型的发展方向进行横向梳理。",
    published: "2026.02.07",
    url: "https://blog.cot.wiki/blog/ai-analysis-2026",
    tags: ["AI 分析", "深度学习"],
  },
  {
    title: "动态规划从入门到精通",
    summary: "围绕状态、转移与边界，串联背包、LCS、编辑距离和 LIS 等经典问题。",
    published: "2026.02.07",
    url: "https://blog.cot.wiki/blog/dynamic-programming-guide",
    tags: ["算法", "LeetCode"],
  },
  {
    title: "十大排序算法性能深度对比",
    summary: "比较十类排序算法的原理、复杂度、稳定性与实际适用场景。",
    published: "2026.02.07",
    url: "https://blog.cot.wiki/blog/sorting-algorithms-comparison",
    tags: ["排序", "性能分析"],
  },
  {
    title: "图算法全景解析",
    summary: "从 BFS、DFS 延伸到最短路径、最小生成树和拓扑排序。",
    published: "2026.02.07",
    url: "https://blog.cot.wiki/blog/graph-algorithms",
    tags: ["图论", "最短路径"],
  },
];

export const PROJECTS: Project[] = [
  {
    name: "Blog / 序栈",
    description: "统一整合博客、知识库、搜索、归档、多语言与 SEO 管线的全栈技术站点。",
    repository: "https://github.com/kerntau/blog",
    stack: "Next.js · TypeScript",
  },
  {
    name: "Space",
    description: "现在的个人主页与内容入口。旧主页内容已归入这里，共享同一套视觉语言和交互架构。",
    repository: "https://github.com/kerntau/home",
    stack: "React · Vite · Motion",
  },
];

export const DESTINATIONS: Destination[] = [
  {
    name: "序栈博客",
    address: "blog.cot.wiki",
    description: "长文、工程记录与技术思考。",
    url: "https://blog.cot.wiki",
  },
  {
    name: "知识库",
    address: "kb.cot.wiki",
    description: "基础原理、算法与长期可复用的笔记。",
    url: "https://kb.cot.wiki",
  },
  {
    name: "GitHub",
    address: "github.com/kerntau",
    description: "公开仓库、实验项目与代码轨迹。",
    url: "https://github.com/kerntau",
  },
  {
    name: "Bilibili",
    address: "space.bilibili.com/9655855",
    description: "视频与动态内容。",
    url: "https://space.bilibili.com/9655855",
  },
];

export const TIMELINE: TimelineEntry[] = [
  {
    date: "2026.07",
    title: "空间成为主页",
    description: "将旧主页的信息与内容入口归入 Space，并统一设计语言和工程架构。",
  },
  {
    date: "2026.07",
    title: "启用 coox.one",
    description: "更新域名体系，并全面迁移至 Cloudflare。",
  },
  {
    date: "2026.04 - 至今",
    title: "长期事项",
    description: "在完成一件需要耐心的事。",
  },
  {
    date: "2026.02",
    title: "重构序栈",
    description: "使用 React 重构个人博客与知识库体验。",
  },
  {
    date: "2025.11",
    title: "序栈成型",
    description: "个人博客正式成型，名称定为「序栈 / COT」。",
  },
];
