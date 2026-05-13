import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import {
  buildOtpAuthUrl,
  generateTotpSecret
} from "@/lib/totp";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      email: schema.users.email,
      totpEnabledAt: schema.users.totpEnabledAt
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  if (user.totpEnabledAt) {
    return NextResponse.json(
      { error: "Two-factor authentication is already enabled." },
      { status: 409 }
    );
  }

  const secret = generateTotpSecret();
  const otpauthUrl = buildOtpAuthUrl({ secret, account: user.email });
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  await db
    .update(schema.users)
    .set({ totpSecret: secret })
    .where(eq(schema.users.id, session.user.id));

  return NextResponse.json({
    secret,
    otpauthUrl,
    qrDataUrl
  });
}
