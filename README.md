# kerntau Portfolio Portal 🌸 | 个人主页

> 一个融合了吉卜力（Ghibli）盛夏群岛美学、3D 互动微光以及动态天空交替的精致极简个人主页。

---

## 🎨 视觉与体验亮点 | Design Highlights

### 1. 3D 空中浮岛场景 (`FloatingIslandCanvas.tsx`)
- 基于 **Three.js** 粒子系统和程序化网格，渲染了一座漂浮在澄澈碧空中的微缩群岛。
- **微风落樱系统**：轻柔无规则摇曳的樱花瓣从空中洒下。
- **重力与鼠标位移交互**：镜头会轻微跟随鼠标偏移而产生视差，使整体空间更加立体、灵动。

### 2. 动态天空系统与微光粒子交互
- **当地时间同步/手动调节**：主页会根据用户当前的真实时区与时间，自动在 **清晨 (Morning)**、**午后 (Afternoon)**、**黄昏 (Sunset)**、**深夜 (Night)** 四种精美配色阶段之间自由平滑过渡。
- **微光粒子溅射 (Magical Link)**：鼠标悬停在链接卡片按钮上时，会溅射出符合当前天空时间色调的微光魔幻粒子（Glow Flares），带给用户充满惊喜的物理反馈。

### 3. 精致吉卜力渐变边框头像
- 精心调配的天蓝到草绿再到点缀蓝的吉卜力天空之境渐变边框。
- 为头像加上了真实的深度投影，让 2D 人像极其自然且和谐地融入在 3D 的群岛微光场景深处。

### 4. 治愈音效
- 搭载了精巧的微风吹拂风铃声（Wind Chime Sound Effect），轻抚屏幕上方的铃铛，即可聆听清脆治愈的白噪音。

---

## 🛠️ 技术栈 | Tech Stack

- **框架**：React 18 + Vite
- **3D 引擎**：Three.js + GSAP (平滑状态过渡)
- **动效/动画**：Motion (Framer Motion)
- **样式**：Tailwind CSS (极简设计、磨砂玻璃拟态 Backdrop Blur)
- **图标**：Lucide React

---

## 🚀 本地开发 | Local Development

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打包构建：
   ```bash
   npm run build
   ```

---

*“起风了，唯有努力生存。” — 吉卜力工作室*
