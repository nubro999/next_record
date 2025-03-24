/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
  // Tell Next.js that we have an app directory implementation but still use pages primarily
  // This ensures both systems work together
  appDir: true,
};

module.exports = nextConfig;