import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: ["stunning-full-heron.ngrok-free.app"],
  ignoreDuringBuilds: true,
};

export default nextConfig;
