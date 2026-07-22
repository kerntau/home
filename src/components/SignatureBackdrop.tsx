import { motion, useReducedMotion } from "motion/react";

const DURATION = 11;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function SignatureBackdrop() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className="signature-scene" aria-hidden="true">
      <div className="signature-grid" />
      <motion.svg
        className="signature-art"
        viewBox="0 0 920 520"
        role="presentation"
        initial={false}
        animate={reduceMotion ? { opacity: 0.72 } : { opacity: [0, 1, 1] }}
        transition={{
          duration: reduceMotion ? 0 : DURATION,
          times: [0, 0.06, 1],
          ease: EASE,
        }}
      >
        <defs>
          <filter id="signature-soft-glow" x="-35%" y="-45%" width="170%" height="190%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="signature-reveal" maskUnits="userSpaceOnUse">
            <motion.path
              d="M 58 298 C 218 212, 352 222, 486 250 C 640 282, 742 212, 872 180"
              fill="none"
              stroke="white"
              strokeWidth="255"
              strokeLinecap="round"
              pathLength={1}
              initial={false}
              animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 1, 1] }}
              transition={{
                duration: reduceMotion ? 0 : DURATION,
                times: [0, 0.24, 1],
                ease: EASE,
              }}
            />
          </mask>
        </defs>

        <g mask="url(#signature-reveal)">
          <text
            x="460"
            y="306"
            textAnchor="middle"
            className="signature-word signature-word-glow"
            filter="url(#signature-soft-glow)"
          >
            @kerntau
          </text>
          <text x="460" y="306" textAnchor="middle" className="signature-word">
            @kerntau
          </text>
        </g>

        <motion.g
          initial={false}
          animate={reduceMotion ? { y: 0 } : { y: [0, 0, 7, -2, 0] }}
          transition={{
            duration: reduceMotion ? 0 : DURATION,
            times: [0, 0.31, 0.345, 0.38, 1],
            ease: EASE,
          }}
        >
          <motion.path
            d="M 172 386 C 318 330, 505 352, 708 328 C 780 320, 832 306, 874 286"
            className="signature-stroke signature-stroke-glow"
            filter="url(#signature-soft-glow)"
            pathLength={1}
            initial={false}
            animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: reduceMotion ? 0 : DURATION,
              times: [0, 0.23, 0.34, 1],
              ease: EASE,
            }}
          />
          <motion.path
            d="M 642 366 C 706 337, 760 338, 801 345 C 761 354, 728 369, 719 383 C 710 396, 739 396, 774 385"
            className="signature-stroke signature-stroke-fine"
            pathLength={1}
            initial={false}
            animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: reduceMotion ? 0 : DURATION,
              times: [0, 0.3, 0.39, 1],
              ease: EASE,
            }}
          />
        </motion.g>

        <motion.g
          initial={false}
          animate={reduceMotion ? { opacity: 0.78, scale: 1 } : { opacity: [0, 0, 1, 0.78], scale: [0.8, 0.8, 1, 1] }}
          transition={{
            duration: reduceMotion ? 0 : DURATION,
            times: [0, 0.33, 0.39, 1],
            ease: EASE,
          }}
          style={{ transformOrigin: "center" }}
        >
          <path d="M 112 152 C 117 178, 125 186, 151 191 C 125 196, 117 204, 112 230 C 107 204, 99 196, 73 191 C 99 186, 107 178, 112 152 Z" className="signature-spark" />
          <path d="M 817 128 C 821 148, 827 154, 847 158 C 827 162, 821 168, 817 188 C 813 168, 807 162, 787 158 C 807 154, 813 148, 817 128 Z" className="signature-spark" />
          <circle cx="121" cy="379" r="5" className="signature-dot" />
        </motion.g>
      </motion.svg>

      <div className="signature-index">
        <span>SPACE / 001</span>
        <span>EST. 2025</span>
      </div>
    </div>
  );
}
