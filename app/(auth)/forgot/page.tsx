import Link from "next/link";
import ForgotForm from "./ForgotForm";

export default function ForgotPage() {
  return (
    <section className="auth-card">
      <p className="eyebrow">Password reset</p>
      <h1 className="auth-card__title">Forgot password</h1>
      <p className="auth-card__lede">
        Enter the email tied to your R.A.T.S. account and we will send a reset
        link.
      </p>

      <ForgotForm />

      <div className="auth-card__links">
        <Link href="/login">Back to log in</Link>
      </div>
    </section>
  );
}
