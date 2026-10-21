import type { Rng } from "./rng";
import { neighbours, type Ship } from "./ship";

/** Probability an open cell catches fire this tick with k burning neighbours. */
export const ignitionProbability = (q: number, k: number) => 1 - (1 - q) ** k;

/** One tick of fire spread. Returns a new burning set; the input is not mutated. */
export function spreadFire(ship: Ship, burning: boolean[], q: number, rng: Rng): boolean[] {
  const next = burning.slice();
  for (let i = 0; i < burning.length; i++) {
    if (!ship.open[i] || burning[i]) continue;
    const k = neighbours(ship.size, i).filter((n) => burning[n]).length;
    if (k > 0 && rng() < ignitionProbability(q, k)) next[i] = true;
  }
  return next;
}
