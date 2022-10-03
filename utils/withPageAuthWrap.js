import { SupabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";

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
 * @typedef {{ terminate: true, data: import("next").GetServerSidePropsResult<P> } | { terminate: false, data: any }} AuthWrapFunctionResults
 * @template {any} P
 */

/**
 *
 * @typedef {(ctx: import("next").GetServerSidePropsContext, supabase: SupabaseClient) => Promise<
 * AuthWrapFunctionResults<any>
 * >} AuthWrapFunction
 * @type {(
 * ...args: [...Parameters<typeof withPageAuth>, AuthWrapFunction[]]
 * ) => ReturnType<typeof withPageAuth>}
 */
const withPageAuthWrap = ({ authRequired, redirectTo, getServerSideProps, cookieOptions }, functions) => {
  return withPageAuth({
    authRequired,
    redirectTo,
    getServerSideProps: async (context, supabaseClient) => {
      var props = {};
      for (const func of functions) {
        const result = await func(context, supabaseClient);
        if (result.terminate) {
          // The data returned is a GetServerSidePropsResult.
          return result.data;
        }
        // The data returned is a props object. Here, we merge
        // the props object with the previous props object.
        props = { ...props, ...result.data };
      }
      return {
        props,
      };
    },
    cookieOptions,
  });
};

export default withPageAuthWrap;
