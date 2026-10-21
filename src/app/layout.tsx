import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import { FluidBackground } from "@/components/FluidBackground";
import { BotNav } from "@/components/nav/BotNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

// Vercel sets the production URL at build time; link previews need absolute URLs.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
const title = "Dharm Patel | Software Engineer & ML Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Dharm Patel" },
  description: `${profile.headline} ${profile.sub}`,
  authors: [{ name: "Dharm Patel", url: profile.github }],
  keywords: ["Dharm Patel", "software engineer", "machine learning engineer", "new grad", "Rutgers", "backend", "Spring Boot", "FastAPI", "PyTorch", "AWS"],
  // public/og.png is the 1200x630 preview card; regenerate it if the headline changes.
  openGraph: {
    title,
    description: profile.headline,
    type: "website",
    siteName: "Dharm Patel",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dharm Patel, Software Engineer and ML Engineer" }],
  },
  twitter: { card: "summary_large_image", title, description: profile.headline, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#08090f" },
  ],
};

// Sets the theme before first paint: the saved choice, else the system setting.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        <FluidBackground />
        <Link
          href="/#home"
          aria-label="Dharm Patel, back to top"
          className="nav-shadow fixed left-8 top-10 z-50 hidden h-11 items-center gap-2.5 rounded-full border border-line bg-deck/70 pl-1.5 pr-4 text-sm font-semibold backdrop-blur-2xl transition-colors hover:border-accent xl:flex"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-on-accent">DP</span>
          Dharm Patel
        </Link>
        <BotNav />
        <ThemeToggle />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
