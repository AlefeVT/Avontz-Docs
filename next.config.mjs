import createNextDocsMDX from 'fumadocs-mdx/config';

const withMDX = createNextDocsMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/s3-request-presigner'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avt-project.2ccc969fa9dd471135a9f865ca01aa47.r2.cloudflarestorage.com',
        port: '',
        pathname: '/plants/**',
      },
    ],
  },
};

export default withMDX(nextConfig);
