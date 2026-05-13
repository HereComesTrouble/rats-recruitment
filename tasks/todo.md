# R.A.T.S. Website Task Review

## Implementation Checklist

- [x] Create a new Next.js TypeScript/Tailwind app structure in the workspace.
- [x] Draft the R.A.T.S. homepage/recruitment copy and page sections.
- [x] Implement responsive sci-fi landing page styling with accessible contrast.
- [x] Add metadata and Vercel-ready scripts/configuration.
- [x] Install/build/lint the project and document verification results.

## Auth & Console Linking

- [x] Add Auth.js, Drizzle, Neon, otplib, qrcode, zod, Resend, and bcryptjs dependencies.
- [x] Define Drizzle schema for Auth.js tables plus `passwordResets` and `connectedAccounts`.
- [x] Implement Auth.js v5 config with Credentials provider that gates TOTP, middleware for `/account/*`, and the catch-all NextAuth route.
- [x] Build registration, password forgot/reset routes, and the Resend password-reset email.
- [x] Build TOTP setup/verify/disable routes and the Security settings UI (QR code + recovery codes).
- [x] Build Steam (OpenID 2.0), Epic Games (OAuth), Xbox (Microsoft OAuth + XBL/XSTS), and PlayStation (manual entry) connection flows plus a unified disconnect route.
- [x] Add login/register/forgot/reset pages and an account hub with Security and Connections sub-pages.
- [x] Add a top-right Log in / Account link to the homepage.
- [x] Run lint, typecheck, and build.

## Manual Test Plan

Before deploying to Vercel, complete this run-through against a real Neon database and Resend account:

1. Provision a Neon Postgres database and a Resend API key. Populate `.env` from `.env.example` with `DATABASE_URL`, `AUTH_SECRET` (`npx auth secret`), `RESEND_API_KEY`, `EMAIL_FROM`, and any provider keys you intend to test.
2. Generate and apply the schema: `npm run db:generate` followed by `npm run db:push`.
3. `npm run dev` and exercise:
   - Visit `/register`, create an account, then sign in via `/login`.
   - Log out, visit `/forgot`, request a reset, click the email link, set a new password, log in.
   - From `/account/security`, set up 2FA (scan the QR with an authenticator app, enter the 6-digit code, save the recovery codes). Log out and log in again: the form should reveal the 2FA field after email/password.
   - Disable 2FA from `/account/security` using password + a current 2FA code or a recovery code.
   - Visit `/account/connections`:
     - Click **Connect Steam** and complete the Steam OpenID redirect.
     - Click **Connect Epic Games** and complete the Epic OAuth redirect.
     - Click **Connect Xbox** and complete the Microsoft OAuth + Xbox Live + XSTS exchange.
     - Enter a PSN Online ID and confirm it stores as Unverified.
   - Disconnect each provider individually.
4. Visit `/account` while logged out and confirm middleware redirects to `/login?next=/account`.

## Known Limitations

- PlayStation accounts are stored manually because Sony does not expose a public OAuth flow. They are flagged Unverified in the UI.
- Steam OpenID does not require a Steam Web API key; supplying `STEAM_API_KEY` upgrades the stored display name and avatar.
- Email magic-link login and SMS 2FA are out of scope. Only password + TOTP is supported.
- Rate limiting is not enforced. Production deployments should add Upstash or Vercel KV in front of the auth and connection endpoints.

## Review

Verification completed with:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

All routes compile, including 11 new auth/connection API routes, the `/account/*` server-rendered pages, and the `/(auth)/*` route group.
