import { createEmotionCache, MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

// Create a client
const queryClient = new QueryClient();

/**
 * This cache is needed to prevent the tailwind preflight from overriding
 * the default mantine styles.
 * Ref: https://stackoverflow.com/questions/72083381/load-mantine-styles-after-tailwind-preflight
 */
const emotionCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}
          emotionCache={emotionCache}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
