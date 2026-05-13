# Lessons

## Auth & Console Linking build

- `@auth/drizzle-adapter` uses `drizzle-orm`'s symbol-based `is(db, PgDatabase)` check, so the `db` value must be a real Drizzle instance. A Proxy wrapper that defers initialization fails the type check at module load. Initialize Drizzle eagerly with a placeholder connection string when `DATABASE_URL` is unset so that builds without environment variables still succeed.
- `otplib@13` removed the `authenticator` named export in favor of functional helpers (`generateSecret`, `generateURI`, `verifySync`). When upgrading older code, expect breakage and replace the API.
- Next.js 16 typecheck (without a prior build) does not include the CSS module declarations from `.next/types`. Add a small ambient declaration like `declare module "*.css";` in a `globals.d.ts` so `import "./globals.css"` typechecks without running `next build` first.
- `bcryptjs` is a safer default than `argon2` in Next.js apps deployed to Vercel because it has no native bindings and runs in any runtime. Use 12 cost factor as a reasonable default.
- Auth.js v5 splits `auth.config.ts` (edge-safe, used by middleware) from `auth.ts` (full config with database/adapter). Keep DB and bcrypt imports out of the edge config or middleware will refuse to compile.
- For two-factor login with the Credentials provider, the cleanest pattern is a separate precheck endpoint (`/api/auth/precheck`) that returns `{ mfaRequired }`. This avoids relying on `CredentialsSignin` error-code propagation in `signIn()` responses, which has shifted between Auth.js releases.
