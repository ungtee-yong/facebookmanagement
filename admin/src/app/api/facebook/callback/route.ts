import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Placeholder: in the next step we will exchange `code` for an access token,
  // list pages, store page tokens, and subscribe to webhook.
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ ok: false, error, details: Object.fromEntries(url.searchParams) });
  }

  return NextResponse.json({
    ok: true,
    message: "Facebook callback received (not implemented yet)",
    codePresent: Boolean(code),
  });
}
