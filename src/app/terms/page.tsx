import type { Metadata } from "next";
import Link from "next/link";
import { TreePine } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Daivajna Samaja",
  description: "Terms governing access to and use of the Daivajna Samaja website and services.",
};

const sections = [
  ["Acceptance of these Terms", "These Terms of Service govern your access to and use of the Daivajna Samaja website, mobile application, member services and related features (collectively, the Services). By creating an account, accessing or using the Services, you agree to these Terms. If you do not agree, do not use the Services."],
  ["About the Services and Operator", "The Services are provided for community information, member engagement, cultural activities, communications and other features made available from time to time. The proposed operating entity is Credora Technologies (OPC) Private Limited (CIN: U62011KA2025OPC207972), acting for the Daivajna Samaja initiative. The parties’ precise roles and authority should be confirmed before publication."],
  ["Eligibility", "You must be legally capable of entering into a binding agreement to use the Services. Where a minor is permitted to participate, a parent or lawful guardian must provide any legally required consent and supervise use. Do not create an account using another person’s details."],
  ["Account Registration", "You agree to provide accurate, current and complete information during registration and to update it when it changes. You are responsible for activity carried out through your account and for keeping your login credentials and one-time passwords confidential."],
  ["Member Identity and Verification", "Some features may require verification of your mobile number, email address, membership details or other information. Verification does not guarantee the accuracy of information supplied by another member and does not create an endorsement or guarantee by the Samaja."],
  ["Account Security", "Notify the support team promptly if you suspect unauthorised access, loss of a device or compromise of your credentials. We may temporarily restrict access where reasonably necessary to protect members, the Services or the integrity of an account."],
  ["Member Profiles and Information", "You are responsible for information, photographs, contact details and other material you add to your profile. Do not impersonate another person, misrepresent your affiliation or publish information that you are not authorised to share."],
  ["Community Conduct", "Use the Services respectfully and lawfully. Harassment, hate speech, threats, discrimination, bullying, stalking, obscene content, unlawful material and targeted abuse are prohibited. Respect the dignity, privacy and traditions of other members."],
  ["Acceptable Use", "You must not probe, scan or test the vulnerability of the Services without written permission; interfere with their operation; bypass security; introduce malware; scrape or harvest data unlawfully; or use the Services for spam, fraud or any unlawful purpose."],
  ["User Content and Permissions", "You retain rights you hold in content you submit. You grant the Services a limited, non-exclusive, worldwide, royalty-free permission to host, store, reproduce, display and distribute that content only as needed to operate, secure and improve the Services and to carry out the purpose for which you submitted it. You confirm that you have the rights and permissions needed to submit it."],
  ["Content Moderation", "We may review, restrict, remove or disable access to content that appears to breach these Terms, applicable law or community standards. We may preserve relevant information where required for security, dispute handling or legal compliance."],
  ["Member-to-Member Interactions", "You are responsible for your interactions with other members. We do not independently verify every statement, offer, relationship or transaction between members. Exercise appropriate care before sharing sensitive information, meeting someone or relying on information supplied by another member."],
  ["Events, Activities and Announcements", "Event details, schedules, venues, speakers and participation requirements may change. Participation may be subject to separate registration, capacity limits, venue rules, safety requirements or event-specific terms. Follow instructions issued by authorised organisers."],
  ["Fees, Payments and Taxes", "Any applicable fees, prices, taxes and payment terms will be shown before you confirm a paid transaction. Do not assume that a contribution, membership fee, event fee or donation is refundable unless the applicable written terms expressly say so."],
  ["Cancellations and Refunds", "Cancellation windows, eligibility, processing timelines and any deductions must be stated in the applicable event or payment notice. The final refund policy and transaction-specific terms must be published and reviewed before paid services are offered. Nothing in these Terms limits rights that cannot lawfully be excluded."],
  ["Third-Party Services and Links", "The Services may link to or integrate third-party websites, payment processors, messaging providers, maps or other tools. Those services are operated by independent parties and may have their own terms and privacy notices. We are not responsible for third-party content or services to the extent permitted by law."],
  ["Intellectual Property", "The Services’ software, design, branding, logos, text and other materials are owned by or licensed to their respective rights holders and are protected by applicable intellectual property laws. You may use them only as permitted by law and these Terms. No ownership is transferred to you."],
  ["Feedback", "If you provide suggestions or feedback, you permit us to use them without restriction or compensation, provided this does not affect rights that cannot be waived under applicable law."],
  ["Privacy", "Our collection and use of personal information is described in the Privacy Policy available at /privacy-policy. The Privacy Policy forms part of the contractual framework for use of the Services. Please read it before using features that collect personal information."],
  ["Communications and Notifications", "We may send service, security, account, event and administrative communications through the contact channels you provide. Promotional communications will be sent only where permitted and with any consent required by law. You may use available unsubscribe or preference controls for promotional messages."],
  ["Service Availability and Changes", "We aim to keep the Services available but do not guarantee uninterrupted or error-free operation. We may add, modify, suspend or discontinue features for operational, security, legal or business reasons. Where reasonably practicable, we will provide notice of material changes."],
  ["Suspension and Termination", "We may suspend, restrict or terminate access where we reasonably believe there is a breach of these Terms, a security risk, unlawful activity, harm to members or a legal requirement. You may stop using the Services and request account closure using the published account-deletion process."],
  ["Account Deletion and Data", "You may request deletion of your account through the in-app process, where available, or by contacting the support address below. Certain records may be retained where required by law, for legitimate security purposes, to resolve disputes or to complete transactions. See the Privacy Policy for details and the applicable retention schedule."],
  ["Disclaimers", "To the extent permitted by law, the Services are provided on an “as available” basis. We do not warrant that information submitted by members is accurate, complete or current, or that the Services will always be secure, uninterrupted or compatible with every device. Statutory rights and warranties that cannot be excluded remain unaffected."],
  ["Limitation of Liability", "To the maximum extent permitted by applicable law, the operator and its personnel will not be liable for indirect, incidental, special or consequential loss arising from use of the Services. Nothing in these Terms excludes liability for fraud, wilful misconduct, death or personal injury caused by negligence, or any liability that cannot lawfully be excluded."],
  ["Indemnity", "To the extent permitted by law, you are responsible for losses and reasonable costs arising directly from your unlawful use of the Services, your breach of these Terms or your infringement of another person’s rights. This clause does not apply to the extent a loss is caused by our own breach or conduct for which liability cannot be excluded."],
  ["Changes to these Terms", "We may update these Terms from time to time. The revised version will be posted on this page with an updated effective date. If a change materially affects your rights or obligations, we will provide additional notice where required. Continued use after the effective date constitutes acceptance to the extent permitted by law."],
  ["Governing Law and Disputes", "These Terms are intended to be governed by the laws of India. Courts with competent jurisdiction in [CITY, STATE] will have jurisdiction, subject to mandatory consumer and other statutory rights. The final venue and dispute-resolution wording must be confirmed by Indian legal counsel before publication."],
  ["Severability and Waiver", "If any provision is held invalid or unenforceable, the remaining provisions will continue in effect to the extent possible. A failure or delay in enforcing a provision is not a waiver of the right to enforce it later."],
  ["Contact and Grievance Redressal", "For support or questions about these Terms, contact support@credora.info or support@daivajnasamaj.in, or call +91 9880643606. Grievance Officer: [NAME AND DESIGNATION]. Grievance email: [GRIEVANCE EMAIL]. Registered address: [CONFIRM AND INSERT REGISTERED OFFICE ADDRESS]. The grievance contact and response timelines must be verified and published before launch."],
];

export default function TermsPage() {
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
        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">Terms of Service</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#F0E6D3]">Please read these terms carefully before accessing or using our website, application and community services.</p>
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
    { label: "Privacy Policy", href: "/privacy" },
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
