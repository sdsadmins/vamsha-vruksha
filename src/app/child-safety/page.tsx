import type { Metadata } from "next";
import Link from "next/link";
import { TreePine } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Safety Standards | Daivajna Samaj",
  description:
    "The Child Safety Standards for the Daivajna Samaj application and the Daivajna Samaja platform, operated by Credora Technologies — our zero-tolerance stance on child sexual abuse and exploitation (CSAE) and child sexual abuse material (CSAM), how to report a concern, and our designated child safety contact.",
  keywords: [
    "child safety standards",
    "CSAE",
    "CSAM",
    "Daivajna Samaj",
    "Credora Technologies",
    "child protection policy",
  ],
  alternates: { canonical: "https://daivajnasamaj.in/child-safety" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Child Safety Standards | Daivajna Samaj",
    description:
      "Our zero-tolerance standards against child sexual abuse and exploitation on the Daivajna Samaj application, and how to report a child safety concern.",
    url: "https://daivajnasamaj.in/child-safety",
    siteName: "Daivajna Samaja",
    type: "website",
  },
};

const UPDATED = "24 November 2026";
const SAFETY_EMAIL = "credoratech@gmail.com";

/** A section body is either one paragraph, or a lead paragraph followed by bullets. */
type Body = string | { lead?: string; bullets: string[]; tail?: string };

const sections: [string, Body][] = [
  [
    "Our Commitment to Child Safety",
    {
      lead: "Daivajna Samaj is a community and matrimony application operated by Credora Technologies (OPC) Private Limited (“Credora Technologies”), together with the Daivajna Samaja website at daivajnasamaj.in. Protecting children from sexual abuse and exploitation is a condition of using our platform, not an optional guideline.",
      bullets: [
        "We maintain a zero-tolerance position on child sexual abuse and exploitation (CSAE) in every part of the platform — profiles, posts, stories, matrimonial listings, direct messages and uploaded media.",
        "We maintain a zero-tolerance position on child sexual abuse material (CSAM). There is no context, cultural framing, artistic claim or private-sharing arrangement in which such material is permitted.",
        "We are committed to keeping Daivajna Samaj a platform on which members, including families with children, can participate safely.",
      ],
      tail: "These standards apply to every member, in every country where the application is available, and to anyone acting on a member’s behalf.",
    },
  ],
  [
    "Scope of These Standards",
    "These Child Safety Standards cover the Daivajna Samaj mobile application and the Daivajna Samaja website and member services. They sit alongside our Terms of Service and Privacy Policy. Where these Standards are stricter than any other document we publish, these Standards govern the question of child safety.",
  ],
  [
    "Prohibited Content and Activities",
    {
      lead: "The following are strictly prohibited on Daivajna Samaj. Any account found engaging in them will be removed from the platform.",
      bullets: [
        "Child sexual abuse material (CSAM) — creating, uploading, storing, requesting, viewing, sharing, distributing, linking to, advertising or promoting any image, video, audio, text or generated media that sexually exploits or abuses a child.",
        "Child exploitation and grooming — building a relationship, trust or emotional connection with a child in order to sexually exploit or abuse them, including attempting to move a conversation with a child to a private or off-platform channel for that purpose.",
        "Sexual exploitation of minors — sexualising a child in any way, soliciting sexual content or sexual contact from a child, or offering, arranging or soliciting a child for sexual purposes, including through trafficking.",
        "Inappropriate interaction with a minor — sexual or sexually suggestive communication directed at a child, sexual commentary about a child, or requesting a child’s contact details, location or images for a sexual purpose.",
        "Sharing, distributing or promoting abusive content involving children — including re-posting, forwarding, mirroring, or directing other members towards such material, whether it originates on or off our platform.",
        "Sexualising images of children that are not themselves explicit — including family or community photographs, which must never be repurposed, captioned or edited in a sexual manner.",
        "Normalising, trivialising, glorifying or advocating for CSAE, or claiming that any form of sexual interest in children is acceptable.",
        "Impersonating a child, or misrepresenting your age in order to interact with children.",
      ],
    },
  ],
  [
    "Eligibility and Guardian Consent",
    "The Daivajna Samaj Services are intended for adult members of the community. As set out in our Terms of Service, you must be legally capable of entering into a binding agreement to use the Services, and where a minor is permitted to participate in community features, a parent or lawful guardian must provide any legally required consent and supervise that use. You must not create an account using another person’s details, and you must not misstate your age. Matrimonial features are intended for adults seeking marriage and must never be used to pursue, list or contact a minor.",
  ],
  [
    "How to Report a Child Safety Concern",
    {
      lead: "If you encounter content, an account or a conversation that you believe sexually exploits or endangers a child, report it to us. You do not need to be certain — report it and let us assess it.",
      bullets: [
        `Email our designated child safety contact at ${SAFETY_EMAIL}. This is the authoritative channel for any concern involving a child and reaches Credora Technologies directly. Please put “CHILD SAFETY” in the subject line so that it is prioritised.`,
        "In the Daivajna Samaj application, the menu on a post includes a Report control that you can use to flag content you believe breaches these Standards.",
        "For any matter involving the safety of a child, please also email the address above. Emailing us ensures the report reaches our designated child safety contact directly, with the detail needed to act on it and to preserve a record.",
      ],
      tail: "Where you believe a child is in immediate danger, contact your local law enforcement or child protection authority first. In India you can reach the CHILDLINE helpline on 1098 and the national cyber crime portal at cybercrime.gov.in. Reporting to us does not replace contacting the authorities.",
    },
  ],
  [
    "What to Include in a Report",
    "So that we can act quickly, please tell us where the content appears (for example, a profile, post, story, listing or message), the name or identifier shown on the account concerned, the date and time you saw it, and a short description of your concern. Include a screenshot only where it is lawful for you to hold and send that material — never forward suspected CSAM to us or to anyone else. Describing the location of the content is sufficient and is what we ask for.",
  ],
  [
    "Review of Reports",
    "Reports received at our child safety contact address are reviewed by Credora Technologies. We assess the reported content, account or conversation against these Standards and applicable law, and we may ask you for further information in order to complete that assessment. Reviews are carried out by our personnel rather than by automated classification, and we prioritise reports involving a child above all other categories of report. We will not disclose the identity of a person who reports a child safety concern to the account being reported.",
  ],
  [
    "Enforcement Actions",
    {
      lead: "Where we determine that these Standards have been breached, Credora Technologies acts directly on the account and content concerned. Depending on the nature and severity of the breach, the actions we take include:",
      bullets: [
        "Removing the content from the platform.",
        "Suspending or permanently terminating the member’s account and their access to the Services.",
        "Blocking the member from re-registering, to the extent we are able to identify an attempt to do so.",
        "Preserving the content, account records and related information where that is necessary as evidence or to meet a legal obligation.",
        "Referring the matter to law enforcement or the appropriate child protection authority.",
      ],
      tail: "A confirmed case involving CSAM results in immediate and permanent termination of the account, without prior notice and without a right of reinstatement. For other breaches of these Standards, a member may write to our child safety contact to ask us to review a decision, and we will reconsider it where there is a genuine basis to do so.",
    },
  ],
  [
    "Compliance with Applicable Laws",
    "Credora Technologies is committed to complying with the child safety laws that apply to our Services. In India this includes the Protection of Children from Sexual Offences Act, 2012 (POCSO), Section 67B of the Information Technology Act, 2000, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Where the Services are used from another jurisdiction, we will comply with the child safety obligations that apply there. We also require our members to comply with Google Play’s Child Safety Standards and its policy on child endangerment, and these Standards are published in order to meet that requirement.",
  ],
  [
    "Reporting and Escalation of Confirmed CSAM",
    "Where we confirm that material on our platform is CSAM, we will remove it, terminate the account responsible, preserve the associated records as evidence to the extent the law permits or requires, and report the matter to the appropriate authority — in India, to law enforcement and, where applicable, through the national cyber crime reporting portal, and to the National Center for Missing & Exploited Children (NCMEC) where our obligations or the circumstances call for it. We will cooperate with lawful requests from law enforcement and child protection authorities investigating such a report, and we will disclose member information where we are legally required or lawfully permitted to do so. We will not notify an account holder of a law enforcement referral where doing so would prejudice an investigation or endanger a child.",
  ],
  [
    "Our Responsibilities as the Operator",
    {
      lead: "In support of these Standards, Credora Technologies undertakes to:",
      bullets: [
        "Maintain a designated child safety contact and keep the address published on this page current.",
        "Keep these Standards accessible without charge, without registration and without login, at a stable public address.",
        "Review these Standards periodically and whenever our features, our legal obligations or Google Play’s requirements change.",
        "Keep improving the in-application reporting and moderation tools available to members, so that a child safety concern can be raised and escalated as directly as possible.",
      ],
    },
  ],
  [
    "Designated Child Safety Contact",
    {
      lead: "Questions, reports and law enforcement enquiries about child safety on our platform should be directed to our designated contact:",
      bullets: [
        "Application: Daivajna Samaj",
        "Developer / Organisation: Credora Technologies (OPC) Private Limited (CIN: U62011KA2025OPC207972)",
        `Child safety contact email: ${SAFETY_EMAIL}`,
        "Website: https://daivajnasamaj.in",
      ],
      tail: "We aim to acknowledge child safety reports promptly and to act on confirmed breaches as quickly as we are able.",
    },
  ],
  [
    "Changes to These Standards",
    "We may update these Child Safety Standards to reflect changes to our Services, our legal obligations or the requirements of the platforms that distribute our application. The revised version will be posted on this page with an updated review date. Material changes to how a child safety concern should be reported will be reflected here first.",
  ],
];

function SectionBody({ body }: { body: Body }) {
  if (typeof body === "string") {
    return <p className="mt-4 text-[15px] leading-8 text-[#625D54]">{body}</p>;
  }
  return (
    <div className="mt-4 space-y-4">
      {body.lead && <p className="text-[15px] leading-8 text-[#625D54]">{body.lead}</p>}
      <ul className="space-y-3">
        {body.bullets.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-8 text-[#625D54]">
            <span
              aria-hidden="true"
              className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5E3C]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {body.tail && <p className="text-[15px] leading-8 text-[#625D54]">{body.tail}</p>}
    </div>
  );
}

export default function ChildSafetyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#20372B]">
      <nav className="border-b border-[#DFC5A0]/50 bg-[#0D2B1E] text-[#FAF7F2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="font-serif text-xl font-semibold tracking-wide">
            Daivajna Samaja
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#F0E6D3]">
            <a className="hover:text-white" href="/privacy-policy">
              Privacy Policy
            </a>
            <a className="hover:text-white" href="/terms">
              Terms of Service
            </a>
            <a className="hover:text-white" href="/child-safety">
              Child Safety
            </a>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#0D2B1E] via-[#1B4332] to-[#2D6A4F] px-6 py-20 text-center text-[#FAF7F2]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#DFC5A0]">
          Daivajna Samaj · Child Safety
        </p>
        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">Child Safety Standards</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#F0E6D3]">
          Our standards against child sexual abuse and exploitation on the Daivajna Samaj
          application, how to report a concern, and who to contact.
        </p>
        <p className="mt-5 text-xs text-[#DFC5A0]">
          Effective date: {UPDATED} · Last updated: {UPDATED}
        </p>
      </header>

      <section aria-labelledby="report-now" className="px-6 pt-12">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#DFC5A0] bg-[#F0E6D3] p-7 shadow-sm sm:p-9">
          <h2 id="report-now" className="font-serif text-xl font-semibold text-[#1B4332] sm:text-2xl">
            Report a child safety concern
          </h2>
          <p className="mt-3 text-[15px] leading-8 text-[#625D54]">
            Email our designated child safety contact at{" "}
            <a
              className="font-semibold text-[#8B5E3C] underline decoration-[#C4823A] underline-offset-4 hover:text-[#6B4226]"
              href={`mailto:${SAFETY_EMAIL}?subject=CHILD%20SAFETY%20report%20%E2%80%94%20Daivajna%20Samaj`}
            >
              {SAFETY_EMAIL}
            </a>
            . If you believe a child is in immediate danger, contact your local law enforcement or
            child protection authority first — in India, CHILDLINE on{" "}
            <a className="font-semibold text-[#8B5E3C] hover:text-[#6B4226]" href="tel:1098">
              1098
            </a>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#DFC5A0] bg-white p-6 shadow-sm lg:sticky lg:top-8">
          <p className="mb-4 font-serif text-lg font-semibold text-[#1B4332]">On this page</p>
          <ol className="max-h-[65vh] space-y-2 overflow-y-auto text-sm text-[#6B6258]">
            {sections.map(([title], i) => (
              <li key={title}>
                <a className="hover:text-[#2D6A4F]" href={`#section-${i + 1}`}>
                  {i + 1}. {title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="space-y-5">
          {sections.map(([title, body], i) => (
            <section
              id={`section-${i + 1}`}
              key={title}
              className="scroll-mt-8 rounded-2xl border border-[#F0E6D3] bg-white p-7 shadow-[0_8px_28px_rgba(13,43,30,0.045)] sm:p-9"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E6D3] font-serif text-sm font-bold text-[#8B5E3C]">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#1B4332] sm:text-2xl">
                    {title}
                  </h2>
                  <SectionBody body={body} />
                </div>
              </div>
            </section>
          ))}
        </article>
      </div>

      <footer style={{ background: "linear-gradient(180deg, #0D2B1E, #061410)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #C4823A, #8B5E3C)" }}
              >
                <TreePine size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Daivajna Samaja
                </p>
                <p className="text-green-400 text-xs">Daivajna Samaja Community Portal</p>
              </div>
            </Link>

            <div className="flex gap-6 flex-wrap justify-center">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Child Safety", href: "/child-safety" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-green-400 text-sm hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 space-y-3">
            <p className="text-green-400 text-sm">
              Daivajna Samaj is a digital community and matrimony platform owned and operated by
              Credora Technologies (OPC) Private Limited.
            </p>

            <p className="text-green-500 text-xs">CIN: U62011KA2025OPC207972</p>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-green-400">
              <a href={`mailto:${SAFETY_EMAIL}`}>{SAFETY_EMAIL}</a>
              <a href="mailto:support@daivajnasamaj.in">support@daivajnasamaj.in</a>
              <a href="tel:+919880643606">+91 9880643606</a>
            </div>

            <p className="text-green-600 text-xs">
              © 2026 Credora Technologies (OPC) Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
