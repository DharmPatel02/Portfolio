import Link from "next/link";
import { container } from "@/components/headings";

export default function NotFound() {
  return (
    <section className={`flex min-h-[80svh] flex-col items-start justify-center pt-32 ${container}`}>
      <p className="font-semibold text-accent-ink">Page not found</p>
      <h1 className="type-display mt-4 text-[clamp(3rem,8vw,5.5rem)]">
        <span className="text-gradient">Wrong</span> <span className="text-hull/55">turn</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">This page doesn&apos;t exist. The projects, experience, and contact details are all on the home page.</p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-6 py-3 font-semibold text-on-accent">
        Go to the home page
      </Link>
    </section>
  );
}
