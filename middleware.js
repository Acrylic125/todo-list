import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// export const middleware = withMiddlewareAuth({
//   redirectTo: "/login",
//   // authGuard: {
//   //   isPermitted: async (user) => {
//   //     return user.userRole.role === "admin";
//   //   },
//   // },
// });

export const middleware = withMiddlewareAuth({
  redirectTo: "/login",
});

/**
 * @type {import("next/server").NextMiddleware}
 */
// export const middleware = async (request) => {
//   // NextResponse.redirect("/login");
// };
// export const middleware = async (request) => {
//   console.log("Middleware went through! ", request.url);
// };

export const config = {
  matcher: ["/basics/:path*"],
  // runtime: "experimental-edge",
  // matcher: ["/ignoreThis"],
};
