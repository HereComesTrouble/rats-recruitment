import { Resend } from "resend";
import { env } from "./env";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(env.resendApiKey);
  }
  return _resend;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  resetUrl: string;
  expiresInMinutes: number;
}): Promise<void> {
  const safeUrl = escapeHtml(opts.resetUrl);
  const html = `<!doctype html>
<html>
  <body style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; background:#0b0e0a; color:#f3f7e8; padding:32px;">
    <table style="max-width:560px;margin:0 auto;background:#14180f;border:1px solid rgba(202,255,112,0.22);border-radius:16px;padding:32px;">
      <tr><td>
        <h1 style="margin:0 0 16px;font-size:24px;letter-spacing:0.06em;text-transform:uppercase;color:#caff70;">R.A.T.S. Password Reset</h1>
        <p style="margin:0 0 16px;line-height:1.6;">A password reset was requested for your R.A.T.S. account. If this was you, click the button below within ${opts.expiresInMinutes} minutes.</p>
        <p style="margin:24px 0;">
          <a href="${safeUrl}" style="display:inline-block;padding:12px 20px;background:#caff70;color:#111608;text-decoration:none;font-weight:800;border-radius:999px;">Reset password</a>
        </p>
        <p style="margin:0 0 8px;color:#b6bfa6;font-size:13px;">Or copy this link:</p>
        <p style="margin:0;word-break:break-all;color:#b6bfa6;font-size:13px;">${safeUrl}</p>
        <p style="margin:32px 0 0;color:#b6bfa6;font-size:12px;">If you did not request a password reset, you can safely ignore this email.</p>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `R.A.T.S. password reset

A password reset was requested for your account. If this was you, open the link below within ${opts.expiresInMinutes} minutes:

${opts.resetUrl}

If you did not request a password reset, you can safely ignore this email.`;

  await getResend().emails.send({
    from: env.emailFrom,
    to: opts.to,
    subject: "Reset your R.A.T.S. password",
    html,
    text
  });
}
