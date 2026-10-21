/** Centred content column used by every section: about 1060px of content with wide side margins. */
export const container = "mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-12";

/** Two-line section title: the first word in the moving gradient, the second faded. */
export function SplitHeading({ id, lead, rest, intro, children }: { id: string; lead: string; rest: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <h2 id={id} className="type-display text-[clamp(3rem,7vw,5rem)]">
        <span className="text-gradient">{lead}</span>
        <br />
        <span className="text-hull/55">{rest}</span>
      </h2>
      {(intro || children) && (
        <div className="flex max-w-md flex-col gap-5 md:items-end md:text-right">
          {intro && <p className="text-muted">{intro}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

/** Left-column title for sections laid out as title + content. */
export function SideHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="md:sticky md:top-36">
      <h2 id={id} className="type-display text-[clamp(2.5rem,5vw,3.5rem)]">
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-xs text-muted">{intro}</p>}
    </div>
  );
}
