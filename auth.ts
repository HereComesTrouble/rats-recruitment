import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { authConfig } from "./auth.config";
import { verifyTotp, hashRecoveryCode } from "@/lib/totp";

export class MfaRequiredError extends Error {
  code = "MFA_REQUIRED";
  constructor() {
    super("MFA_REQUIRED");
  }
}

export class InvalidCodeError extends Error {
  code = "INVALID_CODE";
  constructor() {
    super("INVALID_CODE");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens
  }),
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        totp: { type: "text" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        const totp = credentials?.totp ? String(credentials.totp).trim() : "";

        if (!email || !password) return null;

        const rows = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);
        const user = rows[0];
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        if (user.totpEnabledAt && user.totpSecret) {
          if (!totp) {
            throw new MfaRequiredError();
          }

          const digitsOnly = totp.replace(/\D/g, "");
          let accepted = false;

          if (digitsOnly.length === 6 && verifyTotp(digitsOnly, user.totpSecret)) {
            accepted = true;
          } else if (user.recoveryCodes && user.recoveryCodes.length > 0) {
            const provided = hashRecoveryCode(totp);
            const idx = user.recoveryCodes.indexOf(provided);
            if (idx >= 0) {
              const remaining = [...user.recoveryCodes];
              remaining.splice(idx, 1);
              await db
                .update(schema.users)
                .set({ recoveryCodes: remaining })
                .where(eq(schema.users.id, user.id));
              accepted = true;
            }
          }

          if (!accepted) {
            throw new InvalidCodeError();
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined
        };
      }
    })
  ]
});
