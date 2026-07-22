import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
} from "react";

const SPRITESHEET = "/pets/yuexinmiao/spritesheet.webp";
const COLUMNS = 8;
const ROWS = 9;

type PetAction =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "sleeping"
  | "celebrating"
  | "listening"
  | "chiming";

interface ActionDefinition {
  row: number;
  durations: number[];
  loop: boolean;
}

const ACTIONS: Record<PetAction, ActionDefinition> = {
  idle: { row: 0, durations: [520, 120, 120, 180, 140, 720], loop: true },
  "running-right": { row: 1, durations: [105, 105, 115, 105, 105, 115, 120, 145], loop: true },
  "running-left": { row: 2, durations: [105, 105, 115, 105, 105, 115, 120, 145], loop: true },
  waving: { row: 3, durations: [130, 140, 170, 430], loop: false },
  jumping: { row: 4, durations: [110, 130, 150, 190, 320], loop: false },
  sleeping: { row: 5, durations: [250, 260, 300, 850, 650, 700, 420, 300], loop: true },
  celebrating: { row: 6, durations: [130, 130, 160, 130, 150, 390], loop: false },
  listening: { row: 7, durations: [160, 170, 170, 180, 190, 400], loop: false },
  chiming: { row: 8, durations: [120, 130, 140, 150, 170, 360], loop: false },
};

export interface PetReaction {
  id: number;
  type: "chime" | "copied" | "theme";
}

function actionDuration(action: PetAction) {
  return ACTIONS[action].durations.reduce((total, duration) => total + duration, 0);
}

function petWidth() {
  return Math.min(94, Math.max(68, window.innerWidth * 0.078));
}

function restPosition(section: string) {
  const gutter = window.innerWidth < 640 ? 12 : 20;
  const max = window.innerWidth - petWidth() - gutter;
  if (window.innerWidth < 720) return max;

  const offsets: Record<string, number> = {
    intro: 0,
    about: 136,
    writing: 42,
    projects: 178,
    sites: 78,
    log: 0,
  };
  return Math.max(gutter, max - (offsets[section] ?? 0));
}

export default function PetCompanion({
  activeSection,
  reaction,
}: {
  activeSection: string;
  reaction: PetReaction | null;
}) {
  const reduceMotion = useReducedMotion() === true;
  const [action, setAction] = useState<PetAction>("idle");
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(reduceMotion);
  const [travelX, setTravelX] = useState(() => restPosition("intro"));
  const petRef = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<PetAction>("idle");
  const actionTimer = useRef<number | null>(null);
  const sleepTimer = useRef<number | null>(null);
  const movementTimer = useRef<number | null>(null);
  const travelRef = useRef(travelX);

  const clearTimer = (timer: MutableRefObject<number | null>) => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const setCurrentAction = useCallback((next: PetAction) => {
    actionRef.current = next;
    setFrame(0);
    setAction(next);
  }, []);

  const playAction = useCallback((next: PetAction, returnDelay = 1200) => {
    if (reduceMotion) return;
    clearTimer(actionTimer);
    setCurrentAction(next);
    actionTimer.current = window.setTimeout(() => {
      setCurrentAction("idle");
      actionTimer.current = null;
    }, actionDuration(next) + returnDelay);
  }, [reduceMotion, setCurrentAction]);

  const scheduleSleep = useCallback(() => {
    clearTimer(sleepTimer);
    if (reduceMotion) return;
    sleepTimer.current = window.setTimeout(() => {
      if (actionRef.current === "idle") setCurrentAction("sleeping");
    }, 18000);
  }, [reduceMotion, setCurrentAction]);

  useEffect(() => {
    actionRef.current = action;
    const definition = ACTIONS[action];
    const duration = definition.durations[Math.min(frame, definition.durations.length - 1)];
    if (reduceMotion || (!definition.loop && frame >= definition.durations.length - 1)) return;

    const timer = window.setTimeout(() => {
      setFrame((current) => {
        const next = current + 1;
        return next < definition.durations.length ? next : 0;
      });
    }, duration);
    return () => window.clearTimeout(timer);
  }, [action, frame, reduceMotion]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
      if (!reduceMotion) playAction("waving", 900);
      scheduleSleep();
    }, reduceMotion ? 0 : 2250);
    return () => window.clearTimeout(timer);
  }, [playAction, reduceMotion, scheduleSleep]);

  useLayoutEffect(() => {
    const update = () => {
      const next = restPosition(activeSection);
      travelRef.current = next;
      setTravelX(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeSection]);

  useEffect(() => {
    if (!visible || reduceMotion) return;
    const next = restPosition(activeSection);
    const current = travelRef.current;
    if (Math.abs(next - current) < 12) return;

    clearTimer(movementTimer);
    clearTimer(actionTimer);
    setCurrentAction(next > current ? "running-right" : "running-left");
    travelRef.current = next;
    setTravelX(next);
    movementTimer.current = window.setTimeout(() => {
      setCurrentAction("idle");
      scheduleSleep();
    }, 1150);
  }, [activeSection, reduceMotion, scheduleSleep, setCurrentAction, visible]);

  useEffect(() => {
    if (!reaction || reduceMotion) return;
    const nextAction: Record<PetReaction["type"], PetAction> = {
      chime: "chiming",
      copied: "celebrating",
      theme: "listening",
    };
    playAction(nextAction[reaction.type], 1000);
    scheduleSleep();
  }, [playAction, reaction, reduceMotion, scheduleSleep]);

  useEffect(() => {
    const handleActivity = () => {
      if (actionRef.current === "sleeping") playAction("waving", 700);
      scheduleSleep();
    };
    window.addEventListener("pointerdown", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    scheduleSleep();
    return () => {
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearTimer(sleepTimer);
    };
  }, [playAction, scheduleSleep]);

  useEffect(() => () => {
    clearTimer(actionTimer);
    clearTimer(movementTimer);
    clearTimer(sleepTimer);
  }, []);

  const definition = ACTIONS[action];
  const visibleFrame = Math.min(frame, definition.durations.length - 1);
  const x = (visibleFrame / (COLUMNS - 1)) * 100;
  const y = (definition.row / (ROWS - 1)) * 100;
  const running = action === "running-left" || action === "running-right";

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "touch") playAction("waving", 700);
  };

  return (
    <div className="pet-layer" aria-live="polite">
      <motion.button
        ref={petRef}
        type="button"
        className="pet-companion"
        aria-label="和月薪喵打招呼"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? travelX : window.innerWidth + 40,
          y: action === "jumping" && !reduceMotion ? [0, -18, -26, -10, 0] : running && !reduceMotion ? [0, 1, -1, 0] : 0,
          rotate: running && !reduceMotion ? (action === "running-right" ? [0, 1.5, -1, 0] : [0, -1.5, 1, 0]) : 0,
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.035 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={{
          opacity: { duration: reduceMotion ? 0 : 0.32 },
          x: { type: "spring", stiffness: 92, damping: 19, mass: 0.9 },
          y: { duration: action === "jumping" ? 0.72 : 0.42, repeat: running ? Infinity : 0, ease: "easeInOut" },
          rotate: { duration: 0.42, repeat: running ? Infinity : 0, ease: "easeInOut" },
          scale: { duration: 0.18 },
        }}
        onPointerEnter={handlePointerEnter}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) playAction("waving", 700);
        }}
        onClick={() => {
          playAction("jumping", 900);
          scheduleSleep();
        }}
        style={{
          backgroundImage: `url(${SPRITESHEET})`,
          backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
          backgroundPosition: `${x}% ${y}%`,
        }}
      />
    </div>
  );
}
