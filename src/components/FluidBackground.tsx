"use client";

import { useEffect, useRef } from "react";

// A live backdrop on one 2D canvas: drifting colour glows, faint waves, a
// particle network that links up near the pointer, and slowly turning
// wireframe solids. Static under reduced motion; the browser pauses it in
// background tabs.

type V3 = [number, number, number];
type Solid = { verts: V3[]; edges: [number, number][] };

const PHI = (1 + Math.sqrt(5)) / 2;

/** Every pair of vertices exactly `len` apart becomes an edge. */
const edgesAt = (verts: V3[], len: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) {
      const d = Math.hypot(verts[i][0] - verts[j][0], verts[i][1] - verts[j][1], verts[i][2] - verts[j][2]);
      if (Math.abs(d - len) < 1e-3) out.push([i, j]);
    }
  return out;
};

const icosahedron = (): Solid => {
  const v: V3[] = [];
  for (const a of [-1, 1]) for (const b of [-PHI, PHI]) v.push([0, a, b], [a, b, 0], [b, 0, a]);
  return { verts: v, edges: edgesAt(v, 2) };
};

const box = (sy: number): Solid => {
  const v: V3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z]);
  return { verts: v.map(([x, y, z]) => [x, y * sy, z] as V3), edges: edgesAt(v, 2) };
};

const octahedron = (): Solid => {
  const v: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  return { verts: v, edges: edgesAt(v, Math.SQRT2) };
};

// Where each solid sits, as a fraction of the viewport, and how it turns.
const shapes = [
  { solid: icosahedron(), x: 0.91, y: 0.22, size: 0.026, spin: [0.0021, 0.0033], color: 0 },
  { solid: box(0.28), x: 0.06, y: 0.74, size: 0.032, spin: [0.0012, 0.0026], color: 1 },
  { solid: octahedron(), x: 0.86, y: 0.84, size: 0.03, spin: [0.003, 0.0018], color: 2 },
];

// Teal, violet, sky: bright on the dark theme, deepened on the light one.
const palettes = {
  dark: { hues: ["45,212,191", "167,139,250", "56,189,248"], line: "56,189,248", dot: "rgba(125,211,252,0.5)", strength: 1 },
  light: { hues: ["15,118,110", "109,40,217", "3,105,161"], line: "3,105,161", dot: "rgba(3,105,161,0.35)", strength: 1.25 },
};

const glows = [
  { x: 0.85, y: 0.15, r: 0.55, color: 2, a: 0.14, sx: 0.00021, sy: 0.00017 },
  { x: 0.1, y: 0.8, r: 0.5, color: 1, a: 0.12, sx: 0.00015, sy: 0.00023 },
  { x: 0.5, y: 0.45, r: 0.4, color: 0, a: 0.06, sx: 0.00011, sy: 0.00013 },
];

export function FluidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let frame = 0;
    // t counts 60 Hz ticks, so speed is the same on 60 and 120 Hz screens.
    let t = 0;
    let step = 1;
    let last = 0;
    const pointer = { x: -9999, y: -9999 };

    // Seeded so the layout is the same on every visit.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];
    const LINK = 130;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 7;
      // Fewer points on small screens keeps phones cool and text clear.
      const count = Math.round(Math.min(70, Math.max(24, (w * h) / 22000)));
      particles = Array.from({ length: count }, () => ({
        x: rand() * w,
        y: rand() * h,
        vx: (rand() - 0.5) * 0.25,
        vy: (rand() - 0.5) * 0.25,
        r: rand() * 1.2 + 0.6,
      }));
    };

    let pal = palettes.dark;

    const drawGlows = () => {
      const m = Math.max(w, h);
      for (const g of glows) {
        const x = (g.x + Math.sin(t * g.sx * 60) * 0.06) * w;
        const y = (g.y + Math.cos(t * g.sy * 60) * 0.06) * h;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, g.r * m);
        grad.addColorStop(0, `rgba(${pal.hues[g.color]},${g.a * (pal === palettes.light ? 0.7 : 1)})`);
        grad.addColorStop(1, `rgba(${pal.hues[g.color]},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const drawWaves = () => {
      ctx.lineWidth = 1;
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = `rgba(${pal.line},${(0.05 - k * 0.012) * pal.strength})`;
        ctx.beginPath();
        const base = h * (0.3 + k * 0.22);
        for (let x = 0; x <= w; x += 16) {
          const y = base + Math.sin(x * 0.004 + t * 0.006 + k * 1.7) * 40 + Math.sin(x * 0.0013 - t * 0.004 + k) * 26;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawNetwork = () => {
      for (const p of particles) {
        if (!still) {
          p.x += p.vx * step;
          p.y += p.vy * step;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
          // Points drift gently toward the pointer.
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) {
            p.x += (dx / d) * 0.25 * step;
            p.y += (dy / d) * 0.25 * step;
          }
        }
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${pal.line},${0.16 * pal.strength * (1 - d / LINK)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < 180) {
          ctx.strokeStyle = `rgba(${pal.hues[0]},${0.28 * pal.strength * (1 - dp / 180)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
        ctx.fillStyle = pal.dot;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawSolids = () => {
      const small = w < 640;
      for (const s of shapes) {
        const size = Math.max(28, s.size * Math.max(w, 900)) * (small ? 0.7 : 1);
        const cx = s.x * w;
        const cy = s.y * h + Math.sin(t * 0.01 + s.x * 10) * 8;
        const ax = t * s.spin[0] + s.x * 3;
        const ay = t * s.spin[1] + s.y * 3;
        const [sa, ca, sb, cb] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay)];
        const pts = s.solid.verts.map(([x, y, z]) => {
          // Rotate around y, then x, then a soft perspective.
          const x1 = x * cb + z * sb;
          const z1 = -x * sb + z * cb;
          const y1 = y * ca - z1 * sa;
          const z2 = y * sa + z1 * ca;
          const f = 4 / (4 + z2);
          return [cx + x1 * size * f, cy + y1 * size * f, z2] as const;
        });
        ctx.lineWidth = 1;
        for (const [i, j] of s.solid.edges) {
          const depth = (pts[i][2] + pts[j][2]) / 2;
          const alpha = (small ? 0.18 : 0.3) * (0.55 + 0.45 * (1 - (depth + PHI) / (2 * PHI)));
          ctx.strokeStyle = `rgba(${pal.hues[s.color]},${alpha * pal.strength})`;
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
        // Soft halo behind each solid.
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.2);
        halo.addColorStop(0, `rgba(${pal.hues[s.color]},0.07)`);
        halo.addColorStop(1, `rgba(${pal.hues[s.color]},0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(cx - size * 2.2, cy - size * 2.2, size * 4.4, size * 4.4);
      }
    };

    const draw = () => {
      pal = document.documentElement.dataset.theme === "light" ? palettes.light : palettes.dark;
      ctx.clearRect(0, 0, w, h);
      drawGlows();
      drawWaves();
      drawNetwork();
      drawSolids();
    };

    const loop = (now: number) => {
      step = last ? Math.min(3, (now - last) / (1000 / 60)) : 1;
      last = now;
      t += step;
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      init();
      if (still) draw();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    init();
    // Start animating once the page has loaded and the browser is idle, so the
    // backdrop never competes with the first paint.
    let idle = 0;
    const start = () => {
      if (still) draw();
      else frame = requestAnimationFrame(loop);
    };
    const whenIdle = () => {
      idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    const onTheme = () => {
      if (still) draw();
    };
    window.addEventListener("themechange", onTheme);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("load", whenIdle);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
