"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Share2, TrendingUp, Users, Heart, Star, ArrowRight } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { apiGet } from "@/lib/api";

/** GET /api/welfare/impact — real totals aggregated from the donations. */
interface ImpactReport {
  totalRaised: number;
  donationCount: number;
  donorCount: number;
  allocation: { category: string; amount: number; pct: number }[];
  topDonors: { name: string; amount: number }[];
  upcomingGoals: { id: string; title: string; goal: number; raised: number; remaining: number }[];
}

/** Palette cycled through the allocation slices, whatever the categories are. */
const SLICE_COLORS = ["#1B4332", "#2D6A4F", "#8B5E3C", "#C4823A", "#52B788", "#6B4226"];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;

// Simple CSS donut chart using conic-gradient
function DonutChart({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  let cumulative = 0;
  const gradientStops = segments.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  });
  return (
    <div className="flex items-center gap-8">
      <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
        <div className="w-full h-full rounded-full" style={{
          background: `conic-gradient(${gradientStops.join(", ")})`,
        }} />
        <div className="absolute inset-6 rounded-full flex flex-col items-center justify-center"
          style={{ background: "white" }}>
          <p className="text-xl font-bold" style={{ color: "#1B4332", fontFamily: "'Playfair Display', serif" }}>100%</p>
          <p className="text-xs text-gray-400">Allocated</p>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map(a => (
          <div key={a.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-sm text-gray-600">{a.label}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: "#0D2B1E" }}>{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImpactReportPage() {
  const [report, setReport] = useState<ImpactReport | null>(null);

  useEffect(() => {
    apiGet<ImpactReport>("/api/welfare/impact").then(setReport).catch(() => {});
  }, []);

  const segments = useMemo(
    () => (report?.allocation ?? []).map((a, i) => ({
      label: a.category,
      pct: a.pct,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    })),
    [report],
  );

  return (
    <SidebarLayout title="Impact Report">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "#8B5E3C" }}>
            DAIVAJNA SAMAJA BANGALORE — ANNUAL TRANSPARENCY REPORT
          </p>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Heritage Impact 2024–25
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            A detailed record of our community&apos;s generous contributions and their measurable outcomes.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold hover:bg-gray-50"
            style={{ borderColor: "#DFC5A0", color: "#374151" }}>
            <Share2 size={14} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Hero stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: "Total Funds Raised", val: report ? inr(report.totalRaised) : "—",
            sub: report ? `Across ${report.donationCount} contribution${report.donationCount === 1 ? "" : "s"}` : "Loading…", color: "#1B4332" },
          { icon: Users,      label: "Contributors",       val: report ? String(report.donorCount) : "—",
            sub: "Named donors", color: "#2D6A4F" },
          { icon: Star,       label: "Active Initiatives", val: report ? String(report.upcomingGoals.length) : "—",
            sub: "Campaigns still open", color: "#8B5E3C" },
        ].map(({ icon: Icon, label, val, sub, color }) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: color + "18" }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color }}>{val}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Allocation + Donors */}
        <div className="lg:col-span-3 space-y-5">
          {/* Fund allocation */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Fund Allocation Breakdown
            </h3>
            {segments.length > 0
              ? <DonutChart segments={segments} />
              : <p className="text-sm text-gray-400 py-8 text-center">
                  No contributions recorded yet — the split appears here once donations come in.
                </p>}
            <p className="text-xs text-gray-400 mt-4 italic border-t pt-4" style={{ borderColor: "#F3F4F6" }}>
              &ldquo;Every rupee documented. Every decision transparent.&rdquo; — Daivajna Audit Committee
            </p>
          </div>

          {/* Guardian donors */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "#F3F4F6" }}>
              <h3 className="font-bold flex items-center gap-2" style={{ color: "#0D2B1E" }}>
                <Heart size={16} style={{ color: "#8B5E3C" }} fill="#8B5E3C" /> Guardian Donors
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>
                View All
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "#F9F9F9" }}>
              {(report?.topDonors ?? []).map((d, i) => (
                <motion.div key={d.name}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4">
                  <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    {d.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "#0D2B1E" }}>{d.name}</p>
                    <p className="text-xs text-gray-400">Contributor</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "#1B4332" }}>{inr(d.amount)}</span>
                </motion.div>
              ))}
              {report && report.topDonors.length === 0 && (
                <p className="text-sm text-gray-400 p-4">
                  No named contributions yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Story + Goals */}
        <div className="lg:col-span-2 space-y-5">
          {/* Feature story */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#DFC5A0" }}>
            <div className="relative h-44">
              <img
                src={`https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop`}
                alt="Temple restoration" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(13,43,30,0.9))" }} />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(212,175,122,0.9)", color: "white" }}>
                  Feature Story
                </span>
                <p className="text-white font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Restoring the Vamsha Tree Sanctuary
                </p>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600 leading-relaxed">
                The 200-year-old Kula Devata temple in Kundapura was restored using ₹4.25L raised from 328 Samaj donors.
                New structural reinforcements, traditional <em>Gopuram</em> carvings, and a digital archive of inscriptions
                were completed in 2024.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={PX(7485047)} alt="Beneficiary" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;This temple is proof that our Samaj never forgets its roots.&rdquo; — Priya K., Community Member
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming goals */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Upcoming Heritage Goals
            </h3>
            <div className="space-y-4">
              {(report?.upcomingGoals ?? []).map(g => {
                const progress = g.goal ? Math.round((g.raised / g.goal) * 100) : 0;
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-semibold" style={{ color: "#0D2B1E" }}>{g.title}</span>
                      <span className="text-xs text-gray-400">{inr(g.goal)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #1B4332, #52B788)" }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {progress}% funded · {inr(g.remaining)} to go
                    </p>
                  </div>
                );
              })}
              {report && report.upcomingGoals.length === 0 && (
                <p className="text-sm text-gray-400">Every campaign has reached its goal.</p>
              )}
            </div>
            <Link href="/welfare"
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#DFC5A0", color: "#1B4332" }}>
              Support a Campaign <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
