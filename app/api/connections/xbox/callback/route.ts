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

type MsToken = { access_token?: string };

type XblResponse = {
  Token?: string;
  DisplayClaims?: { xui?: Array<{ uhs?: string }> };
};

type XstsResponse = {
  Token?: string;
  DisplayClaims?: { xui?: Array<{ xid?: string; gtg?: string; uhs?: string }> };
};

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirectTo("/login?next=/account/connections");
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const stateOk = await consumeState("xbox", state);
  if (!code || !stateOk) {
    return redirectTo(
      "/account/connections",
      "Xbox sign-in could not be verified. Try again.",
      "error"
    );
  }

  let msToken: MsToken;
  try {
    const res = await fetch("https://login.live.com/oauth20_token.srf", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.microsoftClientId,
        client_secret: env.microsoftClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: callbackUrl("/api/connections/xbox/callback")
      }).toString(),
      cache: "no-store"
    });
    if (!res.ok) {
      return redirectTo(
        "/account/connections",
        "Microsoft refused the authorization code.",
        "error"
      );
    }
    msToken = (await res.json()) as MsToken;
  } catch {
    return redirectTo("/account/connections", "Could not reach Microsoft.", "error");
  }

  const accessToken = msToken.access_token;
  if (!accessToken) {
    return redirectTo(
      "/account/connections",
      "Microsoft did not return an access token.",
      "error"
    );
  }

  let xbl: XblResponse;
  try {
    const res = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-xbl-contract-version": "1"
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${accessToken}`
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT"
      }),
      cache: "no-store"
    });
    if (!res.ok) {
      return redirectTo(
        "/account/connections",
        "Xbox Live did not accept the Microsoft token.",
        "error"
      );
    }
    xbl = (await res.json()) as XblResponse;
  } catch {
    return redirectTo("/account/connections", "Could not reach Xbox Live.", "error");
  }

  if (!xbl.Token) {
    return redirectTo(
      "/account/connections",
      "Xbox Live did not return a token.",
      "error"
    );
  }

  let xsts: XstsResponse;
  try {
    const res = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-xbl-contract-version": "1"
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xbl.Token]
        },
        RelyingParty: "http://xboxlive.com",
        TokenType: "JWT"
      }),
      cache: "no-store"
    });
    if (!res.ok) {
      return redirectTo(
        "/account/connections",
        "XSTS authorization failed (account may not have an Xbox profile).",
        "error"
      );
    }
    xsts = (await res.json()) as XstsResponse;
  } catch {
    return redirectTo("/account/connections", "Could not reach XSTS.", "error");
  }

  const claims = xsts.DisplayClaims?.xui?.[0];
  const xuid = claims?.xid;
  const gamertag = claims?.gtg;
  if (!xuid) {
    return redirectTo(
      "/account/connections",
      "Could not read your Xbox profile.",
      "error"
    );
  }

  await upsertConnection({
    userId: session.user.id,
    provider: "xbox",
    providerAccountId: xuid,
    displayName: gamertag ?? null,
    avatarUrl: null,
    verified: true
  });

  return redirectTo("/account/connections", "Xbox connected.", "ok");
}
