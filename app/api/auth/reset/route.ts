import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, eq, isNull, gt } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { hashToken } from "@/lib/auth-utils";

const Body = z.object({
  token: z.string().min(10),
  password: z.string().min(10).max(200)
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.token);

  const rows = await db
    .select()
    .from(schema.passwordResets)
    .where(
      and(
        eq(schema.passwordResets.tokenHash, tokenHash),
        isNull(schema.passwordResets.usedAt),
        gt(schema.passwordResets.expiresAt, new Date())
      )
    )
    .limit(1);

  const record = rows[0];
  if (!record) {
    return NextResponse.json(
      { error: "This reset link is invalid or expired." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);

  await db
    .update(schema.users)
    .set({ passwordHash })
    .where(eq(schema.users.id, record.userId));

  await db
    .update(schema.passwordResets)
    .set({ usedAt: new Date() })
    .where(eq(schema.passwordResets.id, record.id));

  return NextResponse.json({ ok: true });
}
