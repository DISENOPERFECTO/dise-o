/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s3.amazonaws.com', process.env.AWS_S3_BUCKET_NAME],
  },
};

module.exports = nextConfig;