import {
  ArrowDown,
  Check,
  Github,
  Mail,
  Menu,
  MonitorPlay,
  Music2,
  Moon,
  Sun,
  Wind,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import BackgroundAtmosphere from "./components/BackgroundAtmosphere";
import PetCompanion, { type PetReaction } from "./components/PetCompanion";
import SignatureBackdrop from "./components/SignatureBackdrop";
import SiteSections from "./components/SiteSections";

type ThemeMode = "light" | "dark";

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL = "kerntau@outlook.com";
const YEAR = new Date().getFullYear();
const SECTION_IDS = ["intro", "about", "projects", "log"];
const NAV_ITEMS = [
  { label: "关于", href: "#about", id: "about" },
  { label: "项目", href: "#projects", id: "projects" },
  { label: "记录", href: "#log", id: "log" },
];
const BANNERS = [
  { prefix: "新域名 ", label: "coox.one", href: "https://coox.one", suffix: " 已上线" },
  { prefix: "知识库现已迁移至 ", label: "kb.cot.wiki", href: "https://kb.cot.wiki", suffix: "" },
];

const heroReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

let sharedAudioContext: AudioContext | null = null;

function playWindChime() {
  try {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    if (!sharedAudioContext || sharedAudioContext.state === "closed") sharedAudioContext = new AudioContextConstructor();
    if (sharedAudioContext.state === "suspended") void sharedAudioContext.resume();

    const context = sharedAudioContext;
    const now = context.currentTime;
    const notes = [659.25, 783.99, 987.77];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now + index * 0.07);
      gain.gain.linearRampToValueAtTime(0.08 - index * 0.012, now + 0.035 + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15 + index * 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + index * 0.07);
      oscillator.stop(now + 1.35 + index * 0.18);
    });
  } catch {
    // Audio is an optional ambient interaction.
  }
}

function fallbackCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function Uptime() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = new Date("2025-11-10T00:00:00").getTime();
    const update = () => {
      if (!ref.current) return;
      const difference = Date.now() - start;
      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference % 86400000) / 3600000);
      ref.current.textContent = `${days} DAYS / ${String(hours).padStart(2, "0")} HRS`;
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return <span ref={ref} />;
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [toast, setToast] = useState<"copied" | "error" | null>(null);
  const [themePulse, setThemePulse] = useState(0);
  const [petReaction, setPetReaction] = useState<PetReaction | null>(null);
  const [showBanner, setShowBanner] = useState(() => sessionStorage.getItem("space-banner-dismissed-v3") !== "1");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerPaused, setBannerPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const activeSection = useActiveSection();
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll();

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0B0F14" : "#F7F9FC");
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  useEffect(() => {
    if (!showBanner || bannerPaused) return;
    const timer = window.setInterval(() => {
      setBannerIndex((index) => (index + 1) % BANNERS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [bannerPaused, showBanner]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const triggerPet = useCallback((type: PetReaction["type"]) => {
    setPetReaction((current) => ({ id: (current?.id ?? 0) + 1, type }));
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    setTheme(next);
    setThemePulse((value) => value + 1);
    triggerPet("theme");
  };

  const handleChime = () => {
    playWindChime();
    triggerPet("chime");
  };

  const dismissBanner = () => {
    sessionStorage.setItem("space-banner-dismissed-v3", "1");
    setShowBanner(false);
  };

  const handleCopy = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      copied = true;
    } catch {
      copied = fallbackCopy(EMAIL);
    }

    setToast(copied ? "copied" : "error");
    triggerPet(copied ? "copied" : "error");
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const ThemeIcon = theme === "light" ? Moon : Sun;

  return (
    <MotionConfig reducedMotion="user">
      <main className="site-root" aria-label="kerntau 个人主页">
        <a className="skip-link" href="#content">跳到主要内容</a>
        <BackgroundAtmosphere theme={theme} />

        <AnimatePresence>
          {themePulse > 0 && !reduceMotion && (
            <motion.div
              key={themePulse}
              className="theme-pulse"
              initial={{ opacity: 0.34, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.62, ease: EASE }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <header className="topbar">
          <div className="topbar-inner">
            <a href="#intro" className="brand-mark" aria-label="返回顶部">
              SPACE / 001
            </a>
            <nav className="topnav" aria-label="页面导航">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={activeSection === item.id ? "is-active" : ""}
                  aria-current={activeSection === item.id ? "location" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              className="icon-button menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="icon-button theme-button"
              onClick={toggleTheme}
              aria-label={`切换到${theme === "light" ? "深色" : "浅色"}主题`}
            >
              <ThemeIcon aria-hidden="true" />
            </button>
          </div>
          <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-navigation"
              aria-label="移动端页面导航"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: EASE }}
            >
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={activeSection === item.id ? "is-active" : ""}
                  aria-current={activeSection === item.id ? "location" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <section id="intro" className="hero" aria-labelledby="hero-title">
          <AnimatePresence>
            {showBanner && (
              <motion.aside
                className="notice-banner"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
                onPointerEnter={() => setBannerPaused(true)}
                onPointerLeave={() => setBannerPaused(false)}
                onFocusCapture={() => setBannerPaused(true)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setBannerPaused(false);
                }}
              >
                <span className="notice-label">NOTICE</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={bannerIndex}
                    initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.22 }}
                  >
                    {BANNERS[bannerIndex].prefix}
                    <a href={BANNERS[bannerIndex].href} target="_blank" rel="noopener noreferrer">
                      {BANNERS[bannerIndex].label}
                    </a>
                    {BANNERS[bannerIndex].suffix}
                  </motion.p>
                </AnimatePresence>
                <button type="button" onClick={dismissBanner} aria-label="关闭站点横幅">
                  <X aria-hidden="true" />
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          <motion.div
            className="hero-inner"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.09, delayChildren: reduceMotion ? 0 : 0.16 }}
          >
            <div className="hero-copy">
              <motion.div variants={heroReveal} className="hero-kicker">
                <span className="status-dot" />
                <span>PERSONAL SPACE / ONLINE</span>
              </motion.div>
              <motion.h1 variants={heroReveal} id="hero-title">kerntau</motion.h1>
              <motion.p variants={heroReveal} className="hero-role">Security researcher &amp; frontend builder</motion.p>
              <motion.p variants={heroReveal} className="hero-intro">
                用代码理解系统，用文字保存过程。这里连接我的知识、作品与仍在发生的生活。
              </motion.p>
              <motion.div variants={heroReveal} className="contact-rail" aria-label="联系方式">
                <button type="button" onClick={handleCopy} aria-label={`复制邮箱地址 ${EMAIL}`}>
                  {toast === "copied" ? <Check aria-hidden="true" /> : <Mail aria-hidden="true" />}
                  <span>{toast === "copied" ? "已复制" : "Email"}</span>
                </button>
                <a href="https://github.com/kerntau" target="_blank" rel="noopener noreferrer" aria-label="打开 GitHub 主页，新窗口">
                  <Github aria-hidden="true" /><span>GitHub</span>
                </a>
                <a href="https://space.bilibili.com/9655855" target="_blank" rel="noopener noreferrer" aria-label="打开 Bilibili 主页，新窗口">
                  <MonitorPlay aria-hidden="true" /><span>Bilibili</span>
                </a>
                <a href="https://v.douyin.com/HWMgjLaTtFk" target="_blank" rel="noopener noreferrer" aria-label="打开 Douyin 主页，新窗口">
                  <Music2 aria-hidden="true" /><span>Douyin</span>
                </a>
              </motion.div>
            </div>

            <motion.div variants={heroReveal} className="hero-visual">
              <div className="signature-avatar">
                <div className="avatar-frame">
                  {avatarFailed ? <span>K</span> : (
                    <img
                      src="/avatar.png"
                      alt="kerntau"
                      width="64"
                      height="64"
                      onLoad={() => setAvatarLoaded(true)}
                      onError={() => setAvatarFailed(true)}
                      className={avatarLoaded ? "is-loaded" : ""}
                    />
                  )}
                </div>
              </div>
              <SignatureBackdrop />
            </motion.div>
          </motion.div>

          <motion.a
            href="#about"
            className="scroll-cue"
            aria-label="继续浏览"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 2.1, duration: 0.4 }}
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown aria-hidden="true" />
          </motion.a>
        </section>

        <SiteSections />

        <footer className="site-footer">
          <span className="footer-end">END / KEEP BUILDING</span>
          <div className="footer-meta">
            <button type="button" className="chime-control" onClick={handleChime}>
              <Wind aria-hidden="true" /> 轻抚风铃
            </button>
            <span>© {YEAR} KERNTAU</span>
            <span>运行 <Uptime /></span>
          </div>
        </footer>

        <PetCompanion activeSection={activeSection} reaction={petReaction} />

        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              role={toast === "error" ? "alert" : "status"}
              aria-live={toast === "error" ? "assertive" : "polite"}
              initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.96 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: -8, x: "-50%", scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {toast === "copied" ? "邮箱已复制" : `复制失败：${EMAIL}`}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
