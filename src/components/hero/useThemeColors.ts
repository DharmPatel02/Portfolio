"use client";

import { useSyncExternalStore } from "react";

export interface SceneColors {
  deck: string;
  hull: string;
  wall: string;
  floor: string;
  plate: string;
  signal: string;
  signalInk: string;
  ember: string;
  amber: string;
}

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("themechange", onChange);
  };
};

// useSyncExternalStore needs a stable snapshot, so cache by the joined values.
let cacheKey = "";
let cache: SceneColors | null = null;

const read = (): SceneColors => {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const next: SceneColors = {
    deck: v("--deck"),
    hull: v("--hull"),
    wall: v("--wall"),
    floor: v("--floor"),
    plate: v("--plate"),
    signal: v("--signal"),
    signalInk: v("--signal-ink"),
    ember: v("--ember"),
    amber: v("--amber"),
  };
  const key = Object.values(next).join();
  if (key !== cacheKey) {
    cacheKey = key;
    cache = next;
  }
  return cache!;
};

/** Scene colours follow the CSS tokens, including theme switches. */
export function useThemeColors(): SceneColors | null {
  return useSyncExternalStore<SceneColors | null>(subscribe, read, () => null);
}
