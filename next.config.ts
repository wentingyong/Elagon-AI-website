import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is the default every other image uses; 90 is opt-in for the hero arch, whose
    // source is already a tuned WebP — re-encoding it at 75 was a second lossy pass
    // and it is the one layer held still under copy where that shows.
    qualities: [75, 90],
  },
  poweredByHeader: false,
};

export default nextConfig;
