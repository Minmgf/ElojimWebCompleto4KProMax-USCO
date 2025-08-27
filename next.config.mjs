/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "gxusmekmbgrigpxyflxq.supabase.co"
    ],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
