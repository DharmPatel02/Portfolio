# Dharm Patel — portfolio site

Next.js 16 (App Router) static site for SDE and ML engineering roles, with no
backend: the build is plain HTML, CSS, and JS. Light and dark themes (follows
the system setting until the visitor picks one) with a small
robot that rides the top nav. The projects section includes an opt-in 3D demo
of the fire simulation from my Rutgers Intro to AI project, built with three.js
through @react-three/fiber, with a 2D canvas fallback when WebGL is unavailable.

Replaces the earlier Vite version of this site; its code is in the git history
before the "Merge earlier Vite portfolio" commit.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # simulation unit tests (Vitest)
npm run lint
npm run build    # static export to out/
```

## Deploy

Hosted on Vercel: import the repo and it detects Next.js and serves the static
export with no extra config. Every push to `main` redeploys the live site.

## Where things live

- `src/content/` — all copy and numbers. Every metric traces to
  `../project/*.txt` or `../fact-check-2026-10-16.md`; don't add claims that
  aren't in `../portfolio-content.md`.
- `src/lib/sim/` — ship generation, fire spread, risk-aware planning (pure TS,
  seeded, tested).
- `src/components/hero/` — hero, plus the fire-escape demo (3D scene, 2D fallback) that loads only when a visitor opens it.
- `src/components/nav/BotNav.tsx` — top nav; the robot follows the section
  being read.
- `src/components/ui/tilt-card.tsx`, `src/components/FluidBackground.tsx` —
  card tilt and the ambient background.
- `src/app/globals.css` — colour tokens and the nav, tilt, and timeline
  animations (all off under reduced motion).
- `src/components/charts/` — small HTML charts used on `/work/[slug]`.
- `public/og.png` — the link-preview card (LinkedIn, Slack, email). Regenerate
  it if the name, headline, or availability changes.

## To finish

- Add `public/resume.pdf`, then set `profile.resume = "/resume.pdf"` in
  `src/content/profile.ts`.
# Portfolio
