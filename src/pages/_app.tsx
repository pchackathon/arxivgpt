import "@styles/globals.css";
import { catamaran } from "@styles/fonts";
import type { AppProps } from "next/app";

import Head from "next/head";
import SiteLayout from "@components/Layout/SiteLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>arXivGPT</title>
        <meta name="description" content="GPT Powered arXiv Experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteLayout>
        <main className={`${catamaran.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </SiteLayout>
    </div>
  );
}
