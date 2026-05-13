"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "idle" | "enrolling" | "showing-codes";

type SetupResponse = {
  secret: string;
  otpauthUrl: string;
  qrDataUrl: string;
};

export default function SecurityClient({
  email,
  mfaEnabled
}: {
  email: string;
  mfaEnabled: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [setup, setSetup] = useState<SetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);

  async function beginSetup() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/mfa/setup", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not start 2FA setup.");
        return;
      }
      const data = (await res.json()) as SetupResponse;
      setSetup(data);
      setMode("enrolling");
    } finally {
      setBusy(false);
    }
  }

  async function verifySetup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "That code didn't match.");
        return;
      }
      const data = (await res.json()) as { recoveryCodes: string[] };
      setRecoveryCodes(data.recoveryCodes);
      setMode("showing-codes");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function disable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisableError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword, code: disableCode })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setDisableError(data.error ?? "Could not disable 2FA.");
        return;
      }
      setDisablePassword("");
      setDisableCode("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (mfaEnabled) {
    return (
      <div className="account-card">
        <h2>Two-factor authentication is enabled</h2>
        <p>
          Logged-in account: <strong>{email}</strong>
        </p>
        <p>
          To disable 2FA, confirm your password and a current 2FA code (or a
          recovery code).
        </p>
        <form className="form-stack" onSubmit={disable}>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>2FA code or recovery code</span>
            <input
              type="text"
              inputMode="text"
              required
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
            />
          </label>
          {disableError ? <p className="form-error">{disableError}</p> : null}
          <button className="button button--danger" type="submit" disabled={busy}>
            {busy ? "Working..." : "Disable 2FA"}
          </button>
        </form>
      </div>
    );
  }

  if (mode === "showing-codes") {
    return (
      <div className="account-card">
        <h2>Save your recovery codes</h2>
        <p>
          These one-time recovery codes can be used in place of your
          authenticator. Store them somewhere safe; you will not see them
          again.
        </p>
        <ul className="recovery-codes">
          {recoveryCodes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <button
          className="button button--primary"
          type="button"
          onClick={() => {
            setRecoveryCodes([]);
            setMode("idle");
            router.refresh();
          }}
        >
          I have saved them
        </button>
      </div>
    );
  }

  if (mode === "enrolling" && setup) {
    return (
      <div className="account-card">
        <h2>Scan to enroll</h2>
        <p>
          Scan this QR code with your authenticator app, then enter the
          6-digit code it generates.
        </p>
        <Image
          src={setup.qrDataUrl}
          alt="2FA QR code"
          width={192}
          height={192}
          unoptimized
        />
        <p className="account-secret">
          Manual key: <code>{setup.secret}</code>
        </p>
        <form className="form-stack" onSubmit={verifySetup}>
          <label className="form-field">
            <span>6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button button--primary" type="submit" disabled={busy}>
            {busy ? "Verifying..." : "Verify and enable"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="account-card">
      <h2>Two-factor authentication is disabled</h2>
      <p>
        Add an authenticator-app code to your login flow for extra protection.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button button--primary" type="button" onClick={beginSetup} disabled={busy}>
        {busy ? "Starting..." : "Set up 2FA"}
      </button>
    </div>
  );
}
