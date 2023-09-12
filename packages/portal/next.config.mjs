/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  }
};

export default config;