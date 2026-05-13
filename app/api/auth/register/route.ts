import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";

const Body = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(200),
  name: z.string().trim().min(1).max(80).optional()
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Email and a password of at least 10 characters are required." },
      { status: 400 }
    );
  }

  const email = parsed.email.trim().toLowerCase();

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);

  await db.insert(schema.users).values({
    email,
    name: parsed.name,
    passwordHash
  });

  return NextResponse.json({ ok: true });
}
