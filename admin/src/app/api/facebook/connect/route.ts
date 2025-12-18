import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", process.env.APP_URL || "http://localhost:3000"));
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: "FACEBOOK_APP_ID / FACEBOOK_REDIRECT_URI is not configured" },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();

  const url = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set(
    "scope",
    [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_manage_engagement",
    ].join(","),
  );

  return NextResponse.redirect(url);
}
