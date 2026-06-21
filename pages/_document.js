import { Head, Html, Main, NextScript } from 'next/document';

const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';
const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_VERIFICATION || '';
const UMAMI_SITE_ID = process.env.NEXT_PUBLIC_UMAMI_SITE_ID || '';
const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:," />
        {GOOGLE_SITE_VERIFICATION ? (
          <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
        ) : null}
        {BING_SITE_VERIFICATION ? (
          <meta name="msvalidate.01" content={BING_SITE_VERIFICATION} />
        ) : null}
        {UMAMI_SITE_ID ? (
          <script
            defer
            src={UMAMI_SCRIPT_URL}
            data-website-id={UMAMI_SITE_ID}
          />
        ) : null}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
