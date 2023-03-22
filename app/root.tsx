// root.tsx
import React, { useContext, useEffect } from "react";
import {
  Outlet,
  Meta,
  Links,
  ScrollRestoration,
  Scripts,
  LiveReload,
} from "@remix-run/react";
import { withEmotionCache } from "@emotion/react";
import { Box, ChakraProvider } from "@chakra-ui/react";

import Footer from "./components/Footer";
import theme from "./utils/chakraTheme";
import { ServerStyleContext, ClientStyleContext } from "./utils/context";

import styles from "~/styles/index.css";

interface DocumentProps {
  children: React.ReactNode;
}

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstaticom" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
          />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV !== "development" ? <LiveReload /> : null}
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider {...{ theme }}>
        <Box bgColor="gray.800" height="100%" overflowY="auto">
          <Outlet />
          <Footer />
        </Box>
      </ChakraProvider>
    </Document>
  );
}
