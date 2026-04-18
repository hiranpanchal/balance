import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin/bookings", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
