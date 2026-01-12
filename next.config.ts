import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: ["stunning-full-heron.ngrok-free.app"],
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
