import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

/**
 *
 * @param {(ctx: import("next").GetServerSidePropsContext, supabaseClient: SupabaseClient, bans: any[]) => Promise<import("next").GetServerSidePropsResult<P>>} whenBanned
 * @template P
 * @returns
 */
const banProtected = (whenBanned) => {
  /** @type {import("./withPageAuthWrap").AuthWrapFunction} */
  return async (ctx, supabaseClient) => {
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const { data: isBanned, error: isBannedError } = await supabaseClient.rpc("is_banned", {
      uid: user.id,
    });
    if (isBannedError) {
      throw isBannedError;
    }

    if (isBanned) {
      if (typeof whenBanned === "function") {
        const whenBannedResult = await whenBanned(ctx, supabaseClient, bans);
        return {
          terminate: true,
          results: whenBannedResult,
        };
      }
      return {
        terminate: true,
        results: {
          redirect: {
            permanent: true,
            destination: "/ban",
          },
        },
      };
    }

    return {
      props: {},
    };
  };
};

export default banProtected;
