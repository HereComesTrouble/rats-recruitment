import Link from "next/link";
import ResetForm from "./ResetForm";

export default async function ResetPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <section className="auth-card">
      <p className="eyebrow">Password reset</p>
      <h1 className="auth-card__title">Set a new password</h1>
      <p className="auth-card__lede">
        Choose a new password for your R.A.T.S. account.
      </p>

      <ResetForm token={token} />

      <div className="auth-card__links">
        <Link href="/login">Back to log in</Link>
      </div>
    </section>
  );
}
