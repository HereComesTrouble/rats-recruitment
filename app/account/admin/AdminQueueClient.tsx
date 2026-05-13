"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminSubmission = {
  id: string;
  email: string;
  operativeType: string;
  youtubeUrl: string;
  youtubeId: string;
  status: "pending" | "approved" | "rejected";
  feedback: string | null;
  submittedAt: string;
  reviewedAt: string | null;
};

const ROLE_LABELS: Record<string, string> = {
  auditor: "Auditor",
  surgeon: "Surgeon",
  guardian: "Guardian",
  distributor: "Distributor"
};

const STATUS_LABELS: Record<AdminSubmission["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected"
};

export default function AdminQueueClient({
  submissions
}: {
  submissions: AdminSubmission[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(submissions.map((s) => [s.id, s.feedback ?? ""]))
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setFeedback(id: string, value: string) {
    setDrafts((d) => ({ ...d, [id]: value }));
  }

  async function review(id: string, status: "approved" | "rejected") {
    setError(null);
    setBusy(`${id}:${status}`);
    try {
      const res = await fetch(`/api/admin/exemplar/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          feedback: drafts[id]?.trim() ? drafts[id].trim() : null
        })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not save review.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(null);
    }
  }

  if (submissions.length === 0) {
    return (
      <p className="exemplar-submissions__empty">
        No submissions yet. They&apos;ll appear here as operatives send them in.
      </p>
    );
  }

  return (
    <div className="admin-queue">
      {error ? <p className="form-error">{error}</p> : null}
      <ul className="admin-queue__list">
        {submissions.map((s) => {
          const isBusyApprove = busy === `${s.id}:approved`;
          const isBusyReject = busy === `${s.id}:rejected`;
          const anyBusy = busy?.startsWith(`${s.id}:`);
          return (
            <li key={s.id} className="admin-queue__row">
              <div className="admin-queue__head">
                <span className={`pill pill--${s.status}`}>
                  {STATUS_LABELS[s.status]}
                </span>
                <span className="admin-queue__role">
                  {ROLE_LABELS[s.operativeType] ?? s.operativeType}
                </span>
                <span className="admin-queue__email">{s.email}</span>
                <span className="admin-queue__date">
                  {new Date(s.submittedAt).toLocaleString()}
                </span>
              </div>

              <a
                className="admin-queue__link"
                href={s.youtubeUrl}
                target="_blank"
                rel="noreferrer"
              >
                {s.youtubeUrl}
              </a>

              <label className="form-field admin-queue__feedback">
                <span>Feedback (optional)</span>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={drafts[s.id] ?? ""}
                  onChange={(e) => setFeedback(s.id, e.target.value)}
                  placeholder="Notes the operative will see under their submission."
                />
              </label>

              <div className="admin-queue__actions">
                <button
                  type="button"
                  className="button button--primary"
                  disabled={anyBusy}
                  onClick={() => review(s.id, "approved")}
                >
                  {isBusyApprove ? "Saving..." : "Approve"}
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={anyBusy}
                  onClick={() => review(s.id, "rejected")}
                >
                  {isBusyReject ? "Saving..." : "Reject"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
