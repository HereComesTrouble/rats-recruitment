import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { listConnections } from "@/lib/connections";

export default async function AccountOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user] = await db
    .select({
      email: schema.users.email,
      name: schema.users.name,
      totpEnabledAt: schema.users.totpEnabledAt,
      createdAt: schema.users.createdAt
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  const connections = await listConnections(session.user.id);

  return (
    <section className="account-section">
      <p className="eyebrow">Authority profile</p>
      <h1 className="account-section__title">
        {user?.name?.trim() || user?.email}
      </h1>
      <p className="account-section__lede">
        Manage your security settings and console connections from this hub.
      </p>

      <dl className="account-stats">
        <div>
          <dt>Email</dt>
          <dd>{user?.email}</dd>
        </div>
        <div>
          <dt>Two-factor authentication</dt>
          <dd>{user?.totpEnabledAt ? "Enabled" : "Not enabled"}</dd>
        </div>
        <div>
          <dt>Linked accounts</dt>
          <dd>{connections.length} of 4</dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "-"}
          </dd>
        </div>
      </dl>

      <div className="account-shortcuts">
        <Link className="button button--secondary" href="/account/security">
          Security settings
        </Link>
        <Link className="button button--secondary" href="/account/connections">
          Manage connections
        </Link>
      </div>
    </section>
  );
}
