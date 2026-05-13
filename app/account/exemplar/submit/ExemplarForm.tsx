"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isYoutubeUrl } from "@/lib/youtube";

const OPERATIVE_OPTIONS = [
  { value: "auditor", label: "Auditor" },
  { value: "surgeon", label: "Surgeon" },
  { value: "guardian", label: "Guardian" },
  { value: "distributor", label: "Distributor" }
] as const;

type OperativeValue = (typeof OPERATIVE_OPTIONS)[number]["value"];

export default function ExemplarForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [operativeType, setOperativeType] = useState<OperativeValue>("auditor");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const urlLooksValid = useMemo(
    () => youtubeUrl.length === 0 || isYoutubeUrl(youtubeUrl),
    [youtubeUrl]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isYoutubeUrl(youtubeUrl)) {
      setError(
        "Enter a valid YouTube URL (youtube.com/watch, youtu.be, /shorts, /embed, or /live)."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/exemplar/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operativeType, youtubeUrl })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not submit your gameplay.");
        return;
      }

      router.push("/account/exemplar/submitted");
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
          value={initialEmail}
          readOnly
          aria-readonly="true"
          autoComplete="email"
        />
        <small>This is the email tied to your R.A.T.S. account.</small>
      </label>

      <label className="form-field">
        <span>Operative type</span>
        <select
          value={operativeType}
          onChange={(e) => setOperativeType(e.target.value as OperativeValue)}
          required
        >
          {OPERATIVE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>YouTube video link</span>
        <input
          type="url"
          inputMode="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          aria-invalid={!urlLooksValid}
        />
        <small>
          {urlLooksValid
            ? "Make sure the video is Public or Unlisted."
            : "That doesn't look like a YouTube URL."}
        </small>
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button
        className="button button--primary"
        type="submit"
        disabled={submitting || !urlLooksValid || youtubeUrl.length === 0}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
