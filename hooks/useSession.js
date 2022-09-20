import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase-client";

/**
 * This 
 */
export function useSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Only update the react state if the component is still mounted.
      // NOTE: This check is needed because the component using this hook may be unmounted
      // before the above get session call returns.
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    })();

    // Here, we listen for the auth state change event.
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Finally, when this component unmounts, we will unsubscribe from the
    // auth state change event.
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
  };
}
