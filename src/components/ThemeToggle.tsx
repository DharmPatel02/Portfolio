"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const subscribe = (onChange: () => void) => {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
};

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Light/dark switch. The choice is saved; the first visit follows the system setting. */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);
  const next: Theme = theme === "light" ? "dark" : "light";

  const toggle = () => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) {
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 400);
    }
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode: the choice just won't be remembered.
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="nav-shadow fixed bottom-4 right-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-line bg-deck/70 text-hull backdrop-blur-2xl transition-colors hover:border-accent hover:text-accent-ink lg:bottom-auto lg:right-8 lg:top-10"
    >
      {theme === "light" ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
