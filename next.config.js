/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static HTML files after build. This makes the site suitable for
  // deployment on Cloudflare Pages without a Node runtime. You can run
  // `npm run build` to generate the `out` directory.
  output: 'export',
  trailingSlash: true,
  // Keep `npm run build` fully offline: don't let Next fetch the Google Fonts
  // stylesheet at build time. The <link> in _document loads Inter at runtime.
  optimizeFonts: false,
  // Disable automatic image optimization to avoid requiring a remote image
  // loader on Cloudflare Pages.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
