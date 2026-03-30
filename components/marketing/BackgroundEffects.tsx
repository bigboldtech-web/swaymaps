"use client";

import { useEffect, useRef } from "react";

// ─── Canvas animated dependency lines + node dots ───

interface CurveDef {
  x1: number;
  y1: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  x2: number;
  y2: number;
  speed: number;
  offset: number;
}

function generateCurves(count: number): CurveDef[] {
  const curves: CurveDef[] = [];
  for (let i = 0; i < count; i++) {
    const x1 = Math.random() * 100;
    const y1 = Math.random() * 100;
    const x2 = Math.random() * 100;
    const y2 = Math.random() * 100;
    curves.push({
      x1,
      y1,
      cx1: x1 + (Math.random() - 0.5) * 40,
      cy1: y1 + (Math.random() - 0.5) * 40,
      cx2: x2 + (Math.random() - 0.5) * 40,
      cy2: y2 + (Math.random() - 0.5) * 40,
      x2,
      y2,
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * 1000,
    });
  }
  return curves;
}

interface NodeDot {
  x: number;
  y: number;
  radius: number;
  pulse: number;
  speed: number;
}

function generateDots(count: number): NodeDot[] {
  const dots: NodeDot[] = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: 1.5 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    });
  }
  return dots;
}

function CanvasLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curvesRef = useRef<CurveDef[]>(generateCurves(12));
  const dotsRef = useRef<NodeDot[]>(generateDots(30));
  const scrollYRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onScroll() {
      scrollYRef.current = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const parallaxOffset = scrollYRef.current * 0.15;

      // Draw bezier curves with flowing dashes
      curvesRef.current.forEach((curve) => {
        const t = time * 0.001 * curve.speed + curve.offset;
        const dashOffset = t * 40;

        ctx.beginPath();
        ctx.moveTo(
          (curve.x1 / 100) * w,
          (curve.y1 / 100) * h + parallaxOffset
        );
        ctx.bezierCurveTo(
          (curve.cx1 / 100) * w,
          (curve.cy1 / 100) * h + parallaxOffset,
          (curve.cx2 / 100) * w,
          (curve.cy2 / 100) * h + parallaxOffset,
          (curve.x2 / 100) * w,
          (curve.y2 / 100) * h + parallaxOffset
        );
        ctx.strokeStyle = "rgba(0, 194, 255, 0.06)";
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 16]);
        ctx.lineDashOffset = -dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw node dots with pulse
      dotsRef.current.forEach((dot) => {
        const pulseScale =
          1 + 0.3 * Math.sin(time * 0.001 * dot.speed + dot.pulse);
        const r = dot.radius * pulseScale;
        const x = (dot.x / 100) * w;
        const y = (dot.y / 100) * h + parallaxOffset * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 194, 255, 0.12)";
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 194, 255, 0.25)";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

// ─── Grid layer (CSS) ───
function GridLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage:
          "linear-gradient(rgba(26,35,64,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,64,0.25) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
      aria-hidden="true"
    />
  );
}

// ─── Scan lines (CSS) ───
function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
      aria-hidden="true"
    />
  );
}

// ─── Ambient orbs ───
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Cyan orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          left: "10%",
          top: "20%",
          background: "radial-gradient(circle, rgba(0,194,255,0.06) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      {/* Indigo orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          right: "5%",
          top: "40%",
          background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite 2s",
        }}
      />
      {/* Pink orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          left: "40%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)",
          animation: "float 12s ease-in-out infinite 4s",
        }}
      />
    </div>
  );
}

// ─── Combined background effects ───
export default function BackgroundEffects() {
  return (
    <>
      <GridLayer />
      <CanvasLayer />
      <ScanLines />
      <AmbientOrbs />
    </>
  );
}
