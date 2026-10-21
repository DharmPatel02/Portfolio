"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SimState } from "@/lib/sim/simulation";
import type { SceneColors } from "./useThemeColors";

export interface SceneProps {
  state: SimState;
  colors: SceneColors;
  animate: boolean;
  onCellClick: (cell: number) => void;
}

const WALL_H = 0.9;
const tmp = new THREE.Object3D();
const tmpColor = new THREE.Color();

const cellPos = (size: number, i: number): [number, number] => [
  (i % size) - (size - 1) / 2,
  Math.floor(i / size) - (size - 1) / 2,
];

/** Fits the whole ship in view at any canvas size. */
function FitCamera({ size }: { size: number }) {
  const get = useThree((s) => s.get);
  const view = useThree((s) => s.size);
  useLayoutEffect(() => {
    const cam = get().camera as THREE.OrthographicCamera;
    cam.position.set(size, size * 0.95, size);
    cam.lookAt(0, -1, 0);
    cam.zoom = Math.min(view.width, view.height * 1.62) / (size * 1.48);
    cam.updateProjectionMatrix();
  }, [get, view.width, view.height, size]);
  return null;
}

function Walls({ state, colors }: { state: SimState; colors: SceneColors }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cells = useMemo(
    () => state.ship.open.flatMap((open, i) => (open ? [] : [i])),
    [state.ship],
  );
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    cells.forEach((cell, n) => {
      const [x, z] = cellPos(state.ship.size, cell);
      tmp.position.set(x, WALL_H / 2, z);
      tmp.scale.set(1, 1, 1);
      tmp.updateMatrix();
      mesh.setMatrixAt(n, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [cells, state.ship.size]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cells.length]} key={cells.length}>
      <boxGeometry args={[0.96, WALL_H, 0.96]} />
      <meshStandardMaterial color={colors.wall} roughness={0.85} />
    </instancedMesh>
  );
}

function Floor({ state, colors, onCellClick }: Omit<SceneProps, "animate">) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cells = useMemo(
    () => state.ship.open.flatMap((open, i) => (open ? [i] : [])),
    [state.ship],
  );
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    cells.forEach((cell, n) => {
      const [x, z] = cellPos(state.ship.size, cell);
      tmp.position.set(x, 0, z);
      tmp.scale.set(1, 1, 1);
      tmp.updateMatrix();
      mesh.setMatrixAt(n, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [cells, state.ship.size]);

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) onCellClick(cells[e.instanceId]);
  };

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, cells.length]}
      key={cells.length}
      onPointerDown={onDown}
      onPointerOver={() => (document.body.style.cursor = "crosshair")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <boxGeometry args={[0.96, 0.08, 0.96]} />
      <meshStandardMaterial color={colors.floor} roughness={1} />
    </instancedMesh>
  );
}

function Fire({ state, colors, animate }: Omit<SceneProps, "onCellClick">) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const max = state.ship.open.length;
  const cells = useMemo(
    () => state.burning.flatMap((b, i) => (b ? [i] : [])),
    [state.burning],
  );

  const place = (t: number) => {
    const mesh = ref.current;
    if (!mesh) return;
    cells.forEach((cell, n) => {
      const [x, z] = cellPos(state.ship.size, cell);
      // Each cell flickers on its own phase; the newest flames are amber.
      const h = 0.35 + 0.25 * (0.5 + 0.5 * Math.sin(t * 6 + cell * 1.7));
      tmp.position.set(x, 0.04 + h / 2, z);
      tmp.scale.set(0.82, h, 0.82);
      tmp.updateMatrix();
      mesh.setMatrixAt(n, tmp.matrix);
      tmpColor.set((cell * 7) % 5 === 0 ? colors.amber : colors.ember);
      mesh.setColorAt(n, tmpColor);
    });
    mesh.count = cells.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => place(0));
  useFrame(({ clock }) => {
    if (animate) place(clock.elapsedTime);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, max]} raycast={() => null}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial emissive={colors.ember} emissiveIntensity={0.35} roughness={0.6} />
    </instancedMesh>
  );
}

function Path({ state, colors }: { state: SimState; colors: SceneColors }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const max = state.ship.open.length;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const cells = state.path.slice(0, -1);
    cells.forEach((cell, n) => {
      const [x, z] = cellPos(state.ship.size, cell);
      tmp.position.set(x, 0.06, z);
      tmp.scale.set(1, 1, 1);
      tmp.updateMatrix();
      mesh.setMatrixAt(n, tmp.matrix);
    });
    mesh.count = cells.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [state.path, state.ship.size]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, max]} raycast={() => null}>
      <boxGeometry args={[0.34, 0.04, 0.34]} />
      <meshStandardMaterial color={colors.signal} />
    </instancedMesh>
  );
}

function Bot({ state, colors, animate }: Omit<SceneProps, "onCellClick">) {
  const ref = useRef<THREE.Group>(null);
  const [tx, tz] = cellPos(state.ship.size, state.bot);
  // Snap when not animating, or when a new ship moves the bot more than a step.
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    if (!animate || Math.hypot(tx - g.position.x, tz - g.position.z) > 1.5) g.position.set(tx, 0, tz);
  }, [animate, tx, tz]);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g || !animate) return;
    const k = 1 - Math.exp(-dt * 14);
    g.position.x += (tx - g.position.x) * k;
    g.position.z += (tz - g.position.z) * k;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.42, 0]} raycast={() => null}>
        <capsuleGeometry args={[0.26, 0.34, 6, 16]} />
        <meshStandardMaterial color={colors.signal} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Button({ state, colors }: { state: SimState; colors: SceneColors }) {
  const [x, z] = cellPos(state.ship.size, state.button);
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.12, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.38, 0.38, 0.16, 24]} />
        <meshStandardMaterial color={colors.hull} />
      </mesh>
      <mesh position={[0, 0.22, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        <meshStandardMaterial color={colors.signal} emissive={colors.signal} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export default function ShipScene(props: SceneProps) {
  const { state, colors, animate } = props;
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      camera={{ near: 0.1, far: 200 }}
      aria-hidden="true"
    >
      <FitCamera size={state.ship.size} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[-8, 18, 6]} intensity={1.8} />
      <Walls state={state} colors={colors} />
      <Floor state={state} colors={colors} onCellClick={props.onCellClick} />
      <Path state={state} colors={colors} />
      <Fire state={state} colors={colors} animate={animate} />
      <Button state={state} colors={colors} />
      <Bot state={state} colors={colors} animate={animate} />
    </Canvas>
  );
}
