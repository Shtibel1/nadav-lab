import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  
  images: {
    unoptimized: true,
  },

  reactStrictMode: true,

  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  
  experimental: {
    optimizePackageImports: ["framer-motion", "three", "@react-three/fiber", "@react-three/drei"],
  },
};

export default nextConfig;
