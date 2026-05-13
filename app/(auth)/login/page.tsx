import Link from "next/link";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/account";

  return (
    <section className="auth-card">
      <p className="eyebrow">Authority access</p>
      <h1 className="auth-card__title">Log in</h1>
      <p className="auth-card__lede">
        Sign in to manage your R.A.T.S. profile and linked console accounts.
      </p>

      <LoginForm next={next} />

      <div className="auth-card__links">
        <Link href="/forgot">Forgot password?</Link>
        <span aria-hidden="true">/</span>
        <Link href="/register">Create account</Link>
      </div>
    </section>
  );
}
