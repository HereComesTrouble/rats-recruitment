import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <header className="auth-shell__header">
        <Link href="/" className="auth-shell__brand">
          R.A.T.S.
        </Link>
      </header>
      <main className="auth-shell__main">{children}</main>
    </div>
  );
}
