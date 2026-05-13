# R.A.T.S.

Raiders' Authority on Temporary Storage is a Vercel-ready recruitment site for an ARC Raiders player organization. It includes:

- A satirical brutalist homepage.
- Email + password registration and login.
- TOTP two-factor authentication with recovery codes.
- Password reset over email.
- Account settings for connecting Steam, Epic Games, Xbox, and PlayStation profiles.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Auth.js v5 with the Drizzle adapter, Credentials provider, and JWT sessions
- Drizzle ORM over Neon serverless Postgres
- Resend for transactional email
- `otplib` + `qrcode` for TOTP
- `bcryptjs` for password hashing

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run db:generate` emits a SQL migration from the schema.
- `npm run db:push` pushes the schema to the database without writing a migration.
- `npm run db:migrate` applies generated migrations.

## Setup

1. Copy `.env.example` to `.env` and fill in the values:
   - `DATABASE_URL` (Neon Postgres connection string with `?sslmode=require`).
   - `AUTH_SECRET` (generate with `npx auth secret`).
   - `AUTH_URL` (your deployment URL; defaults to `http://localhost:3000`).
   - `RESEND_API_KEY` and `EMAIL_FROM` (verified Resend sender).
   - Provider keys as you enable them (see below).
2. Push the schema:

   ```bash
   npm run db:push
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Provider configuration

### Steam (OpenID 2.0)

Steam does not use OAuth; no client secret is required. Optionally set `STEAM_API_KEY` (https://steamcommunity.com/dev/apikey) so the connection page can show the player's display name and avatar.

### Epic Games (OAuth)

1. Register a new Application at https://dev.epicgames.com/portal/.
2. Add `https://YOUR_DOMAIN/api/connections/epic/callback` (and the localhost equivalent) as a redirect URI.
3. Set `EPIC_CLIENT_ID` and `EPIC_CLIENT_SECRET`.

### Xbox (Microsoft OAuth + XBL/XSTS)

1. Register an Application in Microsoft Entra at https://entra.microsoft.com (choose "Personal Microsoft accounts" as supported account type).
2. Add `https://YOUR_DOMAIN/api/connections/xbox/callback` (and localhost) as a redirect URI.
3. Set `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET`.
4. The connection flow requests the `XboxLive.signin offline_access` scopes and then exchanges the Microsoft access token with `user.auth.xboxlive.com` and `xsts.auth.xboxlive.com` to retrieve the XUID and gamertag.

### PlayStation (manual)

Sony does not offer a public OAuth flow, so PSN Online IDs are entered manually and stored as Unverified.

## Deployment

Import the repo in Vercel and accept the default Next.js settings. Set every variable from `.env.example` in the Vercel project before promoting a deployment.

`npm run db:push` (or `npm run db:migrate` against generated migrations) must be run against the production database before users can register.
