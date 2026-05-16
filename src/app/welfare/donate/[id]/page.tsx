"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Shield, Award, CreditCard, Smartphone, Building, Heart } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { WELFARE_CAMPAIGNS } from "@/lib/data";

const PRESET_AMOUNTS = [500, 2000, 5000, 10000];

const IMPACT_MESSAGES: Record<number, string> = {
  500:   "Your ₹500 will fund stationery and books for one Samaj scholarship student.",
  2000:  "Your ₹2,000 will provide 10 bags of eco-friendly cement for the temple restoration.",
  5000:  "Your ₹5,000 sponsors one student's full semester through Daivajna Vidya Nidhi.",
  10000: "Your ₹10,000 covers a full mason's week of skilled heritage restoration work.",
};

type PayMethod = "upi" | "card" | "netbanking";
type DonationType = "onetime" | "monthly";

export default function DonatePage() {
  const { id } = useParams();
  const router = useRouter();
  const campaign = WELFARE_CAMPAIGNS.find(c => c.id === id) ?? WELFARE_CAMPAIGNS[0];

  const [donationType, setDonationType] = useState<DonationType>("onetime");
  const [amount, setAmount] = useState(2000);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [wantsCert, setWantsCert] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const pct = Math.round((campaign.raised / campaign.goal) * 100);
  const impactMsg = IMPACT_MESSAGES[finalAmount] ?? `Your ₹${finalAmount.toLocaleString("en-IN")} goes directly to ${campaign.title}.`;

  if (submitted) return (
    <SidebarLayout title="Contribution Confirmed">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #D1FAE5, #B7E4C7)" }}>
          <CheckCircle size={44} style={{ color: "#1B4332" }} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Dhanyavaad! 🙏
          </h2>
          <p className="text-gray-500 max-w-sm">
            Your contribution of <span className="font-bold" style={{ color: "#1B4332" }}>₹{finalAmount.toLocaleString("en-IN")}</span> to <em>{campaign.title}</em> has been received.
          </p>
          {wantsCert && (
            <p className="text-sm text-gray-400 mt-2">Your digital heritage certificate will be issued within 24 hours.</p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/welfare")}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            Back to Welfare Portal
          </button>
          <button onClick={() => router.push("/welfare/impact")}
            className="px-6 py-3 rounded-xl font-semibold border"
            style={{ borderColor: "#DFC5A0", color: "#1B4332" }}>
            View Impact Report
          </button>
        </div>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout title="Make a Contribution">
      {/* Back */}
      <div className="mb-6">
        <Link href="/welfare" className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "#1B4332" }}>
          <ArrowLeft size={15} /> Back to Welfare Portal
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Campaign info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Campaign card */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#DFC5A0" }}>
            <div className="h-40 flex items-center justify-center text-6xl"
              style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
              {campaign.image}
            </div>
            <div className="p-5 bg-white">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "#D1FAE5", color: "#065F46" }}>
                {campaign.category}
              </span>
              <h3 className="font-bold text-lg mt-2 mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{campaign.description}</p>
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: "#1B4332" }}>
                    ₹{(campaign.raised / 100).toLocaleString("en-IN")} raised
                  </span>
                  <span className="text-gray-400">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1B4332, #52B788)" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{campaign.daysLeft} days left · {campaign.backers} contributors</p>
              </div>
            </div>
          </div>

          {/* Transparency pledge */}
          <div className="rounded-2xl p-5 border" style={{ background: "#F0FBF4", borderColor: "#B7E4C7" }}>
            <div className="flex items-start gap-3">
              <Shield size={20} style={{ color: "#1B4332" }} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "#065F46" }}>Transparency Pledge</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The Daivajna Samaja Samiti guarantees that 100% of your contribution goes directly to the project. Our payment gateway flows directly to a monitored committee account, published quarterly in the <Link href="/welfare/impact" className="underline">Impact Report</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Donation form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#DFC5A0" }}>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Make a Contribution
            </h2>
            <p className="text-sm text-gray-400 mb-5">Every seed grows a legacy for the next generation.</p>

            {/* Donation type tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "#F3F4F6" }}>
              {(["onetime", "monthly"] as const).map(t => (
                <button key={t} onClick={() => setDonationType(t)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={donationType === t
                    ? { background: "white", color: "#0D2B1E", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                    : { color: "#6B7280" }
                  }>
                  {t === "onetime" ? "One-time Donation" : "Monthly Pledge"}
                </button>
              ))}
            </div>

            {/* Amount selector */}
            <p className="text-xs font-semibold text-gray-500 mb-2">SELECT AMOUNT (₹)</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_AMOUNTS.map(a => (
                <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className="py-3 rounded-xl text-sm font-bold border transition-all"
                  style={amount === a && !customAmount
                    ? { background: "linear-gradient(135deg,#1B4332,#2D6A4F)", color: "white", borderColor: "#1B4332" }
                    : { borderColor: "#DFC5A0", color: "#374151" }
                  }>
                  ₹{a.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="✏ Enter Custom Amount"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setAmount(0); }}
              className="w-full px-4 py-3 text-sm border rounded-xl outline-none mb-4"
              style={{ borderColor: "#DFC5A0" }}
            />

            {/* Impact message */}
            <AnimatePresence mode="wait">
              <motion.div key={finalAmount}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="rounded-xl p-3 mb-5 flex items-start gap-3"
                style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}>
                <span className="text-lg shrink-0">💡</span>
                <p className="text-sm text-amber-800">{impactMsg}</p>
              </motion.div>
            </AnimatePresence>

            {/* Donor message */}
            <p className="text-xs font-semibold text-gray-500 mb-2">DONOR MESSAGE (OPTIONAL)</p>
            <textarea
              rows={2}
              placeholder="Write a dedication or note for the community archive…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl outline-none resize-none mb-4"
              style={{ borderColor: "#DFC5A0" }}
            />

            {/* Digital certificate */}
            <div className="flex items-center gap-3 p-4 rounded-xl mb-5 cursor-pointer"
              style={{ background: "#F7F0E8", border: "1px solid #DFC5A0" }}
              onClick={() => setWantsCert(!wantsCert)}>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={wantsCert ? { background: "#1B4332" } : { border: "2px solid #D1D5DB" }}>
                {wantsCert && <CheckCircle size={13} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Award size={14} style={{ color: "#8B5E3C" }} /> Receive Digital Heritage Certificate
                </p>
                <p className="text-xs text-gray-400">A personalised Samaj contribution certificate, archived permanently in your profile.</p>
              </div>
            </div>

            {/* Payment method */}
            <p className="text-xs font-semibold text-gray-500 mb-2">PAYMENT METHOD</p>
            <div className="space-y-2 mb-6">
              {([
                { id: "upi",        icon: Smartphone, label: "UPI / QR Code" },
                { id: "card",       icon: CreditCard, label: "Credit / Debit Card" },
                { id: "netbanking", icon: Building,   label: "Net Banking" },
              ] as { id: PayMethod; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; label: string }[]).map(({ id: pid, icon: Icon, label }) => (
                <div key={pid}
                  className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all"
                  style={payMethod === pid
                    ? { borderColor: "#1B4332", background: "#F0FBF4" }
                    : { borderColor: "#DFC5A0", background: "white" }
                  }
                  onClick={() => setPayMethod(pid)}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={payMethod === pid ? { borderColor: "#1B4332" } : { borderColor: "#D1D5DB" }}>
                    {payMethod === pid && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1B4332" }} />}
                  </div>
                  <Icon size={16} style={{ color: payMethod === pid ? "#1B4332" : "#6B7280" }} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={() => setSubmitted(true)}
              disabled={finalAmount === 0}
              className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 20px rgba(27,67,50,0.3)" }}>
              <Heart size={18} fill="white" /> Contribute ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "—"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">
              Secured by Daivajna Samaja Samiti. By contributing, you agree to the{" "}
              <span className="underline cursor-pointer">Community Welfare Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
