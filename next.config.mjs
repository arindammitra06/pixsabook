/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ignores all ESLint warnings during build
  },
};

export default nextConfig;
