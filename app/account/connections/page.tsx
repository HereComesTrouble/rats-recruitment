import { auth } from "@/auth";
import { listConnections } from "@/lib/connections";
import type { ConnectionProvider } from "@/db/schema";
import ConnectionsClient from "./ConnectionsClient";

export default async function ConnectionsPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const all = await listConnections(session.user.id);
  const byProvider: Record<
    ConnectionProvider,
    { displayName: string | null; verified: boolean } | null
  > = {
    steam: null,
    epic: null,
    xbox: null,
    playstation: null
  };
  for (const conn of all) {
    const key = conn.provider as ConnectionProvider;
    if (key in byProvider) {
      byProvider[key] = {
        displayName: conn.displayName,
        verified: conn.verified === 1
      };
    }
  }

  const params = await searchParams;

  return (
    <section className="account-section">
      <p className="eyebrow">Linked accounts</p>
      <h1 className="account-section__title">Console connections</h1>
      <p className="account-section__lede">
        Link your Steam, Epic Games, Xbox, and PlayStation accounts so the
        Authority can verify your raids across platforms.
      </p>

      <ConnectionsClient
        connections={byProvider}
        message={params.message ?? null}
        status={(params.status === "ok" || params.status === "error") ? params.status : null}
      />
    </section>
  );
}
