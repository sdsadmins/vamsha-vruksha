"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, TrendingUp, BarChart2 } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { WELFARE_CAMPAIGNS } from "@/lib/data";
import { getUser, type VVUser } from "@/lib/auth";

export default function WelfarePage() {
  const router = useRouter();
  const [user, setUser] = useState<VVUser | null>(null);
  const [donating, setDonating] = useState<string | null>(null);
  const [donated, setDonated] = useState<Record<string, boolean>>({});
  const [amount, setAmount] = useState("500");

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const handleDonate = (id: string) => {
    setDonating(id);
    setTimeout(() => {
      setDonating(null);
      setDonated((d) => ({ ...d, [id]: true }));
    }, 900);
  };

  return (
    <SidebarLayout title="Community Welfare">
      {/* Hero Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 lg:p-8 mb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 80% 50%, #C4823A44, transparent 60%)" }}
        />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-green-400 text-xs font-semibold mb-2 tracking-widest">
              COMMUNITY WELFARE &amp; DEVELOPMENT
            </p>
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome back, {user?.name.split(" ")[0] ?? "Member"}
            </h2>
            <p className="text-green-200 text-sm">
              Your generosity builds the Samaj tree, one contribution at a time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: "Total Raised", val: "₹42,50,000" },
              { label: "Active Projects", val: "08" },
              { label: "My Contributions", val: "₹1,15,000" },
              { label: "Match Score", val: "64%" },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-green-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
          {user?.role === "elder" && (
            <Link
              href="/welfare/campaign/new"
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)", color: "white" }}
            >
              <PlusCircle size={16} /> Start Campaign
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaigns — left 2 cols */}
        <div className="lg:col-span-2">
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
          >
            Active Fundraising Campaigns
          </h2>
          <div className="space-y-5">
            {WELFARE_CAMPAIGNS.map((c, i) => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: "white", borderColor: "#DFC5A0" }}
                >
                  <div className="flex">
                    {/* Image side */}
                    <div
                      className="w-32 shrink-0 flex items-center justify-center text-5xl"
                      style={{
                        background: `linear-gradient(160deg, ${i === 0 ? "#0D2B1E" : "#6B4226"}, ${i === 0 ? "#1B4332" : "#8B5E3C"})`,
                      }}
                    >
                      {c.image}
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold mr-2"
                            style={{ background: "#D1FAE5", color: "#065F46" }}
                          >
                            {c.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {c.daysLeft} days left · {c.backers} backers
                          </span>
                        </div>
                      </div>
                      <h3
                        className="font-bold text-lg mb-1"
                        style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
                      >
                        {c.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                        {c.description.slice(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold" style={{ color: "#1B4332" }}>
                              ₹{(c.raised / 100).toLocaleString("en-IN")}
                            </span>
                            <span className="text-gray-400">
                              of ₹{(c.goal / 100).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.5 + i * 0.2, duration: 1.2, ease: "easeOut" }}
                              style={{ background: "linear-gradient(90deg, #1B4332, #52B788)" }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/welfare/donate/${c.id}`}
                          className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                        >
                          Contribute →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right col: Quick Donate + Impact */}
        <div className="space-y-5">
          {/* Quick Donate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border p-5"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <h3
              className="font-bold mb-1 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
            >
              <TrendingUp size={18} style={{ color: "#1B4332" }} /> Quick Donate
            </h3>
            <p className="text-xs text-gray-400 mb-4">Contribute to the general welfare fund</p>
            <div className="flex gap-2 mb-3">
              {["500", "1000", "5000"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border transition-all"
                  style={
                    amount === a
                      ? {
                          background: "linear-gradient(135deg,#1B4332,#2D6A4F)",
                          color: "white",
                          borderColor: "#1B4332",
                        }
                      : { borderColor: "#DFC5A0", color: "#374151" }
                  }
                >
                  ₹{a}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none mb-3"
              style={{ borderColor: "#DFC5A0" }}
            />
            <button
              onClick={() => handleDonate("quick")}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{
                background: donated["quick"]
                  ? "#2D6A4F"
                  : "linear-gradient(135deg, #8B5E3C, #C4823A)",
              }}
            >
              {donated["quick"] ? "✓ Thank You! 🙏" : "Support Welfare"}
            </button>
          </motion.div>

          {/* Impact Report CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: "#DFC5A0" }}
          >
            <div className="p-5" style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
              <BarChart2 size={24} className="text-green-400 mb-2" />
              <p className="text-white font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Heritage Impact 2024–25
              </p>
              <p className="text-green-300 text-xs mb-4">
                See exactly where every rupee goes — full transparency report.
              </p>
              <Link
                href="/welfare/impact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)", color: "white" }}
              >
                View Impact Report →
              </Link>
            </div>
          </motion.div>

          {/* Impact Stories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border p-5"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <h3
              className="font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
            >
              Impact Stories
            </h3>
            <div className="space-y-3">
              {[
                {
                  emoji: "🎓",
                  title: "New Scholarship",
                  desc: "Asha Hegde from Gokarna received higher education grant.",
                  tag: "EDUCATION",
                },
                {
                  emoji: "🏥",
                  title: "Medical Support",
                  desc: "Emergency surgery covered for a Samaj member in Kumta.",
                  tag: "HEALTH",
                },
                {
                  emoji: "🏛️",
                  title: "Temple Restoration",
                  desc: "Kula Devata temple in Kundapura restored with welfare funds.",
                  tag: "HERITAGE",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ background: "#F7F0E8" }}
                >
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    <span
                      className="text-xs font-semibold mt-1 inline-block"
                      style={{ color: "#8B5E3C" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
}
