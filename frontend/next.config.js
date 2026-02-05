/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/hackathon-todo-app', // Uncomment if deploying to subdirectory
  trailingSlash: false, // Vercel handles routing better without trailing slashes
  images: {
    unoptimized: false, // Let Vercel optimize images
  },
};

module.exports = nextConfig;