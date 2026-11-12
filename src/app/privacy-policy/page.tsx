import type { Metadata } from "next";
import Link from "next/link";
import { TreePine} from "lucide-react";
export const metadata: Metadata = {
  title: "Privacy Policy | Daivajna Samaja",
  description: "Learn how Daivajna Samaja collects, uses, stores and protects personal information.",
};

const sections = [
  ["Introduction", "This Privacy Policy explains how Daivajna Samaja and the entity operating its digital Services collect, use, disclose, store and protect personal information. It applies to the website, mobile application, member directory, event registrations, communications and related services. Please read it together with the Terms of Service."],
  ["Who We Are", "The proposed operating entity is Credora Technologies (OPC) Private Limited (CIN: U62011KA2025OPC207972), supporting the Daivajna Samaja initiative. The exact data fiduciary / data controller role and the relationship between the Samaja and the operator must be confirmed before publication. Registered office: [CONFIRM AND INSERT REGISTERED OFFICE ADDRESS]."],
  ["Scope and Applicability", "This Policy applies to personal information processed through the Services, including information you provide directly, information generated through use of the Services and information received from authorised service providers. Separate notices may apply to specific events, campaigns or features."],
  ["Personal Information We Collect", "Depending on the features you use, we may collect name, mobile number, email address, date of birth, gender, profile photograph, membership identifiers, address, city, professional details, family or community details you choose to provide, event preferences, support messages and account credentials or authentication data. Only fields needed for a stated purpose should be enabled in production."],
  ["Information Collected Automatically", "We may collect device type, operating system, app version, browser details, IP address, log data, approximate location derived from network information, crash diagnostics, usage events and security signals. Exact location should be collected only where a feature requires it and after providing appropriate notice and obtaining any required permission."],
  ["Information from Other Sources", "We may receive information from event organisers, authorised Samaja representatives, verification providers or other members where they are permitted to share it. We will use such information consistently with this Policy and applicable law, and will provide notice where required."],
  ["How We Use Personal Information", "We use information to create and manage accounts, verify identity or membership, maintain member profiles, provide community features, organise events, send service notifications, respond to support requests, prevent fraud and misuse, secure the Services, comply with legal obligations and improve functionality. Each processing purpose must have a valid legal basis."],
  ["Legal Basis and Consent", "Where applicable law requires consent, we will request it in a clear and specific manner and record the choice. You may withdraw consent through available settings or by contacting us. Withdrawal does not affect processing already carried out lawfully and may limit features that depend on the information or permission."],
  ["Children and Minors", "The Services are not intended to collect children’s personal information without the legally required parent or lawful guardian consent. Age-screening, verifiable parental consent and restrictions on behavioural monitoring or targeted advertising must be implemented where applicable before enabling access for children."],
  ["Sensitive and Optional Information", "Please do not submit sensitive personal information unless a feature specifically requests it and explains why it is needed. Optional profile fields should be clearly marked. Avoid publishing personal information about family members or other individuals unless you have authority and any required consent."],
  ["Member Directory and Visibility", "Some profile information may be visible to other members depending on your settings and the purpose of the directory. We will explain which fields are public, member-only or private. Do not assume that information entered into a community profile is confidential; review visibility controls before submitting it."],
  ["Cookies and Similar Technologies", "The website may use essential cookies and similar technologies for session management, security, preferences and performance. Analytics or advertising technologies, if used, must be disclosed and enabled only in accordance with applicable consent requirements. Browser settings may allow you to control cookies, although some features may not function without essential cookies."],
  ["Communications and Notifications", "We may use your mobile number or email address for OTPs, account security, important service notices, event updates and responses to your requests. Marketing communications will be sent only where permitted and with consent where required. You can opt out of promotional communications without affecting essential service messages."],
  ["Sharing with Service Providers", "We may share limited information with hosting, cloud storage, analytics, customer support, SMS, email, push notification, payment, identity verification and security providers when needed to operate the Services. Actual provider names, processing locations, purposes and contractual safeguards must be listed in the production vendor register and reflected here where required."],
  ["Other Disclosures", "We may disclose information to authorised Samaja representatives for legitimate administration; to professional advisers; in connection with a merger or restructuring subject to safeguards; or to regulators, law enforcement or other parties where required or permitted by law. We do not authorise recipients to use information for unrelated purposes."],
  ["International Data Transfers", "Some service providers may process information outside India. Before any international transfer, we will assess applicable legal requirements, disclose relevant information where required and implement appropriate contractual, organisational and technical safeguards."],
  ["Data Security", "We use reasonable technical and organisational safeguards designed to protect personal information against unauthorised access, alteration, disclosure, loss or destruction. Measures may include access controls, encryption in transit, secure authentication, backups, logging, vulnerability management and staff confidentiality obligations. No internet service can guarantee absolute security."],
  ["Data Breach Response", "If a personal data breach occurs, we will assess and respond to it, take steps to contain and mitigate harm, maintain appropriate records and notify affected individuals and authorities where required by applicable law. Internal escalation contacts and statutory notification workflows must be operational before launch."],
  ["Data Retention", "We retain personal information only for as long as reasonably necessary for the purposes described in this Policy, including account operation, event administration, legal compliance, security and dispute resolution. Exact retention periods by data category: [INSERT APPROVED RETENTION SCHEDULE]. Data no longer required will be securely deleted or anonymised, subject to lawful retention obligations."],
  ["Your Rights", "Subject to applicable law, you may request access to information about processing, correction or updating of inaccurate information, erasure, withdrawal of consent, grievance redressal and other rights available to you. We may need to verify your identity before acting and may retain information where the law permits or requires it."],
  ["How to Exercise Your Rights", "Submit a request using the in-app controls where available or email [PRIVACY EMAIL] with the subject “Privacy Request”. Include enough information for us to identify your account, but do not send passwords or OTPs. We will respond within the time required by applicable law and may request reasonable verification."],
  ["Account Deletion", "You may request account deletion through the in-app account settings, where available, or by contacting support@credora.info or support@daivajnasamaj.in. We will explain any information that must be retained, the reason for retention and the applicable period. The production app must provide a functional deletion path and a clear confirmation flow."],
  ["Grievance Redressal", "For privacy complaints, contact the Grievance Officer: [NAME AND DESIGNATION], at [GRIEVANCE EMAIL]. Postal address: [REGISTERED / GRIEVANCE ADDRESS]. We will acknowledge and resolve grievances within the timelines prescribed by applicable law. These details and the operational escalation process must be completed before publication."],
  ["Third-Party Websites and Services", "The Services may contain links to third-party websites or integrations. Their privacy practices are governed by their own notices, not this Policy. Review those notices before providing information or using an external service."],
  ["Payments and Financial Information", "If paid features are introduced, payment details may be processed by a payment gateway or financial service provider. We should receive only the transaction details needed for reconciliation and support; full card credentials should be handled by the payment provider. Actual payment providers and data flows must be confirmed before accepting payments."],
  ["Changes to This Policy", "We may update this Policy to reflect changes in our Services, practices or legal requirements. The updated version will be posted here with a revised effective date. Where required, we will provide notice and obtain fresh consent before materially changing the purposes or manner of processing."],
  ["Applicable Law", "This Policy is intended to be interpreted in accordance with applicable Indian data protection and information technology laws, including the Digital Personal Data Protection Act, 2023 and rules or notifications in force from time to time, to the extent applicable. The legal team should verify commencement dates, rules, exemptions and the exact obligations applicable to the Services before launch."],
  ["Contact Us", "For general support, contact support@credora.info or support@daivajnasamaj.in, or call +91 9880643606. For privacy matters, use [PRIVACY EMAIL]. Operator: Credora Technologies (OPC) Private Limited, CIN U62011KA2025OPC207972. Registered address: [CONFIRM AND INSERT REGISTERED OFFICE ADDRESS]. Effective date: [INSERT EFFECTIVE DATE]."],
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#20372B]">
      <nav className="border-b border-[#DFC5A0]/50 bg-[#0D2B1E] text-[#FAF7F2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="font-serif text-xl font-semibold tracking-wide">Daivajna Samaja</a>
          <div className="flex gap-6 text-sm text-[#F0E6D3]"><a className="hover:text-white" href="/privacy-policy">Privacy Policy</a><a className="hover:text-white" href="/terms">Terms of Service</a></div>
        </div>
      </nav>
      <header className="bg-gradient-to-br from-[#0D2B1E] via-[#1B4332] to-[#2D6A4F] px-6 py-20 text-center text-[#FAF7F2]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#DFC5A0]">Daivajna Samaja · Legal</p>
        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">Privacy Policy</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#F0E6D3]">Your privacy matters. This policy explains what information may be collected, why it is used and the choices available to you.</p>
        <p className="mt-5 text-xs text-[#DFC5A0]">Effective date: 12 November 2026 · Last reviewed: 12 November 2026</p>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#DFC5A0] bg-white p-6 shadow-sm lg:sticky lg:top-8"><p className="mb-4 font-serif text-lg font-semibold text-[#1B4332]">On this page</p><ol className="max-h-[65vh] space-y-2 overflow-y-auto text-sm text-[#6B6258]">{sections.map(([title], i) => <li key={title}><a className="hover:text-[#2D6A4F]" href={`#section-${i + 1}`}>{i + 1}. {title}</a></li>)}</ol></aside>
        <article className="space-y-5">{sections.map(([title, body], i) => <section id={`section-${i + 1}`} key={title} className="scroll-mt-8 rounded-2xl border border-[#F0E6D3] bg-white p-7 shadow-[0_8px_28px_rgba(13,43,30,0.045)] sm:p-9"><div className="flex items-start gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E6D3] font-serif text-sm font-bold text-[#8B5E3C]">{i + 1}</span><div><h2 className="font-serif text-xl font-semibold text-[#1B4332] sm:text-2xl">{title}</h2><p className="mt-4 text-[15px] leading-8 text-[#625D54]">{body}</p></div></div></section>)}</article>
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
                <p
                  className="text-white font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Daivajna Samaja
                </p>
                <p className="text-green-400 text-xs">Daivajna Samaja Community Portal</p>
              </div>
            </Link>
            {/* <div className="flex gap-6 flex-wrap justify-center">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Heritage Guidelines",
                "Contact Admin",
                "Community Governance",
              ].map((l) => (
                <Link key={l} href="#" className="text-green-400 text-sm hover:text-white transition-colors">
                  {l}
                </Link>
              ))}
            </div> */}

            <div className="flex gap-6 flex-wrap justify-center">
  {[
    // { label: "About Us", href: "/about-us" },
    // { label: "Contact Us", href: "/contact-us" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    // { label: "Heritage Guidelines", href: "/heritage-guidelines" },
    // { label: "Community Governance", href: "/governance" },
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
    Daivajna Samaj is a digital community and matrimony platform
    owned and operated by Credora Technologies (OPC) Private Limited.
  </p>

  <p className="text-green-500 text-xs">
    CIN: U62011KA2025OPC207972
  </p>

  <div className="flex flex-wrap justify-center gap-4 text-xs text-green-400">
    <a href="mailto:support@daivajnasamaj.in">
      support@daivajnasamaj.in
    </a>
    <a href="mailto:support@credora.info">
      support@credora.info
    </a>
    <a href="tel:+919880643606">
      +91 9880643606
    </a>
  </div>

  <p className="text-green-600 text-xs">
    © 2026 Credora Technologies (OPC) Private Limited.
    All rights reserved.
  </p>
</div>
        </div>
      </footer>
      {/* <footer className="bg-[#0D2B1E] px-6 py-10 text-center text-sm text-[#F0E6D3]"><p className="font-serif text-lg text-white">Daivajna Samaja</p><p className="mt-3">© {new Date().getFullYear()} Daivajna Samaja. All rights reserved.</p><div className="mt-4 flex justify-center gap-6"><a className="hover:text-white" href="/terms">Terms of Service</a><a className="hover:text-white" href="/privacy-policy">Privacy Policy</a></div></footer> */}
    </main>
  );
}
