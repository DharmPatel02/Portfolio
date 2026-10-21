"use client";

import { useEffect, useRef } from "react";
import type { SceneProps } from "./ShipScene";

/** Flat top-down version for browsers without WebGL. Same state, same clicks. */
export default function ShipFallback2D({ state, colors, onCellClick }: Omit<SceneProps, "animate">) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { size } = state.ship;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const px = canvas.clientWidth;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.height = px * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cell = px / size;
    const path = new Set(state.path);

    for (let i = 0; i < size * size; i++) {
      const x = (i % size) * cell;
      const y = Math.floor(i / size) * cell;
      let fill = state.ship.open[i] ? colors.floor : colors.wall;
      if (state.burning[i]) fill = colors.ember;
      ctx.fillStyle = fill;
      ctx.fillRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
      if (path.has(i) && i !== state.button && !state.burning[i]) {
        ctx.fillStyle = colors.signal;
        ctx.fillRect(x + cell * 0.38, y + cell * 0.38, cell * 0.24, cell * 0.24);
      }
    }
    const dot = (i: number, color: string, r: number) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc((i % size + 0.5) * cell, (Math.floor(i / size) + 0.5) * cell, cell * r, 0, Math.PI * 2);
      ctx.fill();
    };
    dot(state.button, colors.hull, 0.4);
    dot(state.button, colors.signal, 0.22);
    dot(state.bot, colors.signal, 0.36);
  }, [state, colors, size]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * size);
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * size);
    onCellClick(row * size + col);
  };

  return (
    <canvas
      ref={ref}
      onClick={onClick}
      aria-hidden="true"
      className="mx-auto block aspect-square w-full max-w-[520px] cursor-crosshair"
    />
  );
}
