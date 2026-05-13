import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { hashRecoveryCode, verifyTotp } from "@/lib/totp";

const Body = z.object({
  password: z.string().min(1),
  code: z.string().optional()
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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
  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "This account cannot be deleted this way." },
      { status: 400 }
    );
  }

  const passwordOk = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!passwordOk) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  if (user.totpEnabledAt && user.totpSecret) {
    const code = (parsed.code ?? "").trim();
    if (!code) {
      return NextResponse.json(
        { error: "Enter your 2FA code or a recovery code to delete your account." },
        { status: 400 }
      );
    }
    let accepted = false;
    if (/^\d{6}$/.test(code) && verifyTotp(code, user.totpSecret)) {
      accepted = true;
    } else if (user.recoveryCodes?.includes(hashRecoveryCode(code))) {
      accepted = true;
    }
    if (!accepted) {
      return NextResponse.json(
        { error: "Invalid 2FA or recovery code." },
        { status: 400 }
      );
    }
  }

  await db.delete(schema.users).where(eq(schema.users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
