import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 images: {
  remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_STORAGE_URL}/vocaloid/images/**`)]
 }
}

export default nextConfig;
