import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { verifyTotp, hashRecoveryCode } from "@/lib/totp";

const Body = z.object({
  password: z.string().min(1),
  code: z.string().min(6).max(32)
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rows = await db
    .select({
      passwordHash: schema.users.passwordHash,
      totpSecret: schema.users.totpSecret,
      totpEnabledAt: schema.users.totpEnabledAt,
      recoveryCodes: schema.users.recoveryCodes
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  const user = rows[0];
  if (!user?.passwordHash || !user.totpSecret || !user.totpEnabledAt) {
    return NextResponse.json(
      { error: "Two-factor authentication is not enabled." },
      { status: 400 }
    );
  }

  const passwordOk = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!passwordOk) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  const code = parsed.code.trim();
  let accepted = false;
  if (/^\d{6}$/.test(code) && verifyTotp(code, user.totpSecret)) {
    accepted = true;
  } else if (user.recoveryCodes?.includes(hashRecoveryCode(code))) {
    accepted = true;
  }

  if (!accepted) {
    return NextResponse.json(
      { error: "Invalid 2FA code." },
      { status: 400 }
    );
  }

  await db
    .update(schema.users)
    .set({
      totpSecret: null,
      totpEnabledAt: null,
      recoveryCodes: null
    })
    .where(eq(schema.users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
