import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 images: {
  remotePatterns: [new URL('https://object.xyspg.moe/vocaloid/images/**')]
 }
}

export default nextConfig;
