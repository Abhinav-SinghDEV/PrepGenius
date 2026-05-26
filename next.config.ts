import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/register",
        permanent: false, // Keep this false during development so the browser doesn't cache it permanently
      },
    ];
  },
};

export default nextConfig;