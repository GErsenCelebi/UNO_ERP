const isBuild = process.env.NEXT_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: { unoptimized: true }
};

if (isBuild) {
  nextConfig.output = 'export';
} else {
  nextConfig.rewrites = async () => [
    {
      source: '/api/:path*',
      destination: 'http://127.0.0.1:8001/api/:path*'
    }
  ];
}

module.exports = nextConfig;
