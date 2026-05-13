import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { callbackUrl, issueState } from "@/lib/connections";
import { env } from "@/lib/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(callbackUrl("/login?next=/account/connections"));
  }

  const state = await issueState("xbox");

  const params = new URLSearchParams({
    client_id: env.microsoftClientId,
    response_type: "code",
    redirect_uri: callbackUrl("/api/connections/xbox/callback"),
    scope: "XboxLive.signin offline_access",
    state
  });

  return NextResponse.redirect(
    `https://login.live.com/oauth20_authorize.srf?${params.toString()}`
  );
}
