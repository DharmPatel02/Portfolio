import { describe, expect, it } from "vitest";
import { distanceToFire, planPath } from "./bot";
import { ignitionProbability, spreadFire } from "./fire";
import { createRng } from "./rng";
import { generateShip, neighbours, openCells, type Ship } from "./ship";
import { Simulation } from "./simulation";

const reachable = (ship: Ship, from: number) => {
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const c = queue.shift()!;
    for (const n of neighbours(ship.size, c)) {
      if (ship.open[n] && !seen.has(n)) {
        seen.add(n);
        queue.push(n);
      }
    }
  }
  return seen;
};

describe("generateShip", () => {
  it("keeps the border closed and every open cell connected", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const ship = generateShip(25, createRng(seed));
      const size = ship.size;
      for (let i = 0; i < size; i++) {
        expect(ship.open[i]).toBe(false);
        expect(ship.open[(size - 1) * size + i]).toBe(false);
        expect(ship.open[i * size]).toBe(false);
        expect(ship.open[i * size + size - 1]).toBe(false);
      }
      const cells = openCells(ship);
      expect(cells.length).toBeGreaterThan(200);
      expect(reachable(ship, cells[0]).size).toBe(cells.length);
    }
  });

  it("is deterministic for a seed", () => {
    expect(generateShip(25, createRng(7)).open).toEqual(generateShip(25, createRng(7)).open);
  });
});

describe("fire", () => {
  it("uses P = 1 - (1 - q)^k", () => {
    expect(ignitionProbability(0.3, 0)).toBe(0);
    expect(ignitionProbability(0.3, 1)).toBeCloseTo(0.3);
    expect(ignitionProbability(0.3, 2)).toBeCloseTo(0.51);
  });

  it("spreads to every open neighbour at q = 1 and nowhere at q = 0", () => {
    const ship = generateShip(25, createRng(3));
    const start = openCells(ship)[10];
    const burning = new Array<boolean>(ship.open.length).fill(false);
    burning[start] = true;
    const all = spreadFire(ship, burning, 1, createRng(1));
    for (const n of neighbours(ship.size, start)) expect(all[n]).toBe(ship.open[n]);
    expect(spreadFire(ship, burning, 0, createRng(1))).toEqual(burning);
  });
});

describe("planPath", () => {
  it("never routes the risk-aware bot through fire", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const sim = new Simulation({ size: 25, q: 0.3, strategy: "risk-aware", seed });
      const { ship, burning, bot, button } = sim.state;
      const path = planPath(ship, burning, bot, button, "risk-aware", 0.3);
      for (const c of path ?? []) expect(burning[c]).toBe(false);
    }
  });

  it("prefers a longer route that keeps distance from the fire", () => {
    // 7x7 ring: two equal-length routes from left to right. A burning stub
    // hangs just inside the top route, so the top route brushes the fire.
    const size = 7;
    const open = new Array<boolean>(size * size).fill(false);
    for (let c = 1; c <= 5; c++) open[1 * size + c] = open[5 * size + c] = true;
    for (let r = 1; r <= 5; r++) open[r * size + 1] = open[r * size + 5] = true;
    open[2 * size + 3] = true;
    const ship = { size, open };
    const burning = new Array<boolean>(size * size).fill(false);
    burning[2 * size + 3] = true;
    expect(planPath(ship, burning, 3 * size + 1, 3 * size + 5, "plan-once", 0.4)).toBeTruthy();
    const start = 3 * size + 1;
    const goal = 3 * size + 5;
    const path = planPath(ship, burning, start, goal, "risk-aware", 0.4)!;
    expect(path).toContain(5 * size + 3);
    const dist = distanceToFire(ship, burning);
    expect(Math.min(...path.map((c) => dist[c]))).toBeGreaterThan(1);
  });
});

describe("Simulation", () => {
  it("always ends", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const sim = new Simulation({ size: 25, q: 0.3, strategy: "risk-aware", seed });
      let ticks = 0;
      while (sim.state.status === "running" && ticks++ < 2000) sim.tick();
      expect(sim.state.status).not.toBe("running");
    }
  });

  it("only lets visitors ignite open, empty cells", () => {
    const sim = new Simulation({ size: 25, q: 0.3, strategy: "risk-aware", seed: 4 });
    const { bot, ship } = sim.state;
    expect(sim.ignite(bot)).toBe(false);
    expect(sim.ignite(ship.open.indexOf(false))).toBe(false);
    const free = openCells(ship).find((c) => c !== bot && c !== sim.state.button && !sim.state.burning[c])!;
    expect(sim.ignite(free)).toBe(true);
  });
});
