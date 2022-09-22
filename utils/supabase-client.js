import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabase(jwt) {
  console.log(jwt);
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: jwt && `Bearer ${jwt}`,
      },
    },
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
  },
});
