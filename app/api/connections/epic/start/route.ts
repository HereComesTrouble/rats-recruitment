import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { callbackUrl, issueState } from "@/lib/connections";
import { env } from "@/lib/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(callbackUrl("/login?next=/account/connections"));
  }

  const state = await issueState("epic");

  const params = new URLSearchParams({
    client_id: env.epicClientId,
    response_type: "code",
    scope: "basic_profile",
    redirect_uri: callbackUrl("/api/connections/epic/callback"),
    state
  });

  return NextResponse.redirect(
    `https://www.epicgames.com/id/authorize?${params.toString()}`
  );
}
