import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getUser } from "../api/users.api";

/**
 * @param {string | string[]} roles
 * @param {(ctx: import("next").GetServerSidePropsContext, supabaseClient: SupabaseClient) => Promise<import("next").GetServerSidePropsResult<P>>} whenNotRole
 * @template P
 * @returns
 */
const roleRequired = (roles, whenNotRole) => {
  /** @type {import("./withPageAuthWrap").AuthWrapFunction} */
  return async (ctx, supabaseClient, user) => {
    const { userRole } = user;

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
