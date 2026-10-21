"use client";

import { Flame } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// three.js only downloads when someone asks for the demo.
const SimStage = dynamic(() => import("./SimStage"), {
  ssr: false,
  loading: () => <div className="aspect-[16/10] w-full rounded-xl bg-deck" aria-hidden="true" />,
});

export function FireDemo() {
  const [open, setOpen] = useState(false);
  if (open) return <SimStage />;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-plate bg-deck text-center hover:border-ember"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ember/15 text-ember-ink transition-transform group-hover:scale-110 motion-reduce:transition-none">
        <Flame className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="font-semibold">Run the fire escape demo</span>
      <span className="max-w-[18rem] text-sm text-muted">A live 3D simulation. Watch the bot reason around spreading fire.</span>
    </button>
  );
}
