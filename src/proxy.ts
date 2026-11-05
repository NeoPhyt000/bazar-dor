import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Keep the database-backed auth implementation in the Node.js API route.
  // Importing it here pulls MongoDB into Netlify's Edge middleware bundle.
  const response = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to validate the session");
  }

  const session = await response.json();

  if (!session?.session || !session?.user) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile", "/profile/update-profile"], // routes that require login
};
