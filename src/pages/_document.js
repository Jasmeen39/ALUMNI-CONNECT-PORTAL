import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Alumni Connect Portal - Stay connected with your alma mater." />
        <meta name="theme-color" content="#ffffff" />
        
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:title" content="Alumni Connect Portal" />
        <meta property="og:description" content="Stay connected with your alma mater, share updates, and network with alumni." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alumni Connect Portal" />
        <meta name="twitter:description" content="Stay connected with your alma mater, share updates, and network with alumni." />
        <meta name="twitter:image" content="/twitter-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
