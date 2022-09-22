import { setCookie } from "cookies-next";

/**
 * TODO: Use auth-helpers.
 *
 * As of 22-09-2021, auth-helpers is not compatible with supabase-js 2.0 RC.
 */

/** @type {import("next").NextApiHandler} */
export default async function handler(req, res) {
  // console.log(req.headers);
  console.log("ABCC");
  if (req.method === "POST") {
    /**
     * References:
     * (Will be outdated in the future)
     *
     * API handler to set cookie: https://blog.bitsrc.io/setting-up-server-side-auth-with-supabase-and-nextjs-15cbe98956a9
     * Setting auth cookie under the hood: https://github.com/supabase/gotrue-js/blob/master/src/GoTrueApi.ts#L503
     * Cookie constants: https://github.com/supabase/gotrue-js/blob/master/src/lib/constants.ts
     */
    setCookie("access_token", req.body.session.access_token, {
      req,
      res,
      maxAge: 60 * 60 * 8, // 8 hours based on the defaults of supabase GoTrue client.
    });
    setCookie("refresh_token", req.body.session.refresh_token, {
      req,
      res,
      maxAge: 60 * 60 * 8, // 8 hours based on the defaults of supabase GoTrue client.
    });

    res.status(204).end();
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
}
