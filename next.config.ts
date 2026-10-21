import type { NextConfig } from "next";

// Static export: `npm run build` writes plain files to out/, which Netlify and
// Vercel both serve as-is.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
