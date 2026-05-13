import Link from "next/link";

export default function ExemplarSubmittedPage() {
  return (
    <section className="account-section exemplar-thanks">
      <p className="eyebrow">Submission received</p>
      <h1 className="account-section__title">Thank you for your submission.</h1>
      <p className="account-section__lede">
        R.A.T.S. staff will review your video and act accordingly.
      </p>
      <div className="exemplar-cta">
        <Link className="button button--secondary" href="/account">
          &larr; Home
        </Link>
      </div>
    </section>
  );
}
