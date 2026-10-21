import { pick, type Rng } from "./rng";

/** A square ship. `open[i]` is true for walkable cells; index = row * size + col. */
export interface Ship {
  size: number;
  open: boolean[];
}

export const index = (size: number, row: number, col: number) => row * size + col;

export function neighbours(size: number, i: number): number[] {
  const row = Math.floor(i / size);
  const col = i % size;
  const out: number[] = [];
  if (row > 0) out.push(i - size);
  if (row < size - 1) out.push(i + size);
  if (col > 0) out.push(i - 1);
  if (col < size - 1) out.push(i + 1);
  return out;
}

const isBorder = (size: number, i: number) => {
  const row = Math.floor(i / size);
  const col = i % size;
  return row === 0 || col === 0 || row === size - 1 || col === size - 1;
};

/**
 * Same procedure as the "Bot Is On Fire" project: open a random interior cell,
 * then keep opening blocked cells that have exactly one open neighbour until
 * none are left. The border stays closed. Afterwards about half of the dead
 * ends are re-opened (as in Space Rats) so the ship has loops, which gives a
 * risk-aware bot real alternatives to choose between.
 */
export function generateShip(size: number, rng: Rng, deadEndRatio = 0.5): Ship {
  const open = new Array<boolean>(size * size).fill(false);
  const openCount = (i: number) => neighbours(size, i).filter((n) => open[n]).length;

  const interior: number[] = [];
  for (let i = 0; i < size * size; i++) if (!isBorder(size, i)) interior.push(i);
  open[pick(interior, rng)] = true;

  for (;;) {
    const candidates = interior.filter((i) => !open[i] && openCount(i) === 1);
    if (candidates.length === 0) break;
    open[pick(candidates, rng)] = true;
  }

  const deadEnds = interior.filter((i) => open[i] && openCount(i) === 1);
  for (const cell of deadEnds) {
    if (rng() >= deadEndRatio) continue;
    const closed = neighbours(size, cell).filter((n) => !open[n] && !isBorder(size, n));
    if (closed.length > 0) open[pick(closed, rng)] = true;
  }

  return { size, open };
}

export const openCells = (ship: Ship) =>
  ship.open.flatMap((isOpen, i) => (isOpen ? [i] : []));
