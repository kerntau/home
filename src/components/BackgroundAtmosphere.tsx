import { useEffect, useRef } from "react";

type ThemeMode = "light" | "dark";

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  depth: number;
}

export default function BackgroundAtmosphere({ theme }: { theme: ThemeMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, targetX: 0 };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    let previous = 0;
    let drops: Drop[] = [];

    const createDrops = () => {
      const count = Math.min(width < 768 ? 34 : 62, Math.floor(width / 18));
      drops = Array.from({ length: count }, (_, index) => {
        const depth = 0.35 + (index % 3) * 0.3;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          length: 10 + depth * 20 + Math.random() * 8,
          speed: 38 + depth * 54 + Math.random() * 20,
          opacity: 0.018 + depth * 0.035,
          depth,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDrops();
    };

    const draw = (time: number) => {
      frameId = window.requestAnimationFrame(draw);
      if (document.hidden || motionQuery.matches) return;

      const delta = previous ? Math.min((time - previous) / 1000, 0.04) : 0.016;
      previous = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      context.clearRect(0, 0, width, height);

      const rgb = themeRef.current === "dark" ? "225,232,241" : "23,31,42";
      for (const drop of drops) {
        const slant = 4 + drop.depth * 7;
        context.beginPath();
        context.moveTo(drop.x + pointer.x * drop.depth, drop.y);
        context.lineTo(drop.x + slant + pointer.x * drop.depth, drop.y + drop.length);
        context.strokeStyle = `rgba(${rgb},${drop.opacity})`;
        context.lineWidth = 0.6 + drop.depth * 0.55;
        context.stroke();

        drop.y += drop.speed * delta;
        drop.x += 4 * drop.depth * delta;
        if (drop.y > height + drop.length) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }
    };

    const handlePointer = (event: PointerEvent) => {
      pointer.targetX = ((event.clientX / Math.max(width, 1)) - 0.5) * 8;
    };
    const handleMotion = () => {
      if (motionQuery.matches) context.clearRect(0, 0, width, height);
      previous = 0;
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    motionQuery.addEventListener("change", handleMotion);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      motionQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="atmosphere" aria-hidden="true" />;
}
