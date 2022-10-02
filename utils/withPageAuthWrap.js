import { withPageAuth } from "@supabase/auth-helpers-nextjs";

/**
 *
 * @type {typeof withPageAuth}
 * @returns
 */
const withPageBanProtect = ({ authRequired, redirectTo, getServerSideProps, cookieOptions }) => {
  return withPageAuth({
    authRequired,
    redirectTo,
    getServerSideProps: async (context, supabaseClient) => {
      const { req, res } = context;
      const props = await getServerSideProps(context, supabaseClient);
    },
    cookieOptions,
  });
};

export default withPageBanProtect;
