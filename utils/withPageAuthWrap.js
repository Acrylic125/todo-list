import { SupabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { getUser } from "../api/users.api";

/**
 * What is this?
 * This helper function joins up functionality that requires withPageAuth.
 * These functionality are functions, passed in as an array, as the second argument.
 * These functions executed sequentially in order of the array. Each function can return
 * a result, which is passed to the next function in the array.
 *
 * Why?
 * This is useful when you want to execute multiple functions that require withPageAuth.
 * You will notice a lot of code redundancy when protecting pages like ban checks, role
 * checks, etc. This helper function allows you to reuse such checks.
 *
 * Each function can terminate the execution of the array by returning a result with
 * the terminate property set to true.
 *
 * @typedef {{ terminate: true, results: import("next").GetServerSidePropsResult<P> } | { terminate: false, props: P }} AuthWrapFunctionResults<P>
 * @template {any} P
 */

/**
 *
 * @typedef {(ctx: import("next").GetServerSidePropsContext, supabase: SupabaseClient, user: import("@supabase/supabase-js").User & { userRole: { role: string } }) => Promise<
 * AuthWrapFunctionResults<any>
 * >} AuthWrapFunction
 * @type {(
 * ...args: [...Parameters<typeof withPageAuth>, AuthWrapFunction[]]
 * ) => ReturnType<typeof withPageAuth>}
 */
const withPageAuthWrap = ({ authRequired, redirectTo, getServerSideProps, cookieOptions }, functions) => {
  return withPageAuth({
    authRequired,
    redirectTo: redirectTo || "/login",
    getServerSideProps: async (context, supabaseClient) => {
      try {
        const user = await getUser(supabaseClient, { includeRole: true });

        if (user === null) {
          throw new Error("User not found.");
        }

        var props = { user };
        for (const func of functions) {
          const result = await func(context, supabaseClient, user);
          if (result.terminate) {
            // The data returned is a GetServerSidePropsResult.
            return result.results;
          }
          // The data returned is a props object. Here, we merge
          // the props object with the previous props object.
          props = { ...props, ...result.props };
        }
        return {
          props,
        };
      } catch (err) {
        console.error(err);
        return {
          redirect: {
            destination: "/500",
          },
        };
      }
    },
    cookieOptions,
  });
};

export default withPageAuthWrap;
