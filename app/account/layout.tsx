import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { isAdmin } from "@/lib/admin";
import AccountMenu from "./AccountMenu";
import ProfileButton from "./ProfileButton";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=/account");
  }

  const steam = await db
    .select({ avatarUrl: schema.connectedAccounts.avatarUrl })
    .from(schema.connectedAccounts)
    .where(
      and(
        eq(schema.connectedAccounts.userId, session.user.id),
        eq(schema.connectedAccounts.provider, "steam")
      )
    )
    .limit(1);

  const avatarUrl = steam[0]?.avatarUrl ?? null;
  const showAdmin = isAdmin(session.user.email);

  return (
    <div className="account-shell">
      <header className="account-shell__header">
        <Link href="/" className="account-shell__brand">
          R.A.T.S.
        </Link>
        <nav className="account-shell__nav" aria-label="Account">
          <Link href="/account/guides">Guides</Link>
          <Link href="/account/exemplar">Exemplar</Link>
          {showAdmin ? <Link href="/account/admin">Admin</Link> : null}
        </nav>
        <ProfileButton avatarUrl={avatarUrl} />
        <AccountMenu />
      </header>
      <main className="account-shell__main">{children}</main>
    </div>
  );
}
