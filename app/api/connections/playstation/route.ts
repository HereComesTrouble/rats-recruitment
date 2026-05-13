import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { upsertConnection } from "@/lib/connections";

const PSN_ID_RE = /^[A-Za-z][A-Za-z0-9_-]{2,15}$/;

const Body = z.object({
  onlineId: z
    .string()
    .trim()
    .regex(
      PSN_ID_RE,
      "PSN Online IDs are 3-16 characters, start with a letter, and use letters, numbers, hyphens, or underscores."
    )
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues[0]?.message ?? "Invalid PSN Online ID."
        : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await upsertConnection({
    userId: session.user.id,
    provider: "playstation",
    providerAccountId: parsed.onlineId.toLowerCase(),
    displayName: parsed.onlineId,
    avatarUrl: null,
    verified: false
  });

  return NextResponse.json({ ok: true });
}
