"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  mfaEnabled: boolean;
  createdAt: string;
  connections: number;
  exemplarSubmissions: number;
};

export default function AdminUsersClient({
  users,
  currentUserId
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((u) => {
      const email = u.email.toLowerCase();
      const name = (u.name ?? "").toLowerCase();
      const id = u.id.toLowerCase();
      return email.includes(needle) || name.includes(needle) || id.includes(needle);
    });
  }, [q, users]);

  async function deleteUser(id: string) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not delete user.");
        return;
      }
      setConfirmId(null);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-users">
      <label className="form-field admin-users__search">
        <span>Search</span>
        <input
          type="search"
          placeholder="Email, display name, or user id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="admin-users__table-wrap">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Name</th>
              <th scope="col">MFA</th>
              <th scope="col">Linked</th>
              <th scope="col">Exemplar</th>
              <th scope="col">Member since</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isSelf = u.id === currentUserId;
              const confirming = confirmId === u.id;
              return (
                <tr key={u.id}>
                  <td>
                    <code className="admin-users__email">{u.email}</code>
                  </td>
                  <td>{u.name?.trim() || "—"}</td>
                  <td>{u.mfaEnabled ? "On" : "Off"}</td>
                  <td>{u.connections}</td>
                  <td>{u.exemplarSubmissions}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {isSelf ? (
                      <span className="admin-users__note">This is you</span>
                    ) : confirming ? (
                      <span className="admin-users__confirm">
                        <button
                          type="button"
                          className="button button--danger button--sm"
                          disabled={busyId === u.id}
                          onClick={() => deleteUser(u.id)}
                        >
                          {busyId === u.id ? "Deleting..." : "Confirm delete"}
                        </button>
                        <button
                          type="button"
                          className="button button--secondary button--sm"
                          disabled={busyId === u.id}
                          onClick={() => {
                            setConfirmId(null);
                            setError(null);
                          }}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="button button--secondary button--sm"
                        onClick={() => {
                          setConfirmId(u.id);
                          setError(null);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 ? (
        <p className="exemplar-submissions__empty">
          {users.length === 0
            ? "No registered users."
            : "No users match your search."}
        </p>
      ) : null}

      <p className="admin-users__foot">
        Showing {filtered.length} of {users.length} user{users.length === 1 ? "" : "s"}.
        User IDs are hidden; search includes full id substring match for support.
      </p>
    </div>
  );
}
