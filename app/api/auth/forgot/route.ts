import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { env } from "@/lib/env";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateOpaqueToken, hashToken } from "@/lib/auth-utils";

const Body = z.object({
  email: z.string().email().max(254)
});

const TOKEN_TTL_MINUTES = 30;

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: true });
  }

  const email = parsed.email.trim().toLowerCase();

  const rows = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  const user = rows[0];
  if (user) {
    const token = generateOpaqueToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await db.insert(schema.passwordResets).values({
      userId: user.id,
      tokenHash,
      expiresAt
    });

    const resetUrl = `${env.authUrl.replace(/\/$/, "")}/reset/${token}`;

    try {
      await sendPasswordResetEmail({
        to: email,
        resetUrl,
        expiresInMinutes: TOKEN_TTL_MINUTES
      });
    } catch (err) {
      console.error("Failed to send password reset email", err);
    }
  }

  return NextResponse.json({ ok: true });
}
