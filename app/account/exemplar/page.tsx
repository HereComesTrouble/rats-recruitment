import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import type { ExemplarStatus, OperativeType } from "@/db/schema";

const ROLE_LABELS: Record<OperativeType, string> = {
  auditor: "Auditor",
  surgeon: "Surgeon",
  guardian: "Guardian",
  distributor: "Distributor"
};

const STATUS_LABELS: Record<ExemplarStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected"
};

export default async function ExemplarIndexPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const submissions = await db
    .select({
      id: schema.exemplarSubmissions.id,
      operativeType: schema.exemplarSubmissions.operativeType,
      youtubeUrl: schema.exemplarSubmissions.youtubeUrl,
      status: schema.exemplarSubmissions.status,
      feedback: schema.exemplarSubmissions.feedback,
      submittedAt: schema.exemplarSubmissions.submittedAt,
      reviewedAt: schema.exemplarSubmissions.reviewedAt
    })
    .from(schema.exemplarSubmissions)
    .where(eq(schema.exemplarSubmissions.userId, session.user.id))
    .orderBy(desc(schema.exemplarSubmissions.submittedAt));

  return (
    <section className="account-section">
      <p className="eyebrow">Recognition program</p>
      <h1 className="account-section__title">Become a R.A.T.S. Exemplar.</h1>
      <p className="account-section__lede">
        Receive recognition for demonstrating proper R.A.T.S. protocol with
        courtesy, professionalism and competence by following these steps:
      </p>

      <ol className="guide-list-ordered exemplar-steps">
        <li>
          Upload your operative gameplay to YouTube (it must have Public or
          Unlisted visibility).
        </li>
        <li>Submit your gameplay in the Exemplar submission form.</li>
        <li>Your gameplay will be reviewed by R.A.T.S. staff.</li>
        <li>
          If the gameplay meets exemplary criteria, your video will be hosted
          here as educational material for fellow operatives. If it does not,
          you may receive feedback on what should be different.
        </li>
      </ol>

      <div className="exemplar-cta">
        <Link className="button button--primary" href="/account/exemplar/submit">
          Submit gameplay
        </Link>
      </div>

      <div className="exemplar-submissions">
        <h2>Your submissions</h2>
        {submissions.length === 0 ? (
          <p className="exemplar-submissions__empty">
            You haven&apos;t submitted any gameplay yet. When you do, the status
            and any feedback will appear here.
          </p>
        ) : (
          <ul className="exemplar-submissions__list">
            {submissions.map((s) => {
              const status = s.status as ExemplarStatus;
              const role = s.operativeType as OperativeType;
              return (
                <li key={s.id} className="exemplar-submission">
                  <div className="exemplar-submission__row">
                    <span className={`pill pill--${status}`}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="exemplar-submission__role">
                      {ROLE_LABELS[role] ?? role}
                    </span>
                    <span className="exemplar-submission__date">
                      {new Date(s.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    className="exemplar-submission__link"
                    href={s.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.youtubeUrl}
                  </a>
                  {s.feedback ? (
                    <p className="exemplar-submission__feedback">
                      <strong>Staff feedback:</strong> {s.feedback}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
