import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { isAdmin } from "@/lib/admin";
import AdminQueueClient, { type AdminSubmission } from "./AdminQueueClient";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.email)) {
    redirect("/account");
  }

  const rows = await db
    .select({
      id: schema.exemplarSubmissions.id,
      email: schema.exemplarSubmissions.email,
      operativeType: schema.exemplarSubmissions.operativeType,
      youtubeUrl: schema.exemplarSubmissions.youtubeUrl,
      youtubeId: schema.exemplarSubmissions.youtubeId,
      status: schema.exemplarSubmissions.status,
      feedback: schema.exemplarSubmissions.feedback,
      submittedAt: schema.exemplarSubmissions.submittedAt,
      reviewedAt: schema.exemplarSubmissions.reviewedAt
    })
    .from(schema.exemplarSubmissions)
    .orderBy(desc(schema.exemplarSubmissions.submittedAt));

  const submissions: AdminSubmission[] = rows.map((r) => ({
    id: r.id,
    email: r.email,
    operativeType: r.operativeType,
    youtubeUrl: r.youtubeUrl,
    youtubeId: r.youtubeId,
    status: r.status as AdminSubmission["status"],
    feedback: r.feedback,
    submittedAt: r.submittedAt.toISOString(),
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null
  }));

  return (
    <section className="account-section">
      <p className="eyebrow">Admin tools</p>
      <h1 className="account-section__title">Exemplar review queue</h1>
      <p className="account-section__lede">
        Approve or reject submitted gameplay. Leave optional feedback that the
        submitter will see on their own Exemplar tab.
      </p>
      <AdminQueueClient submissions={submissions} />
    </section>
  );
}
