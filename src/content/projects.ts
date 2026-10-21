// Every number here traces to ../../project/NN-*.txt or ../../fact-check-2026-10-16.md.
// Rules carried from those files:
// - MedGuard and the recipe recommender each have a duplicate repo; one entry each.
// - Never link the private stacked-recommender repo (05); it 404s for visitors.
// - Rutgers trio labels follow the corrected descriptions in files 09 and 10.
// - Keep caveats and negative results.
// Copy is kept short on purpose: one-line summary, short points, few tags.

export type Kind = "eng" | "ml";
export type Lens = "all" | Kind;

export interface Metric {
  value: string;
  label: string;
  /** Where the number comes from (repo path or project file). */
  source: string;
}

export interface Point {
  text: string;
  kind: Kind;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  when: string;
  context: string;
  kinds: Kind[];
  metrics: Metric[];
  points: Point[];
  tech: string[];
  caveat?: string;
  links: { label: string; href: string; kind: "code" | "live" }[];
  detail?: "medguard" | "recommender" | "pest";
  /** Shows the live fire-simulation demo on the card. */
  demo?: boolean;
}

export const kindLabels: Record<Kind, string> = {
  eng: "Software engineering",
  ml: "Machine learning",
};

export const lensLabels: Record<Lens, { full: string; short: string }> = {
  all: { full: "All projects", short: "All" },
  eng: { full: "Software engineering", short: "Engineering" },
  ml: { full: "Machine learning", short: "ML" },
};

export const projects: Project[] = [
  {
    slug: "medguard",
    title: "MedGuard",
    summary: "Medical question answering that shows how sure it is, and declines to answer when the evidence is weak.",
    when: "2026",
    context: "Rutgers NLP course project",
    kinds: ["ml", "eng"],
    metrics: [
      { value: "−61%", label: "calibration error", source: "project/01, outputs/calibrator" },
      { value: "67%", label: "accuracy on the 81% it answers", source: "outputs/decision/decision_stats.json" },
      { value: "4", label: "datasets tested", source: "project/01 cross-dataset table" },
    ],
    points: [
      { kind: "ml", text: "A small calibrator cut calibration error by 61% (0.143 to 0.056). The usual fix, temperature scaling, made it worse." },
      { kind: "eng", text: "Ten-stage pipeline run by one script, with a quick smoke-test mode and every result committed." },
      { kind: "ml", text: "It answers 81% of questions at 67% accuracy and skips the rest, beating a fixed confidence cut-off." },
      { kind: "ml", text: "Removing the top evidence sentence changes 21% of answers, so the cited evidence really drives them." },
      { kind: "eng", text: "Hybrid search: keyword (BM25) and embedding results merged with Reciprocal Rank Fusion." },
      { kind: "ml", text: "Helped on 3 of 4 datasets. On BioASQ, already well calibrated, it made things worse, and that's reported." },
    ],
    tech: ["Python", "PyTorch", "Hugging Face", "PubMedBERT", "DeBERTa-v3", "BM25"],
    caveat: "Test sets are small (150 and 75 questions).",
    links: [{ label: "Code", href: "https://github.com/DharmPatel02/MedGuard-Reliable-Biomedical-QA", kind: "code" }],
    detail: "medguard",
  },
  {
    slug: "vehicle-auction",
    title: "Vehicle Auction Platform",
    summary: "A live auction website with automatic proxy bidding and auctions that open and close on schedule.",
    when: "2025 – 2026",
    context: "Rutgers Database Systems course project, still live",
    kinds: ["eng"],
    metrics: [
      { value: "41", label: "REST endpoints", source: "fact-check: controllers/" },
      { value: "79", label: "commits over 10 months", source: "project/03" },
      { value: "Live", label: "deployed and public", source: "project/03" },
    ],
    points: [
      { kind: "eng", text: "Second-price proxy bidding: placing a bid, updating the price, and picking the winner happen in one transaction." },
      { kind: "eng", text: "Scheduled Quartz jobs open and close auctions on time, and are re-registered on restart so none are lost." },
      { kind: "eng", text: "Fixed connection errors behind Supabase's pooler by tuning HikariCP, then moved the database to Render." },
      { kind: "eng", text: "Spring Boot API in a multi-stage Docker build on Render; React frontend on Netlify." },
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Quartz", "React", "Docker"],
    links: [
      { label: "Live site", href: "https://vehicle-auction-system.netlify.app/", kind: "live" },
      { label: "Code", href: "https://github.com/DharmPatel02/Vehicle-Auction-System", kind: "code" },
    ],
  },
  {
    slug: "anchor",
    title: "Anchor",
    summary: "A Mac focus assistant that notices when you drift from your task and nudges you back by voice.",
    when: "2026",
    context: "Solo personal experiment",
    kinds: ["ml", "eng"],
    metrics: [
      { value: "3", label: "on-device vision models", source: "activity_monitor.py" },
      { value: "5", label: "focus states (HMM)", source: "anchor_hmm.py" },
      { value: "45", label: "commits, all mine", source: "fact-check: git log" },
    ],
    points: [
      { kind: "ml", text: "The webcam tracks posture, hands, face, and phone use with MediaPipe and YOLOv8n. No video is saved." },
      { kind: "eng", text: "FastAPI pushes live events over WebSockets to a Chrome extension and a React app." },
      { kind: "ml", text: "A Hidden Markov Model estimates focus states such as focused, stuck, or avoiding." },
      { kind: "eng", text: "Nudges back off when ignored, so help doesn't turn into nagging." },
      { kind: "ml", text: "Gemini checks whether each open window fits the task you said you were doing." },
    ],
    tech: ["Python", "FastAPI", "WebSockets", "MediaPipe", "Gemini", "React"],
    caveat: "A personal experiment, not a shipped product.",
    links: [{ label: "Code", href: "https://github.com/DharmPatel02/Anchor-AI-Focus-Assistant", kind: "code" }],
  },
  {
    slug: "deathbox",
    title: "DeathBox",
    summary: "Record your finances by voice; your family gets a sealed, step-by-step guide if you stop checking in.",
    when: "2026",
    context: "HackHERS 2026 winner, team of 4",
    kinds: ["eng", "ml"],
    metrics: [
      { value: "Winner", label: "HackHERS 2026", source: "portfolio-content.md" },
      { value: "24 h", label: "idea to demo", source: "fact-check: git log" },
      { value: "4", label: "person team", source: "project/06" },
    ],
    points: [
      { kind: "eng", text: "Every AI call has a timeout, a 3-model Gemini fallback, and mock data, so the demo never stalls." },
      { kind: "ml", text: "Gemini turns speech and photos of documents into structured account records." },
      { kind: "eng", text: "Package fingerprints are recorded on Solana, so the family can prove nothing changed." },
      { kind: "eng", text: "My part: integration, checks before sealing, the fill-in-the-gaps flow, and the deploy script." },
    ],
    tech: ["Python", "FastAPI", "Next.js", "Gemini", "Solana"],
    links: [{ label: "Code", href: "https://github.com/DharmPatel02/Deathbox", kind: "code" }],
  },
  {
    slug: "recipe-recommender",
    title: "Recipe Recommender",
    summary: "Thirteen recommendation models compared on Food.com reviews to see which combination really wins.",
    when: "2026",
    context: "Rutgers Machine Learning course project",
    kinds: ["ml"],
    metrics: [
      { value: "13", label: "models compared", source: "project/11" },
      { value: "0.860", label: "best error (RMSE)", source: "project/11" },
      { value: "276K", label: "reviews", source: "project/11" },
    ],
    points: [
      { kind: "ml", text: "Hand-written matrix factorization is the best single model; a 3-way blend ties it and ranks best." },
      { kind: "ml", text: "Stacking overfit and lost, and the write-up says so." },
      { kind: "ml", text: "New users and recipes get a content-based model, so cold start is handled." },
    ],
    tech: ["Python", "scikit-learn", "pandas", "NumPy"],
    links: [{ label: "Code", href: "https://github.com/DharmPatel02/Hybrid-Recommender-System-for-Recipe-Recommendations", kind: "code" }],
    detail: "recommender",
  },
  {
    slug: "rutgers-ai",
    title: "AI Agents Under Uncertainty",
    summary: "Three bots that act on incomplete information on randomly generated ships. Try the fire escape demo.",
    when: "2025",
    context: "Rutgers Intro to AI, 3 projects",
    kinds: ["eng", "ml"],
    metrics: [],
    points: [
      { kind: "eng", text: "Fire escape: the bot replans every step and treats fire as a cost, not a wall." },
      { kind: "ml", text: "Localization: a bot finds where it is, and a Keras CNN predicts how long that will take." },
      { kind: "ml", text: "Tracking: Bayesian search for a hidden target using a noisy sensor." },
    ],
    tech: ["Python", "NumPy", "Keras"],
    links: [
      { label: "Fire escape", href: "https://github.com/DharmPatel02/autonomous-navigation-system", kind: "code" },
      { label: "Localization", href: "https://github.com/DharmPatel02/Hit-by-Neutrino", kind: "code" },
      { label: "Tracking", href: "https://github.com/DharmPatel02/Space-Rats", kind: "code" },
    ],
    demo: true,
  },
  {
    slug: "pest-classification",
    title: "Pest Image Classifier",
    summary: "Four image models compared fairly on 12 kinds of crop pests.",
    when: "2025",
    context: "Computer vision study",
    kinds: ["ml"],
    metrics: [
      { value: "87.6%", label: "best test accuracy", source: "project/08" },
      { value: "0.55", label: "points between best and worst", source: "project/08" },
      { value: "12", label: "pest classes", source: "project/08" },
    ],
    points: [
      { kind: "ml", text: "All four models land within 0.55 points of each other, so the cheapest one is the smart pick." },
      { kind: "ml", text: "Same seed, split, and training setup for every model, so the comparison is fair." },
      { kind: "ml", text: "Mistakes cluster on snails vs slugs and earthworms, a real look-alike problem." },
    ],
    tech: ["TensorFlow", "Keras", "scikit-learn"],
    caveat: "The repo title says lightweight, but there's no compressed model yet.",
    links: [
      {
        label: "Code",
        href: "https://github.com/DharmPatel02/Deep-Transfer-Learning-based-Light-weight-Agricultural-Pest-Classification-CNN-Model",
        kind: "code",
      },
    ],
    detail: "pest",
  },
];

/** Projects shown under a lens, in the order they're listed above. */
export const projectsFor = (lens: Lens) => (lens === "all" ? projects : projects.filter((p) => p.kinds.includes(lens)));

/** Up to three points for a lens; "all" keeps the listed (interleaved) order. */
export const pointsFor = (p: Project, lens: Lens) =>
  (lens === "all" ? p.points : p.points.filter((pt) => pt.kind === lens)).slice(0, 3);
