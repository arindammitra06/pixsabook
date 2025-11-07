/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or more
    },
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ignores all ESLint warnings during build
  },
};

export default nextConfig;
