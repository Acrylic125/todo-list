import { createEmotionCache, MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/layout";
import "../styles/globals.css";

// Create a client
const queryClient = new QueryClient();

// const isBrowser = typeof document !== "undefined";

// function createEmotionCacheWrapper() {
//   let insertionPoint;

//   console.log("createEmotionCacheWrapper");
//   if (isBrowser) {
//     const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
//     console.log("emotionInsertionPoint", emotionInsertionPoint);
//     insertionPoint = emotionInsertionPoint ?? undefined;
//   }

//   return createEmotionCache({ key: "mantine", insertionPoint });
// }

/**
 * This cache is needed to prevent the tailwind preflight from overriding
 * the default mantine styles.
 * Ref: https://stackoverflow.com/questions/72083381/load-mantine-styles-after-tailwind-preflight
 */
const emotionCache = createEmotionCache({
  key: "mantine",
  prepend: false, // TODO: Convert this to insertion point.
});

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  /**
   * Adapted from: https://nextjs.org/docs/basic-features/layouts
   *
   * TODO: If the Layout RFC goes through, we will need to update thtis.
   */
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}
          // emotionCache={createEmotionCacheWrapper()}
          emotionCache={emotionCache}
        >
          <Layout user={pageProps.user}>{getLayout(<Component {...pageProps} />)}</Layout>
        </MantineProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
