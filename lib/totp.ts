import { generateSecret, generateURI, verifySync } from "otplib";
import crypto from "node:crypto";

export function generateTotpSecret(): string {
  return generateSecret();
}

export function buildOtpAuthUrl(opts: {
  secret: string;
  account: string;
  issuer?: string;
}): string {
  const issuer = opts.issuer ?? "R.A.T.S.";
  return generateURI({
    strategy: "totp",
    issuer,
    label: opts.account,
    secret: opts.secret
  });
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({
      secret,
      token: token.trim(),
      epochTolerance: 30
    });
    return Boolean(result?.valid);
  } catch {
    return false;
  }
}

export function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(5).toString("hex").toUpperCase();
    codes.push(`${bytes.slice(0, 5)}-${bytes.slice(5, 10)}`);
  }
  return codes;
}

export function hashRecoveryCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}
