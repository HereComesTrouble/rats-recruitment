import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ExemplarForm from "./ExemplarForm";

export default async function ExemplarSubmitPage() {
  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user?.id || !email) {
    redirect("/login?next=/account/exemplar/submit");
  }

  return (
    <section className="account-section">
      <p className="eyebrow">Exemplar program</p>
      <h1 className="account-section__title">Submit gameplay</h1>
      <p className="account-section__lede">
        R.A.T.S. staff will review the link you provide. Make sure the video is
        Public or Unlisted before submitting.
      </p>
      <ExemplarForm initialEmail={email} />
    </section>
  );
}
