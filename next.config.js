/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static HTML files after build. This makes the site suitable for
  // deployment on Cloudflare Pages without a Node runtime. You can run
  // `npm run build` to generate the `out` directory.
  output: 'export',
  trailingSlash: true,
  // Disable automatic image optimization to avoid requiring a remote image
  // loader on Cloudflare Pages.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
