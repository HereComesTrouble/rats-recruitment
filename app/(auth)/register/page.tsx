import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <section className="auth-card">
      <p className="eyebrow">Recruitment desk</p>
      <h1 className="auth-card__title">Create account</h1>
      <p className="auth-card__lede">
        Register to manage your R.A.T.S. profile and link your console accounts.
      </p>

      <RegisterForm />

      <div className="auth-card__links">
        <Link href="/login">Already have an account?</Link>
      </div>
    </section>
  );
}
