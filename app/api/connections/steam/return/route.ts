import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { callbackUrl, upsertConnection } from "@/lib/connections";
import { env } from "@/lib/env";

const STEAM_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login";
const CLAIMED_ID_RE =
  /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;

function redirectTo(path: string, message?: string, status?: "ok" | "error") {
  const url = new URL(callbackUrl(path));
  if (message) url.searchParams.set("message", message);
  if (status) url.searchParams.set("status", status);
  return NextResponse.redirect(url);
}

async function fetchSteamProfile(steamId: string): Promise<{
  displayName?: string;
  avatarUrl?: string;
}> {
  const apiKey = env.steamApiKey;
  if (!apiKey) return {};

  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return {};
    const data = (await res.json()) as {
      response?: {
        players?: Array<{ personaname?: string; avatarfull?: string }>;
      };
    };
    const player = data.response?.players?.[0];
    return {
      displayName: player?.personaname,
      avatarUrl: player?.avatarfull
    };
  } catch {
    return {};
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirectTo("/login?next=/account/connections");
  }

  const url = new URL(req.url);
  const params = new URLSearchParams();
  url.searchParams.forEach((value, key) => params.set(key, value));
  params.set("openid.mode", "check_authentication");

  let validateText: string;
  try {
    const res = await fetch(STEAM_OPENID_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store"
    });
    validateText = await res.text();
  } catch {
    return redirectTo("/account/connections", "Could not reach Steam.", "error");
  }

  if (!/is_valid\s*:\s*true/i.test(validateText)) {
    return redirectTo(
      "/account/connections",
      "Steam did not confirm the sign-in.",
      "error"
    );
  }

  const claimedId = url.searchParams.get("openid.claimed_id") ?? "";
  const match = claimedId.match(CLAIMED_ID_RE);
  if (!match) {
    return redirectTo(
      "/account/connections",
      "Could not read your Steam ID from the response.",
      "error"
    );
  }

  const steamId = match[1];
  const profile = await fetchSteamProfile(steamId);

  await upsertConnection({
    userId: session.user.id,
    provider: "steam",
    providerAccountId: steamId,
    displayName: profile.displayName ?? `Steam user ${steamId}`,
    avatarUrl: profile.avatarUrl ?? null,
    verified: true
  });

  return redirectTo("/account/connections", "Steam connected.", "ok");
}
