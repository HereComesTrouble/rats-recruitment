"use client";

import { useState } from "react";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <p className="form-success">
        If that email belongs to a R.A.T.S. account, a password reset link is
        on its way.
      </p>
    );
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <button className="button button--primary" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
