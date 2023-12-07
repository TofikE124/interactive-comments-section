import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/comments", request.url));
}

export const config = {
  matcher: "/",
};
