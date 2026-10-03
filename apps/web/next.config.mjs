/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@studypal/types',
    '@studypal/contracts',
    '@studypal/i18n',
    '@studypal/ui-tokens',
    '@studypal/api-client',
  ],
};

export default nextConfig;
