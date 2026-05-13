import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountMenu from "./AccountMenu";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=/account");
  }

  return (
    <div className="account-shell">
      <header className="account-shell__header">
        <Link href="/" className="account-shell__brand">
          R.A.T.S.
        </Link>
        <nav className="account-shell__nav" aria-label="Account">
          <Link href="/account">Overview</Link>
        </nav>
        <AccountMenu />
      </header>
      <main className="account-shell__main">{children}</main>
    </div>
  );
}
