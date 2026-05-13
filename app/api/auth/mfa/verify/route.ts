import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import {
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyTotp
} from "@/lib/totp";

const Body = z.object({
  code: z.string().regex(/^\d{6}$/)
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
    return NextResponse.json(
      { error: "Enter the 6-digit code from your authenticator app." },
      { status: 400 }
    );
  }

  const rows = await db
    .select({
      totpSecret: schema.users.totpSecret,
      totpEnabledAt: schema.users.totpEnabledAt
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  const user = rows[0];
  if (!user?.totpSecret) {
    return NextResponse.json(
      { error: "Begin 2FA setup before verifying a code." },
      { status: 400 }
    );
  }
  if (user.totpEnabledAt) {
    return NextResponse.json(
      { error: "Two-factor authentication is already enabled." },
      { status: 409 }
    );
  }

  if (!verifyTotp(parsed.code, user.totpSecret)) {
    return NextResponse.json(
      { error: "That code didn't match. Try again." },
      { status: 400 }
    );
  }

  const codes = generateRecoveryCodes();
  const hashedCodes = codes.map(hashRecoveryCode);

  await db
    .update(schema.users)
    .set({
      totpEnabledAt: new Date(),
      recoveryCodes: hashedCodes
    })
    .where(eq(schema.users.id, session.user.id));

  return NextResponse.json({ ok: true, recoveryCodes: codes });
}
