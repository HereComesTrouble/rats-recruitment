import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { isAdmin } from "@/lib/admin";

const Body = z.object({
  status: z.enum(["approved", "rejected"]),
  feedback: z.string().trim().max(2000).nullable().optional()
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Provide a status of approved or rejected." },
      { status: 400 }
    );
  }

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const feedback =
    parsed.feedback === undefined || parsed.feedback === null
      ? null
      : parsed.feedback.trim() || null;

  const updated = await db
    .update(schema.exemplarSubmissions)
    .set({
      status: parsed.status,
      feedback,
      reviewedAt: new Date(),
      reviewedBy: session.user.id
    })
    .where(eq(schema.exemplarSubmissions.id, id))
    .returning({ id: schema.exemplarSubmissions.id });

  if (updated.length === 0) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
