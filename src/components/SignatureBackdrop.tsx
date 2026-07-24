import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

function FloatingSparkle({ cx, cy, r, delay }: { cx: number; cy: number; r: number; delay: number }) {
  const reduceMotion = useReducedMotion() === true;
  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
      animate={
        reduceMotion
          ? { opacity: 0.8, scale: 1 }
          : {
              opacity: [0, 0.2, 1, 0.3, 1],
              scale: [0.4, 0.4, 1.4, 0.7, 1.3],
              rotate: [0, 90, 180, 270, 360],
            }
      }
      transition={{
        duration: 3.5,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#7DD3FC" className="drop-shadow-[0_0_10px_#38BDF8]" />
      <path
        d={`M ${cx} ${cy - r * 3} L ${cx} ${cy + r * 3} M ${cx - r * 3} ${cy} L ${cx + r * 3} ${cy}`}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

export default function SignatureBackdrop() {
  const reduceMotion = useReducedMotion() === true;

  // Ultra-smooth single-curve calligraphy underline with natural flick
  const continuousUnderline = "M 160 340 C 360 385, 640 375, 860 315 Q 895 305, 925 295";

  return (
    <div className="signature-scene relative flex items-center justify-center w-full max-w-4xl mx-auto py-2 select-none" aria-hidden="true">
      <motion.svg
        className="signature-art w-full h-auto overflow-visible"
        viewBox="0 0 960 460"
        role="presentation"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <defs>
          {/* Deep Ambient Ice & Sky Glow */}
          <filter id="signature-glow" x="-30%" y="-40%" width="160%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="text-halo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="1.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pure Silver & Ice Blue Linear Gradients */}
          <linearGradient id="text-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#BAE6FD" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#7DD3FC" />
            <stop offset="80%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>

          {/* Pen Tip Ice Flare */}
          <radialGradient id="pen-tip-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#7DD3FC" stopOpacity="1" />
            <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- Phase 1: Signature Text Layering --- */}
        <g transform="translate(480, 275)">
          {/* Outer Ambient Sky Glow */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="245"
            textAnchor="middle"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="10"
            filter="url(#signature-glow)"
            opacity="0.35"
            initial={reduceMotion ? false : { strokeDasharray: "2600 2600", strokeDashoffset: 2600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            @kerntau
          </motion.text>

          {/* Inner Glow Core */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="245"
            textAnchor="middle"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="5"
            filter="url(#text-halo)"
            opacity="0.8"
            initial={reduceMotion ? false : { strokeDasharray: "2600 2600", strokeDashoffset: 2600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            @kerntau
          </motion.text>

          {/* Precision Gradient Stroke */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="245"
            textAnchor="middle"
            fill="none"
            stroke="url(#text-stroke-gradient)"
            strokeWidth="3.2"
            initial={reduceMotion ? false : { strokeDasharray: "2600 2600", strokeDashoffset: 2600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            @kerntau
          </motion.text>

          {/* Solid White Bloom Layer */}
          <motion.text
            fontFamily="Allura, cursive"
            fontSize="245"
            textAnchor="middle"
            fill="#FFFFFF"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.8, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 2px 10px rgba(255,255,255,0.4))" }}
          >
            @kerntau
          </motion.text>
        </g>

        {/* --- Phase 2: Sparkling Four-Point Stars & Floating Dust --- */}
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 2.2, ease: EASE }}
        >
          {/* Top Left Sparkle Star */}
          <path
            d="M 90 90 C 94 105, 100 110, 115 114 C 100 118, 94 123, 90 138 C 86 123, 80 118, 65 114 C 80 110, 86 105, 90 90 Z"
            fill="url(#underline-gradient)"
            className="drop-shadow-[0_0_12px_rgba(125,211,252,0.9)]"
          />
          {/* Top Right Sparkle Star */}
          <path
            d="M 780 120 C 785 138, 792 144, 810 149 C 792 154, 785 160, 780 178 C 775 160, 768 154, 750 149 C 768 144, 775 138, 780 120 Z"
            fill="url(#text-stroke-gradient)"
            className="drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]"
          />
        </motion.g>

        {/* Ambient Twinkling Floating Particles */}
        <FloatingSparkle cx={230} cy={135} r={2.5} delay={2.0} />
        <FloatingSparkle cx={830} cy={210} r={2.2} delay={2.2} />
        <FloatingSparkle cx={360} cy={380} r={3} delay={2.4} />
        <FloatingSparkle cx={880} cy={395} r={2} delay={2.6} />
        <FloatingSparkle cx={680} cy={140} r={2.4} delay={2.8} />

      </motion.svg>
    </div>
  );
}

