import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { disconnect, isProvider } from "@/lib/connections";

type RouteContext = { params: Promise<{ provider: string }> };

export async function POST(_req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await ctx.params;
  if (!isProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  await disconnect(session.user.id, provider);
  return NextResponse.json({ ok: true });
}
