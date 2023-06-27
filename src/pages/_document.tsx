import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script async src="//static.getclicky.com/101414337.js"></script>
        <script
          type="text/javascript"
          src="https://platform-api.sharethis.com/js/sharethis.js#property=648de906bc4937001297ee58&product=sop"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
