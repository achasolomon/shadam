/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@smhi/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
