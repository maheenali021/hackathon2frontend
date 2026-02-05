import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/hackathon-todo-app', // Uncomment if deploying to subdirectory
  trailingSlash: false, // Vercel handles routing better without trailing slashes
  images: {
    unoptimized: false, // Let Vercel optimize images
  },
  // Explicitly do not use static export for Vercel deployment
  output: undefined,
};

export default nextConfig;
