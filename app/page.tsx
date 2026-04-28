const services = [
  {
    title: "Stash Space Liberation",
    body: "We identify raiders burdened by surplus hardware and return those items to the ecosystem with professional urgency."
  },
  {
    title: "Field Audits",
    body: "Our patrols conduct on-site inspections for overconfidence, loose footing, and unattended backpacks."
  },
  {
    title: "Temporary Storage Recovery",
    body: "Dropped equipment is cataloged, admired, and redistributed to operators with immediate carrying capacity."
  }
];

const principles = [
  "Respect the extraction. A clean getaway is the purest receipt.",
  "Preserve scarcity. Embark built a harsh economy, and we are its unpaid interns.",
  "Punch up, flank wide, leave the stash lighter than you found it.",
  "Keep comms funny, fights fair, and grudges temporary."
];

const roles = [
  "Auditors who can spot a heavy backpack at two zip lines.",
  "Procurement specialists with calm hands and questionable ethics.",
  "Extraction denial associates comfortable working outdoors, under fire.",
  "New recruits willing to learn the difference between looting and logistics."
];

const testimonials = [
  {
    quote:
      "I entered with three guns, left with perspective, and discovered my stash had never looked cleaner.",
    name: "Anonymous Raider"
  },
  {
    quote:
      "R.A.T.S. solved our storage problem before we knew we had one.",
    name: "Satisfied Former Backpack Owner"
  },
  {
    quote:
      "Their commitment to Embark's vision is legally distinct from theft.",
    name: "Independent Compliance Rodent"
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero section">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">ARC Raiders community outfit</p>
            <h1>Raiders&apos; Authority on Temporary Storage</h1>
            <p className="lede">
              R.A.T.S. is a tongue-in-cheek but operationally real collective
              of ARC Raiders players providing inventory management services
              across the Rust Belt. We free stash space one decisive knock at a
              time.
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
                <dd>Embark-aligned scarcity</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section manifesto" aria-labelledby="manifesto-title">
        <p className="eyebrow">Officially unofficial</p>
        <h2 id="manifesto-title">Your hoard is our jurisdiction.</h2>
        <p>
          Every raider knows the pain: a stash packed with almost-useful
          attachments, guns you swear you will run later, and enough ammo to
          make an accountant nervous. R.A.T.S. exists to maintain the sacred
          pressure of ARC Raiders by encouraging circulation, consequence, and
          the occasional involuntary donation.
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
          <h2 id="doctrine-title">Serious enough to show up. Dumb enough to matter.</h2>
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
              We are looking for raiders who enjoy coordinated raids, good
              comms, fair fights, and committing to the bit when the bit has
              tactical value.
            </p>
          </div>
          <div className="roles">
            {roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
          <a className="button button--primary" href="mailto:rats.recruitment@example.com">
            Request Temporary Clearance
          </a>
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
        <p>Raiders&apos; Authority on Temporary Storage: your stash, temporarily our problem.</p>
      </footer>
    </main>
  );
}
