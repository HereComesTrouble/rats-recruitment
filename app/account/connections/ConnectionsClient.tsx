"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ConnectionProvider } from "@/db/schema";

type ConnectionState = {
  displayName: string | null;
  verified: boolean;
} | null;

type Props = {
  connections: Record<ConnectionProvider, ConnectionState>;
  message: string | null;
  status: "ok" | "error" | null;
};

const META: Record<
  ConnectionProvider,
  {
    label: string;
    description: string;
    connect: string | null;
    comingSoon?: boolean;
  }
> = {
  steam: {
    label: "Steam",
    description: "Sign in via Steam OpenID. Verified through Steam itself.",
    connect: "/api/connections/steam/start"
  },
  epic: {
    label: "Epic Games",
    description: "Epic Games linking is coming soon.",
    connect: null,
    comingSoon: true
  },
  xbox: {
    label: "Xbox",
    description: "Xbox linking is coming soon.",
    connect: null,
    comingSoon: true
  },
  playstation: {
    label: "PlayStation",
    description:
      "Sony does not offer public OAuth, so PSN IDs are entered manually and marked unverified.",
    connect: null
  }
};

export default function ConnectionsClient({
  connections,
  message,
  status
}: Props) {
  const router = useRouter();
  const [psnId, setPsnId] = useState("");
  const [psnError, setPsnError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function disconnect(provider: ConnectionProvider) {
    setBusy(provider);
    try {
      const res = await fetch(`/api/connections/${provider}/disconnect`, {
        method: "POST"
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function submitPsn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPsnError(null);
    setBusy("playstation");
    try {
      const res = await fetch("/api/connections/playstation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onlineId: psnId })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setPsnError(data.error ?? "Could not save PSN ID.");
        return;
      }
      setPsnId("");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {message ? (
        <p
          className={
            status === "error" ? "form-error" : "form-success"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="connection-grid">
        {(Object.keys(META) as ConnectionProvider[]).map((provider) => {
          const meta = META[provider];
          const conn = connections[provider];
          return (
            <article className="connection-card" key={provider}>
              <header>
                <h3>{meta.label}</h3>
                {conn ? (
                  <span
                    className={
                      conn.verified
                        ? "badge badge--ok"
                        : "badge badge--warn"
                    }
                  >
                    {conn.verified ? "Verified" : "Unverified"}
                  </span>
                ) : meta.comingSoon ? (
                  <span className="badge badge--muted">Coming soon</span>
                ) : (
                  <span className="badge badge--muted">Not connected</span>
                )}
              </header>
              <p>{meta.description}</p>
              {conn ? (
                <p className="connection-card__id">
                  Linked as <strong>{conn.displayName ?? "Unknown"}</strong>
                </p>
              ) : null}

              {provider === "playstation" ? (
                conn ? (
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={() => disconnect(provider)}
                    disabled={busy === provider}
                  >
                    {busy === provider ? "Working..." : "Disconnect"}
                  </button>
                ) : (
                  <form className="form-stack form-stack--compact" onSubmit={submitPsn}>
                    <label className="form-field">
                      <span>PSN Online ID</span>
                      <input
                        type="text"
                        value={psnId}
                        onChange={(e) => setPsnId(e.target.value)}
                        required
                        maxLength={16}
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                    </label>
                    {psnError ? <p className="form-error">{psnError}</p> : null}
                    <button
                      className="button button--primary"
                      type="submit"
                      disabled={busy === "playstation"}
                    >
                      {busy === "playstation" ? "Saving..." : "Save PSN ID"}
                    </button>
                  </form>
                )
              ) : conn ? (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => disconnect(provider)}
                  disabled={busy === provider}
                >
                  {busy === provider ? "Working..." : "Disconnect"}
                </button>
              ) : meta.comingSoon ? (
                <button
                  className="button button--primary"
                  type="button"
                  disabled
                  aria-disabled="true"
                >
                  Coming soon
                </button>
              ) : (
                <a className="button button--primary" href={meta.connect ?? "#"}>
                  Connect {meta.label}
                </a>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
