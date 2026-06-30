import React, { useState, useRef } from "react";
import { Mail, MapPin, Calendar, GraduationCap, Github, Home, BookOpen, Copy, Check, Music, Compass, Sun, Wind } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MagicalLinkProps {
  href: string;
  children: React.ReactNode;
  timeOfDay?: "morning" | "afternoon" | "sunset" | "night";
}

function MagicalLink({ href, children, timeOfDay = "afternoon" }: MagicalLinkProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);
  const nextId = useRef(0);

  const triggerExplosion = () => {
    // Determine particle color palette based on time of day
    let palette = ["#FFFFFF", "#B3E5FC", "#FFF9C4", "#81C7F4", "#E8F5FF"]; // default afternoon
    if (timeOfDay === "morning") {
      palette = ["#FFFFFF", "#FFCCD2", "#FFD1A4", "#FBC2EB", "#A6C1EE"];
    } else if (timeOfDay === "sunset") {
      palette = ["#FFFFFF", "#FFD1A4", "#FFE082", "#FC5C7D", "#FF7043"];
    } else if (timeOfDay === "night") {
      palette = ["#FFFFFF", "#B3E5FC", "#E8F5FF", "#00E5FF", "#40C4FF"];
    }

    const newParticles = Array.from({ length: 12 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 25 + Math.random() * 50;
      return {
        id: nextId.current++,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        size: 2.5 + Math.random() * 4,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup particles once animation finishes
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 700);
  };

  const isDark = timeOfDay === "night" || timeOfDay === "sunset";
  const linkBtnStyle = isDark
    ? "bg-white/12 hover:bg-white text-white hover:text-accent-blue border-white/20"
    : "bg-slate-800/10 hover:bg-slate-800 text-slate-800 hover:text-white border-slate-800/10";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={triggerExplosion}
      className={`relative px-5 py-2 rounded-full text-xs font-semibold border hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm flex items-center gap-1.5 overflow-visible ${linkBtnStyle}`}
    >
      {children}

      {/* Particle explosion layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [1, 1.4, 0],
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 5px ${p.color}, 0 0 10px ${p.color}`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </a>
  );
}

interface PortalCardProps {
  onFocusToggle: (focused: boolean) => void;
  isFocused: boolean;
  timeOfDay?: "morning" | "afternoon" | "sunset" | "night";
}

export default function PortalCard({ onFocusToggle, isFocused, timeOfDay = "afternoon" }: PortalCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  const email = "cotovo@qq.com";

  // Copy email helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Web Audio API Procedural Wind Chime Synthesizer
  // Generates warm, healing pentatonic chime notes (Miyazaki vibe)
  const playWindChime = () => {
    try {
      setIsPlayingChime(true);
      setTimeout(() => setIsPlayingChime(false), 800);

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Pentatonic scale frequencies in C major (healing, pure tones)
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const randomFreq = scale[Math.floor(Math.random() * scale.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Triangle waves sound extremely soft and flute-like
      osc.type = "sine";
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      // Add a subtle vibrato
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 6; // Hz
      vibratoGain.gain.value = 3; // depth
      vibrato.connect(osc.frequency);
      vibrato.start();

      // Beautiful wind chime long decay envelope
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn("Web Audio block or not supported:", e);
    }
  };

  const isDark = timeOfDay === "night" || timeOfDay === "sunset";

  // Dynamic Theme Styling Configuration
  const textPrimary = isDark ? "text-white" : "text-slate-800";
  const textSecondary = isDark ? "text-white/80" : "text-slate-600";
  const textMuted = isDark ? "text-white/60" : "text-slate-400";
  const textAccentLabel = isDark
    ? timeOfDay === "sunset" ? "text-amber-200/90" : "text-indigo-200/90"
    : "text-accent-blue";

  const contactBg = isDark
    ? "bg-white/10 border-white/20 text-white"
    : "bg-slate-800/5 border-slate-800/10 text-slate-800";
  const contactLink = isDark ? "text-white hover:text-white/80" : "text-slate-800 hover:text-accent-blue";
  const contactCopyBtn = isDark ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-accent-blue";

  const dividerStyle = isDark ? "bg-white/20" : "bg-slate-800/10";
  const footerBorder = isDark ? "border-white/20" : "border-slate-800/10";

  const focusBtnStyle = isDark
    ? "border-white/20 hover:border-white hover:text-white hover:bg-white/10"
    : "border-slate-800/20 hover:border-slate-800 hover:text-slate-800 hover:bg-slate-800/5";

  const chimeBtnStyle = isDark
    ? "border-white/40 bg-[#FDFCF8]/20 text-white hover:text-accent-blue hover:bg-[#FDFCF8]"
    : "border-slate-800/20 bg-slate-800/5 text-slate-800 hover:text-white hover:bg-slate-800";

  return (
    <div className="relative w-full max-w-xl px-4 md:px-0 z-10">
      <AnimatePresence mode="wait">
        {!isFocused ? (
          <motion.div
            key="portal-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="w-full max-w-[480px] p-6 md:p-8 flex flex-col relative text-center select-none"
          >
            {/* Float/Wind Decor Icon in upper corner */}
            <button
              onClick={playWindChime}
              className={`absolute -top-12 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 p-2.5 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 cursor-pointer group ${chimeBtnStyle}`}
              title="轻触聆听治愈风铃"
            >
              <motion.div
                animate={isPlayingChime ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Wind className="w-4 h-4" />
              </motion.div>
              <span className={`absolute right-10 top-1/2 -translate-y-1/2 bg-accent-blue text-white text-[10px] tracking-wider px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm`}>
                轻抚风铃
              </span>
            </button>

            {/* Profile Avatar & Title */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative mb-5 flex-shrink-0 group/avatar">
                {/* Exquisite Ghibli Sky Gradient Border with realistic physical shadow & glow */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-sky-blue via-grass-green to-accent-blue p-[3px] transition-all duration-500 hover:scale-105 ${
                  isDark 
                    ? "shadow-[0_12px_28px_rgba(0,0,0,0.45),_0_0_15px_rgba(135,206,235,0.25)]" 
                    : "shadow-[0_12px_24px_rgba(74,144,226,0.25),_0_0_12px_rgba(152,251,152,0.2)]"
                } flex items-center justify-center`}>
                  {/* Inner contrast ring that perfectly separates avatar from the gradient */}
                  <div className={`w-full h-full rounded-full p-[2px] flex items-center justify-center overflow-hidden transition-colors duration-500 ${
                    isDark ? "bg-[#101c3d]" : "bg-white/95"
                  }`}>
                    <img
                      src="https://github.com/cotovo.png"
                      alt="kerntau Avatar"
                      className="w-full h-full rounded-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover/avatar:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-grass-green opacity-75"></span>
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 bg-grass-green border-2 ${isDark ? "border-[#1a237e]" : "border-[#e8f5ff]"}`}></span>
                </span>
              </div>

              <h1 className={`text-[44px] font-semibold tracking-[6px] uppercase mb-1 leading-none select-all ${textPrimary}`}>
                kerntau
              </h1>
              <p className={`text-[11px] tracking-widest uppercase ${textSecondary}`}>
                Meticulous Frontend Crafter
              </p>
            </div>

            {/* Divider */}
            <div className={`w-12 h-[2px] mx-auto my-6 transition-all duration-500 ${dividerStyle}`} />

            {/* Personal Details Grid (Info Grid) */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center text-center">
                <span className={`text-[10px] uppercase tracking-[1px] mb-1 font-bold ${textAccentLabel}`}>
                  LOCATION
                </span>
                <span className={`text-[13px] font-semibold ${textPrimary}`}>
                  湖北 十堰
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className={`text-[10px] uppercase tracking-[1px] mb-1 font-bold ${textAccentLabel}`}>
                  BORN
                </span>
                <span className={`text-[13px] font-semibold ${textPrimary}`}>
                  2006 / 10
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className={`text-[10px] uppercase tracking-[1px] mb-1 font-bold ${textAccentLabel}`}>
                  MAJOR
                </span>
                <span className={`text-[13px] font-semibold truncate max-w-full ${textPrimary}`} title="计算机科学与技术">
                  计算机科学
                </span>
              </div>
            </div>

            {/* Email Contact - Interactive Link with Copy Action */}
            <div className="mb-10 flex flex-col items-center">
              <span className={`text-[9px] uppercase tracking-[2px] mb-2 font-bold ${textMuted}`}>
                CONTACT
              </span>
              <div className={`flex items-center gap-2 group backdrop-blur-md border rounded-full py-1.5 px-4 transition-all duration-500 ${contactBg}`}>
                <a
                  href={`mailto:${email}`}
                  className={`text-[13px] no-underline transition-colors font-mono tracking-wide font-medium ${contactLink}`}
                >
                  {email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className={`p-1 rounded-md transition-colors cursor-pointer active:scale-95 ${contactCopyBtn}`}
                  title="复制邮箱地址"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Matrix */}
            <div className="mb-8">
              <div className="flex justify-center gap-3">
                {/* Home */}
                <MagicalLink href="https://my.coox.one" timeOfDay={timeOfDay}>
                  <Home className="w-3.5 h-3.5" />
                  <span>HOME</span>
                </MagicalLink>

                {/* Blog */}
                <MagicalLink href="https://blog.coox.one" timeOfDay={timeOfDay}>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>BLOG</span>
                </MagicalLink>

                {/* GitHub */}
                <MagicalLink href="https://github.com/cotovo" timeOfDay={timeOfDay}>
                  <Github className="w-3.5 h-3.5" />
                  <span>GITHUB</span>
                </MagicalLink>
              </div>
            </div>

            {/* Footer / Toggle Camera focus button */}
            <div className={`pt-4 border-t flex items-center justify-between text-[11px] tracking-wider transition-all duration-500 ${footerBorder} ${textMuted}`}>
              <span>© {new Date().getFullYear()} kerntau</span>
              <button
                onClick={() => onFocusToggle(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer group ${focusBtnStyle}`}
              >
                <Compass className="w-3 h-3 group-hover:rotate-45 transition-transform duration-500" />
                <span>全景探索 3D</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="landscape-focus-mode"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={() => onFocusToggle(false)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FDFCF8]/95 backdrop-blur-md border border-white/50 text-accent-blue hover:bg-accent-blue hover:text-[#FDFCF8] hover:scale-105 active:scale-95 shadow-lg transition-all duration-300 cursor-pointer pointer-events-auto font-semibold tracking-wide mx-auto"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>返回个人面板</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
