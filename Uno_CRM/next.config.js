const isBuild = process.env.NEXT_BUILD === 'true' || process.env.NODE_ENV === 'production' || process.argv.some(arg => arg.includes('build'));

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
      destination: 'http://localhost:8001/api/:path*'
    },
    {
      source: '/uploads/:path*',
      destination: 'http://localhost:8001/uploads/:path*'
    }
  ];
}

module.exports = nextConfig;
