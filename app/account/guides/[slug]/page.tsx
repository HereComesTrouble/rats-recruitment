import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, listGuides } from "@/lib/guides";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="guide-article">
      <Link className="guide-article__back" href="/account/guides">
        &larr; All guides
      </Link>
      <header className="guide-article__header">
        <p className="eyebrow">{guide.role}</p>
        <h1>{guide.title}</h1>
      </header>
      <section className="guide-section guide-section--intro">
        <h2>Introduction</h2>
        <p>{guide.intro}</p>
      </section>
      {guide.body}
    </article>
  );
}
