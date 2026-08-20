import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Daivajna Samaja",
  description:
    "What the Daivajna Samaja platform collects, why, who it is shared with, and how to have it deleted.",
};

const UPDATED = "20 August 2026";
const CONTROLLER = "Credora OPC Technologies Pvt Ltd";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Daivajna Samaja · Vamsha Vruksha · last updated {UPDATED}
        </p>

        <Section title="Who we are">
          <p>
            The Daivajna Samaja platform — this website and the Daivajna Samaj mobile
            app — is operated by {CONTROLLER}. We decide what member data is collected
            and why, which makes us the data controller for it.
          </p>
        </Section>

        <Section title="What we collect">
          <p>Only what the platform needs to work. Some of it is required to hold an account; the rest you choose to add.</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Required:</strong> your name, phone number, email address, and the community details that place you in the Samaja — gotra and native place.</li>
            <li><strong>Your profile, if you add it:</strong> photograph, gender, date of birth, occupation, a short biography, and your address.</li>
            <li><strong>Location:</strong> approximate and precise location, used to place you on the community directory map and to plan visit routes. Only if you grant the permission.</li>
            <li><strong>Family tree:</strong> the relatives you record, including their names and relationships, and the phone number you use to invite them.</li>
            <li><strong>Matrimonial, if you opt in:</strong> your profile details, and birth details for horoscope matching. Birth details are only shared with another member when you both consent.</li>
            <li><strong>What you post:</strong> posts, stories, photographs, videos, comments, and direct messages to other members.</li>
            <li><strong>Welfare:</strong> a record of donations you make, including the amount and the campaign.</li>
            <li><strong>Technical:</strong> your account activity and the one-time codes used to verify your phone or email.</li>
          </ul>
        </Section>

        <Section title="Why we use it">
          <p>
            To create and verify your account; to build and connect family trees; to let
            members find one another in the directory; to run the matrimonial service;
            to record welfare contributions; and to let elders of the Samaja review new
            members before they appear in the directory.
          </p>
          <p>
            We do not sell your data, and we do not use it for advertising or profiling.
          </p>
        </Section>

        <Section title="What other members can see">
          <p>
            The platform is a community directory, so parts of your profile are visible
            to other verified members: your name, gotra, native place, photograph, and
            your approximate location on the directory map. Your phone number is hidden
            unless you choose to show it.
          </p>
          <p>
            A family tree is shared by the family. Relatives you are connected to can see
            the relationships you record, and you appear in the trees they build.
          </p>
        </Section>

        <Section title="Who else receives it">
          <p>We use a small number of service providers, and only for the purpose listed:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>2Factor</strong> (India) — your phone number, to send one-time codes by SMS.</li>
            <li><strong>Brevo</strong> — your email address, to send one-time codes by email.</li>
            <li><strong>Cloudinary</strong> — photographs and videos you upload, for storage and delivery.</li>
            <li><strong>OpenStreetMap / Nominatim</strong> — addresses, to turn them into map coordinates and to draw maps.</li>
            <li><strong>MongoDB Atlas</strong> — hosts the database.</li>
          </ul>
          <p>
            We may also disclose data where the law requires it. Nobody else receives your
            data.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Your account data is kept while your account exists. One-time codes are
            deleted within minutes of being used or expiring. If you delete your account,
            see below for exactly what is removed and what remains.
          </p>
        </Section>

        <Section title="Deleting your account">
          <p>
            You can delete your account at any time, from the app or by writing to us —
            see <a href="/delete-account" className="underline" style={{ color: "#1B4332" }}>daivajnasamaj.in/delete-account</a>.
          </p>
          <p><strong>Deleted immediately:</strong> your account and login, your posts, stories, comments, likes, direct messages, connections, matrimonial profile and birth details.</p>
          <p>
            <strong>Kept, with your identity removed:</strong> your node in the family tree,
            and your donation records. A family tree is built jointly by relatives, and
            deleting your node outright would break the branches either side of it in
            their trees — so the node stays as a genealogical record while your contact
            details are erased and the link to your account is severed. Donation records
            are kept because they form part of a campaign&apos;s public total; your name is
            replaced.
          </p>
          <p>If you would rather that node were removed entirely, write to us and we will discuss what is possible without damaging other members&apos; records.</p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us for a copy of your data, ask us to correct it, ask us to delete
            it, or object to how we use it. Contact us and we will respond within 30 days.
          </p>
        </Section>

        <Section title="Children">
          <p>
            The platform is intended for adults. We do not knowingly create accounts for
            children under 13. If you believe a child has registered, tell us and we will
            remove the account.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Traffic between your device and our servers is encrypted with HTTPS. One-time
            codes are stored only as a hash, never in readable form. Access to the
            database is restricted to the platform.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes materially we will update the date at the top and, where
            the change affects how your data is used, tell you in the app.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            {CONTROLLER}<br />
            Bengaluru, Karnataka, India<br />
            {/* TODO: replace with the monitored address used on the Play listing. */}
            Email: <span className="font-semibold">[contact email to be added]</span>
          </p>
        </Section>
      </div>
    </main>
  );
}
