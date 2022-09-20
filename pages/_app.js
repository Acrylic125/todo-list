import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      {/* <UserProvider autoRefreshToken supabaseClient={supabaseClient}>
        
      </UserProvider> */}
    </QueryClientProvider>
  );
}

export default MyApp;

// import React from "react";
// import { UserProvider } from "@supabase/auth-helpers-react";
// import { supabaseClient } from "@supabase/auth-helpers-nextjs";

// export default function App({ Component, pageProps }) {
//   return (
//     // <UserProvider supabaseClient={supabaseClient}>
//     <Component {...pageProps} />
//     // </UserProvider>
//   );
// }
