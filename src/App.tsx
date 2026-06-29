/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import FloatingIslandCanvas, { TimePhase } from "./components/FloatingIslandCanvas";
import PortalCard from "./components/PortalCard";
import { motion } from "motion/react";
import { Cloud, Sparkles, Sunrise, Sun, Sunset, Moon, Clock } from "lucide-react";

const SKY_GRADIENTS: Record<TimePhase, string> = {
  morning: "from-[#ffd1a4] via-[#fbc2eb] to-[#a6c1ee]",
  afternoon: "from-[#81c7f4] via-[#b3e5fc] to-[#e8f5ff]",
  sunset: "from-[#fc5c7d] via-[#6a82fb] to-[#ffd194]",
  night: "from-[#0f2027] via-[#203a43] to-[#2c5364]",
};

function getAutoPhase(): TimePhase {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 19.5) return "sunset";
  return "night";
}

export default function App() {
  const [isFocused, setIsFocused] = useState(false);
  const [timeMode, setTimeMode] = useState<"auto" | TimePhase>("auto");

  // Determine current active phase
  const resolvedPhase = timeMode === "auto" ? getAutoPhase() : timeMode;
  const skyGradient = SKY_GRADIENTS[resolvedPhase];

  return (
    <main className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b ${skyGradient} transition-all duration-[1500ms] ease-in-out font-sans text-slate-800 flex items-center justify-center select-none`}>
      {/* 1. THREE.JS 3D BACKGROUND SCENE */}
      <FloatingIslandCanvas timeOfDay={resolvedPhase} />

      {/* 2. BACKGROUND SOUND & VISUAL DECOR (Miyazaki Aesthetic Hints) */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none hidden md:flex flex-col gap-1">
        <div className="flex items-center gap-2 text-white text-sm font-medium tracking-widest select-none">
          <Cloud className="w-4 h-4 text-white/90 animate-bounce" />
          <span className="opacity-90">COOX.ONE</span>
        </div>
        <p className="text-[11px] text-white/70 font-mono tracking-widest">
          kerntau // SPACE PORTAL
        </p>
      </div>

      <div className="absolute bottom-8 left-8 z-10 pointer-events-none hidden md:flex items-center gap-2 text-sky-900/60 text-xs tracking-widest font-light">
        <Sparkles className="w-3.5 h-3.5 text-sky-800/40 animate-pulse" />
        <span className="text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">「 起风了，唯有努力生存 。」</span>
      </div>

      {/* 3. FLOATING DYNAMIC SKY SELECTOR (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 shadow-lg">
        <button
          onClick={() => setTimeMode("auto")}
          className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
            timeMode === "auto"
              ? "bg-white text-accent-blue shadow-sm scale-110"
              : "text-white/75 hover:text-white hover:bg-white/5"
          }`}
          title="自动跟随当地时间"
        >
          <Clock className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/20" />
        <button
          onClick={() => setTimeMode("morning")}
          className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
            timeMode === "morning"
              ? "bg-[#ffd1a4] text-[#a05000] shadow-sm scale-110"
              : "text-white/75 hover:text-white hover:bg-white/5"
          }`}
          title="清晨 (Morning)"
        >
          <Sunrise className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTimeMode("afternoon")}
          className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
            timeMode === "afternoon"
              ? "bg-[#81c7f4] text-sky-900 shadow-sm scale-110"
              : "text-white/75 hover:text-white hover:bg-white/5"
          }`}
          title="午后 (Afternoon)"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTimeMode("sunset")}
          className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
            timeMode === "sunset"
              ? "bg-[#fc5c7d] text-white shadow-sm scale-110"
              : "text-white/75 hover:text-white hover:bg-white/5"
          }`}
          title="黄昏 (Sunset)"
        >
          <Sunset className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTimeMode("night")}
          className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
            timeMode === "night"
              ? "bg-[#1a237e] text-indigo-100 shadow-sm scale-110"
              : "text-white/75 hover:text-white hover:bg-white/5"
          }`}
          title="深夜 (Night)"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>

      {/* 4. INTERACTIVE 2D CARD OVERLAY (Positioned on top) */}
      <div className="w-full h-full flex items-center justify-center pointer-events-none z-20">
        <div className="pointer-events-auto w-full flex justify-center px-4">
          <PortalCard isFocused={isFocused} onFocusToggle={setIsFocused} timeOfDay={resolvedPhase} />
        </div>
      </div>

      {/* 5. LIGHTING & ATMOSPHERIC BLUR EFFECT ON THE SIDES */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sky-400/10 to-transparent pointer-events-none z-0" />
    </main>
  );
}

