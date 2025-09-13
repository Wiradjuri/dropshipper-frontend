import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  async rewrites() {
    // In dev: default to local FastAPI
    // In prod: require NEXT_PUBLIC_API_BASE_URL to be set in the environment (e.g., Vercel Project Settings)
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || (isDev ? "http://localhost:8000" : "");
    if (!backendBase) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
