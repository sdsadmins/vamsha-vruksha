import type { Metadata } from "next";
import { Trash2, Mail, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Delete your account — Daivajna Samaja",
  description:
    "How to delete your Daivajna Samaja account and exactly what is removed.",
};

/**
 * Play requires a publicly reachable page describing account deletion, reachable
 * without installing the app — so this is deliberately a plain server-rendered
 * page behind no login.
 */
export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#FEE2E2", color: "#991B1B" }}>
            <Trash2 size={20} />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Delete your account
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-9">
          Daivajna Samaja · Vamsha Vruksha
        </p>

        <div className="rounded-2xl border bg-white p-6 mb-6" style={{ borderColor: "#DFC5A0" }}>
          <h2 className="font-bold mb-3 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
            <Smartphone size={17} /> From the app
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-gray-700">
            <li>Open Daivajna Samaj and sign in.</li>
            <li>Go to <strong>More → Profile</strong>.</li>
            <li>Choose <strong>Delete my account</strong> and confirm.</li>
          </ol>
          <p className="text-sm text-gray-500 mt-3">
            The account is deleted straight away. There is no waiting period and it cannot be undone.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 mb-9" style={{ borderColor: "#DFC5A0" }}>
          <h2 className="font-bold mb-3 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
            <Mail size={17} /> By email
          </h2>
          <p className="text-[15px] text-gray-700">
            If you cannot access the app, write to us from the email address on your
            account, or tell us the phone number you registered with, and ask for your
            account to be deleted. We will confirm your identity, action it within 30
            days, and write back when it is done.
          </p>
          <p className="mt-3 text-[15px]">
            {/* TODO: replace with the monitored address used on the Play listing. */}
            <span className="font-semibold">[contact email to be added]</span>
          </p>
        </div>

        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
          What is removed
        </h2>
        <div className="rounded-2xl border p-5 mb-5" style={{ background: "#F0FBF4", borderColor: "#1B4332" }}>
          <p className="font-semibold mb-2 text-[15px]" style={{ color: "#0D2B1E" }}>Deleted immediately</p>
          <p className="text-[15px] text-gray-700">
            Your account and login. Your posts, stories, photographs, comments and likes.
            Your direct messages. Your connections. Your matrimonial profile and birth
            details. Any outstanding verification codes.
          </p>
        </div>

        <div className="rounded-2xl border p-5 mb-6" style={{ background: "#FFF8EC", borderColor: "#DFC5A0" }}>
          <p className="font-semibold mb-2 text-[15px]" style={{ color: "#0D2B1E" }}>Kept, with your identity removed</p>
          <p className="text-[15px] text-gray-700 mb-2">
            <strong>Your place in the family tree.</strong> A family tree is built jointly
            by relatives. Removing your node outright would break the branches either
            side of it in their trees, which they created. The node therefore remains as a
            genealogical record, while your phone number, photograph, date of birth and
            biography are erased and the link to your account is severed.
          </p>
          <p className="text-[15px] text-gray-700">
            <strong>Your donations.</strong> Donation records form part of a welfare
            campaign&apos;s running total, which the whole community can see. The record is
            kept and your name replaced with &ldquo;Deleted member&rdquo;.
          </p>
        </div>

        <p className="text-[15px] text-gray-700">
          If you would prefer your family-tree node removed entirely, write to us and we
          will discuss what can be done without damaging other members&apos; records.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          See also our{" "}
          <a href="/privacy" className="underline" style={{ color: "#1B4332" }}>
            privacy policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
