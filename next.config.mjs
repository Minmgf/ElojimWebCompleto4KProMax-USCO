/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
