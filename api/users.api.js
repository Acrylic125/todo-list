import { SupabaseClient } from "@supabase/supabase-js";

/**
 *
 * @param {SupabaseClient} supabaseClient
 * @returns
 */
export async function getUser(supabaseClient, { jwt, includeRole } = {}) {
  const { data: user, error: getUserError } = await supabaseClient.auth.getUser(jwt);
  if (getUserError) {
    throw getUserError;
  }
  if (user.user === null) {
    return null;
  }
  var result = user.user;

  // Include role.
  if (includeRole) {
    const {
      data: [userRole],
      error: getUserRoleError,
    } = await supabaseClient.from("user_roles").select("*").limit(1).eq("user_id", result.id);
    if (getUserRoleError) {
      throw getUserRoleError;
    }
    result.userRole = userRole;
  }

  return result;
}
