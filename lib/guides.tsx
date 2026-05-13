import type { ReactNode } from "react";

export type GuideMeta = {
  slug: string;
  title: string;
  role: string;
  summary: string;
};

export type Guide = GuideMeta & {
  intro: string;
  body: ReactNode;
};

function ImagePlaceholder({ caption }: { caption: string }) {
  return (
    <figure className="guide-image">
      <div className="guide-image__box" aria-hidden="true">
        <span>Reference image</span>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return <p className="guide-callout">{children}</p>;
}

const etiquette: Guide = {
  slug: "etiquette",
  title: "R.A.T.S. Operative Etiquette",
  role: "Required reading",
  summary:
    "Baseline professionalism and conduct expected of every operative in the field.",
  intro:
    "RATS are out to maximize the health of ARC Raiders as a game. Therefore, good behavior in the field is imperative. This guide codifies baseline professionalism when representing or assisting RATS. RATS does not condone the breach of the guidelines below - we play the game with good sportsmanship, politeness and a fun-loving attitude.",
  body: (
    <>
      <section className="guide-section">
        <h2>Announce your intent</h2>
        <p>
          RATS operatives are ladies and gentlemen, not barbarians. Before
          firing on a client, announce yourself and your plans -{" "}
          <em>
            &ldquo;I represent RATS and I am going to shoot you&rdquo;
          </em>{" "}
          (full organization name optional) is always a fair bet! This way, the
          client is not ambushed in such a way that they cannot respond; they
          are given fair warning that RATS intends to service them.
        </p>
        <p>
          Oftentimes, and especially in lower-aggression lobbies, a
          client&apos;s response may be to ask &ldquo;Why?&rdquo; and insist
          that you abandon the engagement. <strong>Do not trust clients</strong>{" "}
          - they will say anything and everything in order to avoid having to
          draw a weapon. The more a client attempts to dissuade you, the more
          the client is suffering from loss aversion and requires the
          engagement. Press on!
        </p>
      </section>

      <section className="guide-section">
        <h2>Be polite</h2>
        <p>
          RATS maintain professionalism in the field. Avoid cursing and insults
          over voice chat. Always say &ldquo;GG&rdquo; or &ldquo;Good
          Game&rdquo; once an engagement is resolved, regardless of the
          outcome.
        </p>
      </section>

      <section className="guide-section">
        <h2>Be honest</h2>
        <p>
          Loot-burdened raiders often ask whether you are &ldquo;friendly&rdquo;
          - and of course you&apos;re friendly! You&apos;re an upstanding
          Speranzan fighting the good fight. However, the true intent of a
          raider who asks whether you are friendly is disguised by the
          definition of the word. The raider does not care how friendly you
          are, only whether you pose a threat to them - and you do! RATS
          operatives do not hide behind deceit. When asked whether you are
          friendly, tell them the truth - say <strong>&ldquo;no&rdquo;</strong>!
        </p>
        <p>
          Some raiders may bristle at this response as though it is a sign of
          hostility. Others may inquire further and ask what it means when you
          say that you are not friendly. This is an opportunity to share
          RATS&apos; mission with the raider. Who knows? You might find
          yourself a new recruit!
        </p>
      </section>

      <section className="guide-section">
        <h2>Exterminate vermin</h2>
        <p>
          RATS are not to be confused with rats. Since this may be a confusing
          distinction, here are some differences between the two:
        </p>

        <div className="guide-compare">
          <div>
            <h3>RATS operative</h3>
            <ul>
              <li>Always begins an engagement by announcing his intent.</li>
              <li>Polite and professional, even when downed.</li>
              <li>On a mission to better ARC Raiders for everyone.</li>
            </ul>
          </div>
          <div>
            <h3>Rat</h3>
            <ul>
              <li>Fires from a shadow, peek or bush before he is detected.</li>
              <li>Hurls insults and profanity, win or lose.</li>
              <li>An unskilled player seeking easy prey by any means.</li>
            </ul>
          </div>
        </div>

        <p>
          Rats as exemplified in the latter half of each scenario are
          considered to be &ldquo;vermin,&rdquo; and it is the duty of every
          RATS operative to relieve vermin of their loot on sight. Vermin are
          undeserving of typical RATS professionalism and may be engaged
          without warning, although RATS operatives should continue to set a
          good example for vermin with good sportsmanship. When defeating a
          vermin, it is also ideal to provide them with advice on how to
          better their gameplay in order to guide them back onto the straight
          and narrow.
        </p>
      </section>
    </>
  )
};

const auditor: Guide = {
  slug: "auditor",
  title: "Auditor Guide",
  role: "Operative role",
  summary:
    "The backbone of RATS operations: identify loot-burdened raiders and gently relieve their stash pressure.",
  intro:
    "Do you see fellow Speranzans shouldering the atlassian burden of a full stash? Are your fellow raiders looting with cavalier abandon, unconcerned for the dangers Topside presents? This is the primary problem RATS are out to solve, and the Auditors are the backbone of RATS operations.",
  body: (
    <>
      <section className="guide-section">
        <h2>Uniform code</h2>
        <p>
          The ideal wear for an Auditor is the Radio Renegade outfit with the
          customizations below.
        </p>
        <Callout>
          Unlock the Radio Renegade outfit by completing the quest
          &ldquo;Switching the Supply&rdquo;.
        </Callout>
        <div className="guide-image-grid">
          <ImagePlaceholder caption="Radio Renegade outfit - configuration 1" />
          <ImagePlaceholder caption="Radio Renegade outfit - configuration 2" />
          <ImagePlaceholder caption="Radio Renegade outfit - configuration 3" />
        </div>
        <p>
          This is an Auditor ready to ensure the health of the ARC Raiders
          ecosystem!
        </p>
      </section>

      <section className="guide-section">
        <h2>Engagement protocol</h2>
        <ol className="guide-list-ordered">
          <li>
            Prepare a strong loadout capable of quickly dispatching other
            raiders at close range.
          </li>
          <li>Enter into any map.</li>
          <li>
            Identify a raider who appears to be alone (or a duo/trio, if you
            queued in with fellow RATS operatives).
          </li>
          <li>
            Approach the prospective client(s) with your weapons drawn, but not
            aimed. Greet them and introduce yourselves as RATS operatives in a
            kind and professional fashion.
          </li>
          <li>
            Ask the client(s) if they have had any difficulty managing their
            stash, or if there&apos;s anything they need. This is where the
            &lsquo;auditing&rsquo; part comes in. Use discernment to determine
            whether the clients require RATS services. If they do not, thank
            them for their time and wish them good fortune.
          </li>
          <li>
            If the client(s) do require RATS services, aim your weapon and
            inform them that you intend to return them to Speranza, then do so.
          </li>
          <li>
            Bonus: Ask the clients before you fire whether they have any
            questions.
          </li>
        </ol>
      </section>
    </>
  )
};

const surgeon: Guide = {
  slug: "surgeon",
  title: "Surgeon Guide",
  role: "Operative role",
  summary:
    "Confiscate gold contraband from raiders who haven't earned the training to wield it.",
  intro:
    "Does the sound of a distant Aphelion cause you to shake your head? Do you see a raider firing a Jupiter with wild abandon and think, 'that man's about to lose his best gear'? Your keen senses may be well-suited to the Surgeon role. It is the Surgeon's job to ensure that only properly-trained raiders wield dangerous and experimental gold weapons, else innocent Speranzans might accidentally hurt themselves or others! Only RATS personnel are trained in the wielding of gold weaponry, and as a Surgeon, you will confiscate such contraband.",
  body: (
    <>
      <section className="guide-section">
        <h2>Uniform code</h2>
        <p>
          The ideal wear for a Surgeon is, of course, the Surgeon outfit, with
          the customizations below.
        </p>
        <Callout>Acquire the Surgeon outfit from Raider Deck 003.</Callout>
        <div className="guide-image-grid">
          <ImagePlaceholder caption="Surgeon outfit - configuration 1" />
          <ImagePlaceholder caption="Surgeon outfit - configuration 2" />
          <ImagePlaceholder caption="Surgeon outfit - configuration 3" />
        </div>
        <p>This is the garb of a medical professional, ready to prevent harm!</p>
      </section>

      <section className="guide-section">
        <h2>Engagement protocol</h2>
        <ol className="guide-list-ordered">
          <li>
            Identify a client. You may hear or see them from the distinct
            visuals and sounds produced by an Aphelion, Dolabra, Equalizer or
            Jupiter, or you may see the weapon on their back.
          </li>
          <li>
            Approach and politely greet the client with your weapon
            unholstered, but relaxed - do not yet aim at the client.
          </li>
          <li>
            Inform the client of the dangers of carrying gold weaponry and that
            your duty is to confiscate the gold contraband.
          </li>
          <li>
            Prompt the client to drop their gold weapon. If they do, politely
            accept it and carry on. Mission accomplished!
          </li>
          <li>
            If the client denies your request, escalate it to a command. Aim
            your weapon with readiness to neutralize. This is the client&apos;s
            last opportunity to drop the contraband - even if they do, remain
            cautious while retrieving it!
          </li>
          <li>
            If you are fired upon, immediately respond with force. Should you
            emerge victorious, congratulations on your bonus!
          </li>
        </ol>
      </section>
    </>
  )
};

const guardian: Guide = {
  slug: "guardian",
  title: "Guardian Guide",
  role: "Operative role",
  summary:
    "Reintroduce threat at exfil sites. Trap, intercept, and remind raiders that loot is never free.",
  intro:
    "Do you ever feel indignant when another raider ignores you as though you couldn't send them back to Speranza in a matter of seconds? Do you see lobbies full of raiders making off with Matriarch loot completely stress-free and see that they haven't earned their spoils? Are the exfils full of healthy bodies? Not for long! As a Guardian, you will reintroduce threat to the ARC Raiders experience. You will leverage traps and explosives to secure exfil sites and minimize loot saturation.",
  body: (
    <>
      <section className="guide-section">
        <h2>Uniform code</h2>
        <p>
          The ideal uniform for the Guardian is the Sforza outfit with the
          customizations below.
        </p>
        <Callout>Acquire the Sforza outfit by reaching raider level 10.</Callout>
        <div className="guide-image-grid">
          <ImagePlaceholder caption="Sforza outfit - configuration 1" />
          <ImagePlaceholder caption="Sforza outfit - configuration 2" />
          <ImagePlaceholder caption="Sforza outfit - configuration 3" />
        </div>
        <p>
          You are encouraged to enable the Cape if you have it unlocked.
          Everyone knows that people who wear capes are authorities.
        </p>
      </section>

      <section className="guide-section">
        <h2>Engagement protocol</h2>
        <ol className="guide-list-ordered">
          <li>
            Prepare a loadout which includes <strong>Showstopper Grenades</strong>{" "}
            and enough ordnance to level the entirety of the Buried City Town
            Hall. <strong>Trigger Nades</strong>,{" "}
            <strong>Heavy Fuze Grenades</strong>, <strong>Blaze Grenades</strong>,{" "}
            <strong>Trailblazer Grenades</strong>, pre-planted{" "}
            <strong>Synthesized Fuel</strong> tanks and possibly{" "}
            <strong>Deadline Mines</strong> will prove useful.
          </li>
          <li>
            Identify a prime deployment zone. Ideal deployment zones are those
            currently affected by the <strong>Harvester</strong> or{" "}
            <strong>Matriarch</strong> events, where waves of players are likely
            to coalesce after a high-value ARC target is neutralized.
          </li>
          <li>
            Once deployed, identify the most likely exfiltration site for
            raiders to use after the high-value ARC is neutralized. It&apos;s
            often obvious; on Spaceport, for example, if the target is in the
            southern region of the map, raiders are likely to proceed to the
            South Elevator.
          </li>
          <li>
            Prepare the exfil site with your choice of ordnance. If readying
            trams or elevators, you can do this by calling the exfil and
            planting the ordnance within, then exiting before the exfil vehicle
            departs. You may elect to place Trigger Nades, Synthesized Fuel, or
            nothing at all.
          </li>
          <li>
            If facing a manageable number of clients, inform them before they
            enter the exfil that they will be permitted to exfil if they each
            drop ten items for you (the number of items you request is at your
            discretion), or a single pink or gold item. This is for the good of
            the player economy and to counteract the trivialization of boss ARC
            encounters. During this time, you may choose whether or not to have
            your weapon withdrawn, but do not aim at the clients.
          </li>
          <li>
            If the clients draw their weapons, aim, fire or decline your
            request, knock them out.
          </li>
          <li>
            <strong>Do not be foolish!</strong> Although RATS protocol favors
            informing clients of services beforehand, you will not successfully
            sway a horde of 3 or more raiders as a solo operative. If you are
            not confident in your ability to deliver services according to
            standard protocol, knock out first and talk later!
          </li>
          <li>
            Do not permit downed raiders to trigger the exfil. You will find
            yourself kidnapped while there is still unfinished business.
          </li>
          <li>
            Resolve your business quickly. In events like Harvester and
            Matriarch, players often come to exfil in multiple waves, and they
            may raise their hackles at the sight of multiple unconscious
            raiders inside the exfil vehicle. You may also become compromised
            if raiders see you servicing clients. Although the zeal with which
            you perform your duties is admirable, discretion is the better
            part of valor.
          </li>
        </ol>
      </section>
    </>
  )
};

const distributor: Guide = {
  slug: "distributor",
  title: "Distributor Guide",
  role: "Operative role",
  summary:
    "Welcome new raiders to Topside, share gear and knowledge, and recruit the next generation of RATS.",
  intro:
    "Are you a gentle soul at heart? Do you wish to welcome new and struggling raiders to Topside with a spirit of jolly cooperation? You might see the Distributor role as being the kindest way to contribute to RATS' mission. It is the role of Distributors to assist in the success of players with poor equipment, whether they are attempting to complete quests, score well in trials, grind projects, level up their workshop / stash, or earn XP. The innocent benevolence of this role makes you an excellent RATS liaison to the raider community, and positions you for extra recruiting opportunities. You are also an ideal candidate for assisting new RATS members with gearing up to be successful operatives.",
  body: (
    <>
      <section className="guide-section">
        <h2>Uniform code</h2>
        <p>
          The ideal uniform for the Distributor is the white indigo Warden
          outfit.
        </p>
        <Callout>
          Unlock the Warden outfit by completing the quest &ldquo;The Stench of
          Corruption&rdquo;.
        </Callout>
        <div className="guide-image-grid">
          <ImagePlaceholder caption="Warden outfit - configuration 1" />
          <ImagePlaceholder caption="Warden outfit - configuration 2" />
          <ImagePlaceholder caption="Warden outfit - configuration 3" />
        </div>
        <p>This ensemble is bright and unthreatening - like a loot angel!</p>
      </section>

      <section className="guide-section">
        <h2>Engagement protocol</h2>
        <ol className="guide-list-ordered">
          <li>
            Prepare a respectable loadout with readiness to handle a variety of
            threats. You are encouraged to bring additional healing materials,
            shield recharges, extra green shields and{" "}
            <strong>Defibrillators</strong> to ensure the welfare of struggling
            raiders.
          </li>
          <li>
            Identify an ideal client. The more signs a client exhibits, the
            more ideal a client they are. Signs of an ideal client include:
            <ul className="guide-list-bullets">
              <li>
                White-rarity weapons, such as the Stitcher, Ferro or Kettle.
              </li>
              <li>Aimless meandering.</li>
              <li>
                Struggling with low-tier ARC such as Wasps, Hornets, Ticks or
                Fireballs.
              </li>
              <li>Asking for help on proximity chat.</li>
            </ul>
          </li>
          <li>
            Approach and ask whether the client would like assistance, a
            raiding buddy, or what they&apos;re attempting to accomplish in the
            raid. This will help you further cement whether they are a good
            client.
          </li>
          <li>
            It is the tendency of men in general to politely decline help.
            Insist that helping people is your favorite activity (it is!) and
            that you would love to help them with anything they&apos;re trying
            to do. If they continue to decline, bid them good fortune and move
            on.
          </li>
          <li>
            Once a client has accepted your assistance, they are your charge,
            and you are to protect them with your life. This includes
            maintaining elite awareness of surrounding raiders who may be
            interested in harming your novice client.
          </li>
          <li>
            Assist the client however you see fit, as long as this does not
            involve firing on or otherwise damaging the client. Many clients
            appreciate concise education on how to deal with various
            challenges. If they have questions, answer them with enthusiasm
            and to the best of your ability. If the client betrays you, you
            are encouraged to immediately return them to Speranza.
          </li>
          <li>
            If you hear high tier weapons being fired, you may wish to inform
            the client and ask if they would like to attempt to seize those
            weapons for themselves. If they would, assist them in ambushing
            the weapons&apos; owner(s).
          </li>
          <li>
            Once the client has been escorted to an exfil site, you are
            encouraged to share that you have enjoyed raiding with them and
            that you are a RATS operative. This is an opportunity to share
            RATS&apos; funmaxxing mission and potentially guide them to a
            recruitment channel!
          </li>
        </ol>
      </section>
    </>
  )
};

export const guides: Guide[] = [
  etiquette,
  auditor,
  surgeon,
  guardian,
  distributor
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function listGuides(): GuideMeta[] {
  return guides.map(({ slug, title, role, summary }) => ({
    slug,
    title,
    role,
    summary
  }));
}
