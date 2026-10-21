import { planPath, type Strategy } from "./bot";
import { spreadFire } from "./fire";
import { createRng, pick, type Rng } from "./rng";
import { generateShip, openCells, type Ship } from "./ship";

export type Status = "running" | "escaped" | "caught" | "button-lost";

export interface SimState {
  ship: Ship;
  burning: boolean[];
  bot: number;
  button: number;
  path: number[];
  steps: number;
  status: Status;
}

export interface SimOptions {
  size: number;
  q: number;
  strategy: Strategy;
  seed: number;
}

/** Owns one run: a ship, a bot, a button, and the fire. Deterministic per seed. */
export class Simulation {
  state: SimState;
  q: number;
  strategy: Strategy;
  private rng: Rng;

  constructor({ size, q, strategy, seed }: SimOptions) {
    this.rng = createRng(seed);
    this.q = q;
    this.strategy = strategy;

    const ship = generateShip(size, this.rng);
    const cells = openCells(ship);
    const taken = new Set<number>();
    const place = () => {
      let c: number;
      do c = pick(cells, this.rng);
      while (taken.has(c));
      taken.add(c);
      return c;
    };

    // Keep the start interesting: the bot and button should not be neighbours.
    const bot = place();
    let button = place();
    for (let tries = 0; tries < 20 && manhattan(size, bot, button) < size / 2; tries++) {
      taken.delete(button);
      button = place();
    }
    const fire = place();

    const burning = new Array<boolean>(ship.open.length).fill(false);
    burning[fire] = true;
    const path = planPath(ship, burning, bot, button, strategy, q) ?? [];
    this.state = { ship, burning, bot, button, path, steps: 0, status: "running" };
  }

  /** Bot moves (replanning if risk-aware), then the fire spreads. */
  tick(): SimState {
    const s = this.state;
    if (s.status !== "running") return s;

    let path = s.path;
    if (this.strategy === "risk-aware") {
      path = planPath(s.ship, s.burning, s.bot, s.button, "risk-aware", this.q) ?? path;
    }
    const bot = path.length > 0 ? path[0] : s.bot;
    path = path.slice(1);
    const steps = s.steps + 1;

    if (bot === s.button) {
      this.state = { ...s, bot, path, steps, status: "escaped" };
      return this.state;
    }
    if (s.burning[bot]) {
      this.state = { ...s, bot, path, steps, status: "caught" };
      return this.state;
    }

    const burning = spreadFire(s.ship, s.burning, this.q, this.rng);
    let status: Status = "running";
    if (burning[bot]) status = "caught";
    else if (burning[s.button]) status = "button-lost";
    this.state = { ...s, burning, bot, path, steps, status };
    return this.state;
  }

  setFlammability(q: number) {
    this.q = q;
  }

  /** Visitor action: set an open, empty cell on fire. Returns false if not allowed. */
  ignite(cell: number): boolean {
    const s = this.state;
    if (s.status !== "running" || !s.ship.open[cell] || s.burning[cell]) return false;
    if (cell === s.bot || cell === s.button) return false;
    const burning = s.burning.slice();
    burning[cell] = true;
    const path =
      this.strategy === "risk-aware"
        ? (planPath(s.ship, burning, s.bot, s.button, "risk-aware", this.q) ?? s.path)
        : s.path;
    this.state = { ...s, burning, path };
    return true;
  }
}

const manhattan = (size: number, a: number, b: number) =>
  Math.abs(Math.floor(a / size) - Math.floor(b / size)) + Math.abs((a % size) - (b % size));
