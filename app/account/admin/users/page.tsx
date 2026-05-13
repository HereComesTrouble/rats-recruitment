import { count, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import AdminUsersClient, { type AdminUserRow } from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const userRows = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      totpEnabledAt: schema.users.totpEnabledAt,
      createdAt: schema.users.createdAt
    })
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt));

  const connectionGroups = await db
    .select({
      userId: schema.connectedAccounts.userId,
      n: count(schema.connectedAccounts.id)
    })
    .from(schema.connectedAccounts)
    .groupBy(schema.connectedAccounts.userId);

  const exemplarGroups = await db
    .select({
      userId: schema.exemplarSubmissions.userId,
      n: count(schema.exemplarSubmissions.id)
    })
    .from(schema.exemplarSubmissions)
    .groupBy(schema.exemplarSubmissions.userId);

  const connectionsByUser = new Map(
    connectionGroups.map((r) => [r.userId, Number(r.n)])
  );
  const exemplarByUser = new Map(exemplarGroups.map((r) => [r.userId, Number(r.n)]));

  const users: AdminUserRow[] = userRows.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    mfaEnabled: Boolean(u.totpEnabledAt),
    createdAt: u.createdAt.toISOString(),
    connections: connectionsByUser.get(u.id) ?? 0,
    exemplarSubmissions: exemplarByUser.get(u.id) ?? 0
  }));

  return (
    <section className="account-section">
      <p className="eyebrow">Admin tools</p>
      <h1 className="account-section__title">User management</h1>
      <p className="account-section__lede">
        All registered accounts. Delete permanently removes the user and their
        data (same as self-service delete). You cannot delete your own account
        here.
      </p>
      <AdminUsersClient users={users} currentUserId={currentUserId} />
    </section>
  );
}
