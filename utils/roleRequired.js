import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

/**
 * @param {string | string[]} roles
 * @param {(ctx: import("next").GetServerSidePropsContext, supabaseClient: SupabaseClient) => Promise<import("next").GetServerSidePropsResult<P>>} whenNotRole
 * @template P
 * @returns
 */
const roleRequired = (roles, whenNotRole) => {
  /** @type {import("./withPageAuthWrap").AuthWrapFunction} */
  return async (ctx, supabaseClient) => {
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const {
      data: [userRole],
      error: getUserRoleError,
    } = await supabaseClient.from("user_roles").select("*").eq("user_id", user.id);
    if (getUserRoleError) {
      throw getUserRoleError;
    }

    var hasRole = roles instanceof Array ? roles.includes(userRole.role) : userRole.role === roles;

    if (!hasRole) {
      if (typeof whenNotRole === "function") {
        const whenNotRoleResult = await whenNotRole(ctx, supabaseClient);

        return {
          terminate: true,
          results: whenNotRoleResult,
        };
      }

      return {
        terminate: true,
        results: {
          redirect: {
            statusCode: 302,
            destination: "/",
          },
        },
      };
    }

    return {
      props: {},
    };
  };
};

export default roleRequired;
