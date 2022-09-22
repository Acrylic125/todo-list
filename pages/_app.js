import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import UserProvider from "../components/user-provider/UserProvider";
import "../styles/globals.css";
import { supabase } from "../utils/supabase-client";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("GGG");
      console.log(event);
      console.log(session);
      handleAuthChange(event, session);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
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
      {/* <UserProvider>
        
      </UserProvider> */}
      {/* <UserProvider autoRefreshToken supabaseClient={supabaseClient}>
        
      </UserProvider> */}
    </QueryClientProvider>
  );
}

async function handleAuthChange(event, session) {
  await fetch("/api/auth/login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
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
