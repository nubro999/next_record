/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;