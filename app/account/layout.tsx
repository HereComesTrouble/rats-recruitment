import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

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
          <Link href="/account/security">Security</Link>
          <Link href="/account/connections">Connections</Link>
        </nav>
        <form action={handleSignOut}>
          <button className="button button--ghost button--sm" type="submit">
            Log out
          </button>
        </form>
      </header>
      <main className="account-shell__main">{children}</main>
    </div>
  );
}
