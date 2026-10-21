import { neighbours, type Ship } from "./ship";

export type Strategy = "plan-once" | "risk-aware";

/** Multi-source BFS distance from every open cell to the nearest burning cell. */
export function distanceToFire(ship: Ship, burning: boolean[]): number[] {
  const dist = new Array<number>(burning.length).fill(Infinity);
  const queue: number[] = [];
  burning.forEach((b, i) => {
    if (b) {
      dist[i] = 0;
      queue.push(i);
    }
  });
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head];
    for (const n of neighbours(ship.size, cell)) {
      if (ship.open[n] && dist[n] === Infinity) {
        dist[n] = dist[cell] + 1;
        queue.push(n);
      }
    }
  }
  return dist;
}

/**
 * Cost of stepping onto a cell. Plan-once ignores fire entirely (Bot 1).
 * Risk-aware treats fire as a cost, not a wall (Bot 4): cells near the fire
 * get expensive, scaled by flammability, so the bot trades path length
 * against the chance of getting caught.
 */
function stepCost(strategy: Strategy, fireDist: number, q: number): number {
  if (strategy === "plan-once") return 1;
  if (fireDist === Infinity) return 1;
  return 1 + 40 * q * Math.exp(-(fireDist - 1) / 1.5);
}

/** Dijkstra from start to goal. Returns the path excluding start, or null. */
export function planPath(
  ship: Ship,
  burning: boolean[],
  start: number,
  goal: number,
  strategy: Strategy,
  q: number,
): number[] | null {
  const n = ship.open.length;
  const fireDist = strategy === "risk-aware" ? distanceToFire(ship, burning) : null;
  const best = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  const done = new Array<boolean>(n).fill(false);
  best[start] = 0;

  // Grids here are ~600 cells, so a linear-scan priority queue is fast enough.
  for (;;) {
    let cell = -1;
    for (let i = 0; i < n; i++) if (!done[i] && best[i] < Infinity && (cell < 0 || best[i] < best[cell])) cell = i;
    if (cell < 0) return null;
    if (cell === goal) break;
    done[cell] = true;
    for (const next of neighbours(ship.size, cell)) {
      if (!ship.open[next] || done[next]) continue;
      if (strategy === "risk-aware" && burning[next]) continue;
      const cost = best[cell] + stepCost(strategy, fireDist ? fireDist[next] : Infinity, q);
      if (cost < best[next]) {
        best[next] = cost;
        prev[next] = cell;
      }
    }
  }

  const path: number[] = [];
  for (let c = goal; c !== start; c = prev[c]) path.push(c);
  return path.reverse();
}
