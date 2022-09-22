import { setCookie } from "cookies-next";
import { getSupabase } from "../../../utils/supabase-client";

/**
 * TODO: Use auth-helpers.
 *
 * As of 22-09-2021, auth-helpers is not compatible with supabase-js 2.0 RC.
 */

// Adapted from https://github.com/supabase/auth-helpers/blob/main/packages/nextjs/src/handlers/logout.ts
/** @type {import("next").NextApiHandler} */
export default async function handler(req, res) {
  // Prepare redirect.
  let { returnTo } = req.query;
  if (!returnTo) returnTo = "/";
  returnTo = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  returnTo = returnTo.charAt(0) === "/" ? returnTo : `/${returnTo}`;

  //   console.log(req.cookies["access_token"]);
  //   console.log("ENEBHDRNRN");
  const supabaseClient = getSupabase(req.cookies["access_token"]);
  await supabaseClient.auth.signOut();

  // Clear the tokens.
  setCookie("access_token", "", {
    req,
    res,
  });
  setCookie("refresh_token", "", {
    req,
    res,
  });

  // Redirect to the returnTo URL.
  res.redirect(returnTo);
}
