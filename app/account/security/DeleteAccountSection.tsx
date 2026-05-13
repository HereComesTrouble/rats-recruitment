"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type Phase = "idle" | "confirm" | "credentials";

export default function DeleteAccountSection({
  mfaEnabled
}: {
  mfaEnabled: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function reset() {
    setPhase("idle");
    setPassword("");
    setCode("");
    setError(null);
  }

  async function submitDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          ...(mfaEnabled ? { code } : {})
        })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not delete your account.");
        return;
      }
      await signOut({ redirectTo: "/" });
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="account-danger-zone">
      <h2>Delete account</h2>
      <p>
        Permanently delete your R.A.T.S. account, security settings, linked
        profiles, and Exemplar submissions. This cannot be reversed.
      </p>

      {phase === "idle" ? (
        <button
          type="button"
          className="button button--danger"
          onClick={() => setPhase("confirm")}
        >
          Delete account
        </button>
      ) : null}

      {phase === "confirm" ? (
        <div className="account-danger-zone__confirm">
          <p className="account-danger-zone__warn">
            Are you sure? Your account and all associated data will be removed
            immediately.
          </p>
          <div className="account-danger-zone__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={reset}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={() => setPhase("credentials")}
            >
              I understand — continue
            </button>
          </div>
        </div>
      ) : null}

      {phase === "credentials" ? (
        <form className="form-stack" onSubmit={submitDelete} noValidate>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {mfaEnabled ? (
            <label className="form-field">
              <span>2FA code or recovery code</span>
              <input
                type="text"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <div className="account-danger-zone__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={reset}
              disabled={busy}
            >
              Cancel
            </button>
            <button className="button button--danger" type="submit" disabled={busy}>
              {busy ? "Deleting..." : "Permanently delete account"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
