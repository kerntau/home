import { motion, useReducedMotion } from "motion/react";

const DURATION = 3.6;
const EASE = [0.22, 1, 0.36, 1] as const;

function FloatingSparkle({ cx, cy, r, delay }: { cx: number; cy: number; r: number; delay: number }) {
  const reduceMotion = useReducedMotion() === true;
  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
      animate={
        reduceMotion
          ? { opacity: 0.8, scale: 1 }
          : {
              opacity: [0, 0, 0.9, 0.3, 0.9],
              scale: [0.5, 0.5, 1.3, 0.8, 1.2],
            }
      }
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
      <path
        d={`M ${cx} ${cy - r * 2.5} L ${cx} ${cy + r * 2.5} M ${cx - r * 2.5} ${cy} L ${cx + r * 2.5} ${cy}`}
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

export default function SignatureBackdrop() {
  const reduceMotion = useReducedMotion() === true;

  // Refined underline cursive swirl - much smoother and elegant
  const underlineStroke = "M 200 320 Q 460 380, 720 320 Q 820 300, 850 280";
  // A secondary swoosh to make it dynamic
  const underlineFlourish = "M 720 340 Q 800 370, 750 400 Q 680 430, 820 410";

  return (
    <div className="signature-scene relative flex items-center justify-center w-full max-w-4xl mx-auto py-2 select-none" aria-hidden="true">
      <motion.svg
        className="signature-art w-full h-auto overflow-visible"
        viewBox="0 0 940 450"
        role="presentation"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <defs>
          {/* Subtle Ambient Soft Glow */}
          <filter id="signature-glow" x="-20%" y="-30%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="text-glow" x="-20%" y="-30%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Gradient for the Text Stroke */}
          <linearGradient id="text-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Radial Gradient for Drawing Pen Tip */}
          <radialGradient id="pen-tip-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0EA5E9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- Phase 1: The Text Rendering --- */}
        <g transform="translate(470, 280)">
          {/* 1. Underlying Soft Glow for the text */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="240"
            textAnchor="middle"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="8"
            filter="url(#text-glow)"
            opacity="0.3"
            initial={reduceMotion ? false : { strokeDasharray: "2500 2500", strokeDashoffset: 2500 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            @kerntau
          </motion.text>

          {/* 2. Crisp Stroke Drawing */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="240"
            textAnchor="middle"
            fill="none"
            stroke="url(#text-stroke-gradient)"
            strokeWidth="3"
            initial={reduceMotion ? false : { strokeDasharray: "2500 2500", strokeDashoffset: 2500 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            @kerntau
          </motion.text>

          {/* 3. Solid Fill Fade-in (The Bloom) */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="240"
            textAnchor="middle"
            fill="#FFFFFF"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
          >
            @kerntau
          </motion.text>
        </g>

        {/* --- Phase 2: Embellishments (Underline) --- */}
        
        {/* Ambient Glow for Underline */}
        <g filter="url(#signature-glow)" opacity="0.45">
          <motion.path
            d={underlineStroke}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={1}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 1.2,
              delay: reduceMotion ? 0 : 1.8,
              ease: EASE,
            }}
          />
        </g>

        {/* Crisp Precision Foreground Strokes */}
        <g>
          {/* Underline Primary Sweep */}
          <motion.path
            d={underlineStroke}
            fill="none"
            stroke="url(#text-stroke-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 1.2,
              delay: reduceMotion ? 0 : 1.8,
              ease: EASE,
            }}
          />

          {/* Underline Fine Loop Flourish */}
          <motion.path
            d={underlineFlourish}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.6"
            strokeLinecap="round"
            pathLength={1}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              delay: reduceMotion ? 0 : 2.4,
              ease: EASE,
            }}
          />
        </g>

        {/* Active Pen-Tip Following Flare (笔尖流光跟随粒子) */}
        {/* Simplified to just follow the underline since font path measuring is complex */}
        {!reduceMotion && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 3.5, times: [0, 0.5, 0.55, 0.85, 0.9], ease: EASE }}
          >
            <motion.circle
              cx="0"
              cy="0"
              r="14"
              fill="url(#pen-tip-glow)"
              animate={{
                cx: [200, 460, 720, 850],
                cy: [320, 360, 320, 280],
              }}
              transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
            />
            <motion.circle
              cx="0"
              cy="0"
              r="2.5"
              fill="#FFFFFF"
              animate={{
                cx: [200, 460, 720, 850],
                cy: [320, 360, 320, 280],
              }}
              transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
            />
          </motion.g>
        )}

        {/* Decorative Four-Point Sparkle Stars */}
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 2.5, ease: EASE }}
        >
          <path
            d="M 160 160 C 165 180, 171 186, 191 191 C 171 196, 165 202, 160 222 C 155 202, 149 196, 129 191 C 149 186, 155 180, 160 160 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          />
          <path
            d="M 760 130 C 764 147, 770 152, 787 156 C 770 160, 764 165, 760 182 C 756 165, 750 160, 733 156 C 750 152, 756 147, 760 130 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          />
        </motion.g>

        {/* Ambient Twinkling Floating Particles */}
        <FloatingSparkle cx={260} cy={140} r={2.5} delay={2.6} />
        <FloatingSparkle cx={800} cy={220} r={2} delay={2.8} />
        <FloatingSparkle cx={380} cy={350} r={3} delay={3.0} />
        <FloatingSparkle cx={850} cy={380} r={2} delay={3.2} />
      </motion.svg>
    </div>
  );
}
