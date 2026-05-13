import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import SecurityClient from "./SecurityClient";

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user] = await db
    .select({
      email: schema.users.email,
      totpEnabledAt: schema.users.totpEnabledAt
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  return (
    <section className="account-section">
      <p className="eyebrow">Security</p>
      <h1 className="account-section__title">Account security</h1>
      <p className="account-section__lede">
        Two-factor authentication adds a second step at login using an
        authenticator app like 1Password, Authy, or Google Authenticator.
      </p>

      <SecurityClient
        email={user?.email ?? ""}
        mfaEnabled={Boolean(user?.totpEnabledAt)}
      />
    </section>
  );
}
