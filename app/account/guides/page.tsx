import Link from "next/link";
import { listGuides } from "@/lib/guides";

export default function GuidesIndexPage() {
  const guides = listGuides();

  return (
    <section className="account-section">
      <p className="eyebrow">Field manuals</p>
      <h1 className="account-section__title">Guides</h1>
      <p className="account-section__lede">
        Operational doctrine for representing R.A.T.S. with discipline,
        professionalism, and a sense of humor. Required reading first; role
        manuals after.
      </p>

      <div className="guide-grid">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            className="guide-card"
            href={`/account/guides/${guide.slug}`}
          >
            <span className="guide-card__role">{guide.role}</span>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <span className="guide-card__cta">Read manual</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
