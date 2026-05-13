import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { extractYoutubeId } from "@/lib/youtube";

const Body = z.object({
  operativeType: z.enum(["auditor", "surgeon", "guardian", "distributor"]),
  youtubeUrl: z.string().trim().min(1).max(500)
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Pick an operative type and provide a YouTube link." },
      { status: 400 }
    );
  }

  const youtubeId = extractYoutubeId(parsed.youtubeUrl);
  if (!youtubeId) {
    return NextResponse.json(
      {
        error:
          "That doesn't look like a YouTube URL. Use youtube.com/watch, youtu.be, /shorts, /embed, or /live."
      },
      { status: 400 }
    );
  }

  await db.insert(schema.exemplarSubmissions).values({
    userId: session.user.id,
    email: session.user.email,
    operativeType: parsed.operativeType,
    youtubeUrl: parsed.youtubeUrl,
    youtubeId,
    status: "pending"
  });

  return NextResponse.json({ ok: true });
}
