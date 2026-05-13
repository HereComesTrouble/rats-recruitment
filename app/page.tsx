import Link from "next/link";
import { auth } from "@/auth";

const services = [
  {
    title: "Stash Space Liberation",
    body: "We identify raiders burdened by surplus hardware and return those items to the ecosystem with professional urgency."
  },
  {
    title: "Total Coverage",
    body: "RATS are often kind souls and spend much of their time in 'PvE lobbies', ensuring that even players who rarely engage in PvP receive the economic benefits of RATS."
  },
  {
    title: "Cordial Professionalism",
    body: "RATS operatives are encouraged to facilitate quick and humane engagements with good sportsmanship."
  }
];

const principles = [
  "Auditors: Checking that raider stashes are kept manageable.",
  "Surgeons: Policing wonton use of gold weaponry.",
  "Guardians: Maintaining security at exfiltration sites.",
  "Distributors: Seizing assets to supply to new or poorly-geared raiders."
];

const testimonials = [
  {
    quote:
      "The game is dying because of you ****ing ***holes",
    name: "Anonymous Raider"
  },
  {
    quote:
      "Wow, go **** yourself bro",
    name: "Satisfied Former Backpack Owner"
  },
  {
    quote:
      "Why? I was friendly!",
    name: "xXSLVYERXx"
  }
];

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  return (
    <main>
      <header className="site-header">
        <nav className="site-header__nav" aria-label="Account">
          {isLoggedIn ? (
            <Link className="button button--ghost button--sm" href="/account">
              Account
            </Link>
          ) : (
            <>
              <Link className="button button--ghost button--sm" href="/login">
                Log in
              </Link>
              <Link className="button button--primary button--sm" href="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero section">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">ARC Raiders community outfit</p>
            <h1>Raiders&apos; Authority on Temporary Storage</h1>
            <p className="lede">
              Is your stash full all the time? Are you tired of shooting the
              same dozen ARC over and over in the safety of PvE lobbies? Are
              you concerned about the welfare of ARC Raiders&apos; playerbase?
              RATS is out to solve all of these problems and more, one
              engagement at a time.
            </p>
            <div className="hero__actions" aria-label="Recruitment actions">
              <a className="button button--primary" href="#enlist">
                Enlist with R.A.T.S.
              </a>
              <a className="button button--secondary" href="#services">
                Review Services
              </a>
            </div>
          </div>

          <aside className="status-card" aria-label="R.A.T.S. operating status">
            <div className="status-card__header">
              <span>Storage Authority Notice</span>
              <strong>Active</strong>
            </div>
            <dl>
              <div>
                <dt>Primary Function</dt>
                <dd>Inventory relief</dd>
              </div>
              <div>
                <dt>Preferred Method</dt>
                <dd>Polite ambush</dd>
              </div>
              <div>
                <dt>Compliance Model</dt>
                <dd>Population-optimized engagements</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section manifesto" aria-labelledby="manifesto-title">
        <p className="eyebrow">Officially unofficial</p>
        <h2 id="manifesto-title">YOUR STASH IS OUR BUSINESS.</h2>
        <p>
          Embark Studios has graciously provided raiders with not only enormous
          stash sizes, but also abundant sources of loot - it often falls right
          out of the sky! As an unintended side effect, this serves as a source
          of cortisol when raiders are swimming in so much goop that difficult
          decisions must be made about what to keep and what to salvage. RATS
          are out to protect you from such deliberations.
        </p>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="section__heading">
          <p className="eyebrow">Inventory management services</p>
          <h2 id="services-title">What we provide</h2>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split" aria-labelledby="doctrine-title">
        <div>
          <p className="eyebrow">Operating doctrine</p>
          <h2 id="doctrine-title">WORK WITH R.A.T.S. ON YOUR OWN TERMS.</h2>
        </div>
        <ul className="principles">
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>

      <section className="section" id="enlist" aria-labelledby="enlist-title">
        <div className="recruit-card">
          <div>
            <p className="eyebrow">Recruitment desk</p>
            <h2 id="enlist-title">Join the authority</h2>
            <p>
              Give back to your fellow Speranzan. Be a funmaxxer. Be a part of
              R.A.T.S.
            </p>
          </div>
          <Link className="button button--primary" href="/register">
            Register as an Operative
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="testimonials-title">
        <div className="section__heading">
          <p className="eyebrow">After-action statements</p>
          <h2 id="testimonials-title">What our clients say after extraction denial</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <figure className="testimonial" key={item.name}>
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption>{item.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>R.A.T.S. is an ARC Raiders player organization and is not affiliated with Embark Studios.</p>
        <p>Raiders&apos; Authority on Temporary Storage: Your stash is our business.</p>
      </footer>
    </main>
  );
}
