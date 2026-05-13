"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Step = "credentials" | "totp";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (step === "credentials") {
        const res = await fetch("/api/auth/precheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.status === 401) {
          setError("Invalid email or password.");
          return;
        }
        if (!res.ok) {
          setError("Something went wrong. Try again.");
          return;
        }
        const data = (await res.json()) as { mfaRequired: boolean };
        if (data.mfaRequired) {
          setStep("totp");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        totp: step === "totp" ? totp : "",
        redirect: false
      });

      if (!result || result.error) {
        setError(
          step === "totp"
            ? "Invalid 2FA code. Use the current 6-digit code or a recovery code."
            : "Invalid email or password."
        );
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === "totp"}
        />
      </label>

      <label className="form-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={1}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={step === "totp"}
        />
      </label>

      {step === "totp" ? (
        <label className="form-field">
          <span>Two-factor code</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            required
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            placeholder="6-digit code or recovery code"
          />
        </label>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      <button
        className="button button--primary"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Working..." : step === "totp" ? "Verify code" : "Log in"}
      </button>

      {step === "totp" ? (
        <button
          className="button button--ghost"
          type="button"
          onClick={() => {
            setStep("credentials");
            setTotp("");
            setError(null);
          }}
        >
          Back
        </button>
      ) : null}
    </form>
  );
}
