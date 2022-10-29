import { createEmotionCache, MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/layout";
import "../styles/globals.css";

// Create a client
const queryClient = new QueryClient();

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
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
