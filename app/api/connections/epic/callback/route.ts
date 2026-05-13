import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { callbackUrl, consumeState, upsertConnection } from "@/lib/connections";
import { env } from "@/lib/env";

function redirectTo(path: string, message?: string, status?: "ok" | "error") {
  const url = new URL(callbackUrl(path));
  if (message) url.searchParams.set("message", message);
  if (status) url.searchParams.set("status", status);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirectTo("/login?next=/account/connections");
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const stateOk = await consumeState("epic", state);
  if (!code || !stateOk) {
    return redirectTo(
      "/account/connections",
      "Epic sign-in could not be verified. Try again.",
      "error"
    );
  }

  const basic = Buffer.from(
    `${env.epicClientId}:${env.epicClientSecret}`
  ).toString("base64");

  let tokenResponse: { access_token?: string } = {};
  try {
    const res = await fetch(
      "https://api.epicgames.dev/epic/oauth/v2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: callbackUrl("/api/connections/epic/callback")
        }).toString(),
        cache: "no-store"
      }
    );
    if (!res.ok) {
      return redirectTo(
        "/account/connections",
        "Epic refused the authorization code.",
        "error"
      );
    }
    tokenResponse = (await res.json()) as { access_token?: string };
  } catch {
    return redirectTo("/account/connections", "Could not reach Epic.", "error");
  }

  const accessToken = tokenResponse.access_token;
  if (!accessToken) {
    return redirectTo(
      "/account/connections",
      "Epic did not return an access token.",
      "error"
    );
  }

  let userInfo: {
    sub?: string;
    preferred_username?: string;
    display_name?: string;
  } = {};
  try {
    const res = await fetch(
      "https://api.epicgames.dev/epic/oauth/v2/userInfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store"
      }
    );
    if (res.ok) {
      userInfo = (await res.json()) as typeof userInfo;
    }
  } catch {
    // fall through; we'll require sub below
  }

  const epicId = userInfo.sub;
  if (!epicId) {
    return redirectTo(
      "/account/connections",
      "Could not read your Epic account ID.",
      "error"
    );
  }

  await upsertConnection({
    userId: session.user.id,
    provider: "epic",
    providerAccountId: epicId,
    displayName: userInfo.display_name ?? userInfo.preferred_username ?? null,
    avatarUrl: null,
    verified: true
  });

  return redirectTo("/account/connections", "Epic Games connected.", "ok");
}
