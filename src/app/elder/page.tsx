"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Shield, TreePine, AlertTriangle,
  Settings, FileText, Calendar, CheckCircle, TrendingUp,
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { ELDER_QUEUE, VERIFICATION_REQUESTS } from "@/lib/data";
import { getUser, type VVUser } from "@/lib/auth";

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;
const ELDER_QUEUE_PHOTOS = [PX(7345266), PX(30004176)];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const GROWTH  = [42, 55, 62, 70, 80, 95];

export default function ElderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<VVUser | null>(null);
  const [vouched, setVouched] = useState<string[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
  }, [router]);

  const firstName = user?.name.split(" ")[0] ?? "Elder";

  return (
    <SidebarLayout title="Elder Portal" requiredRole="elder">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden mb-7 relative"
        style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 80% 50%, #C4823A44, transparent 60%)" }} />
        <div className="relative p-7 lg:p-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-green-400 text-xs font-semibold tracking-widest mb-2">ELDER PORTAL · DAIVAJNA SAMAJA</p>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back, {firstName}
            </h2>
            <p className="text-sm font-semibold text-amber-300 mb-1">Guardian of the Tree</p>
            <p className="text-green-200 text-sm max-w-lg">
              Your lineage oversight and community management dashboard. Review pending verifications, resolve conflicts, and guide the Samaja.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { val: "1,428", label: "Total Members", sub: "+12 this week" },
              { val: "24",    label: "Pending",        sub: "High priority" },
              { val: "86",    label: "Active Trees",   sub: "Global" },
              { val: "+18%",  label: "Growth",         sub: "This quarter" },
            ].map(({ val, label, sub }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-green-300 text-xs font-semibold">{label}</p>
                <p className="text-green-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* Pending Verifications table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
              <h2 className="font-bold text-lg flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "#D97706" }}>!</span>
                Pending Verifications
              </h2>
              <Link href="/elder/verifications" className="text-xs font-semibold hover:underline" style={{ color: "#1B4332" }}>
                View all 24 →
              </Link>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-5 gap-3 px-5 py-2 text-xs font-semibold text-gray-400 border-b" style={{ borderColor: "#F3F4F6" }}>
              <span className="col-span-2">Member</span>
              <span>Lineage Claim</span>
              <span>Date</span>
              <span className="text-right">Actions</span>
            </div>

            {VERIFICATION_REQUESTS.slice(0, 4).map((req, i) => (
              <div key={req.id} className={`grid grid-cols-5 gap-3 items-center px-5 py-4 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "#F9F5F0" }}>
                {/* Member */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <img src={req.photo} alt={req.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0D2B1E" }}>{req.name}</p>
                    <p className="text-xs text-gray-400">{req.gotra} Gotra</p>
                  </div>
                </div>
                {/* Claim */}
                <div>
                  <p className="text-xs text-gray-600 truncate">{req.claimingFrom}</p>
                  <p className="text-xs text-gray-400 truncate">{req.claimingAncestor}</p>
                </div>
                {/* Date */}
                <p className="text-xs text-gray-400">{req.submittedOn}</p>
                {/* Actions */}
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setVouched(v => [...v, req.id])}
                    className="px-3 py-1.5 text-xs rounded-lg font-semibold text-white transition-all"
                    style={{ background: vouched.includes(req.id) ? "#2D6A4F" : "linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                    {vouched.includes(req.id) ? "✓" : "Vouch"}
                  </button>
                  <Link href={`/elder/verifications/${req.id}`}
                    className="px-3 py-1.5 text-xs rounded-lg font-semibold border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#DFC5A0", color: "#4B5563" }}>
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tree Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: "#F3F4F6" }}>
              <AlertTriangle size={18} className="text-amber-500" />
              <h2 className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                Tree Alerts &amp; Conflicts
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {[
                {
                  type: "⚠️", title: "Potential Duplicate Detected",
                  desc: '"Ananth Rao (1892–1954)" appears in both Mysore and Bangalore branches with conflicting parentage.',
                  primaryLabel: "Resolve Now", primaryHref: "/elder/conflict/ck-1",
                },
                {
                  type: "⛓️", title: "Lineage Conflict",
                  desc: 'Conflicting parentage for "Savitri Bai Shet". Three descendants provide different accounts.',
                  primaryLabel: "Open Mediation", primaryHref: "/elder/conflict/ck-2",
                },
              ].map(({ type, title, desc, primaryLabel, primaryHref }) => (
                <div key={title} className="p-4 flex gap-3">
                  <span className="text-2xl shrink-0">{type}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: "#0D2B1E" }}>{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{desc}</p>
                    <div className="flex gap-2">
                      <Link href={primaryHref}
                        className="px-3 py-1.5 text-xs rounded-lg font-semibold border hover:bg-green-50 transition-colors"
                        style={{ borderColor: "#1B4332", color: "#1B4332" }}>
                        {primaryLabel}
                      </Link>
                      <button className="px-3 py-1.5 text-xs rounded-lg font-semibold border hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "#DFC5A0", color: "#6B7280" }}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border p-5"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                Community Growth
              </h3>
              <span className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: "#D1FAE5", color: "#065F46" }}>
                <TrendingUp size={11} /> +18%
              </span>
            </div>
            <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
              {MONTHS.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div className="w-full rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${GROWTH[i]}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                    style={{ background: i === MONTHS.length - 1 ? "#1B4332" : "#B7E4C7" }} />
                  <span className="text-xs text-gray-400">{m}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Management Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <h3 className="font-bold p-4 border-b"
              style={{ borderColor: "#F3F4F6", fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Management Quick Links
            </h3>
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {[
                { icon: Calendar, label: "Manage Events",         href: "/elder/events" },
                { icon: Settings, label: "Verification Settings", href: "/elder/verifications" },
                { icon: FileText, label: "Digital Archive",       href: "/elder/archive" },
                { icon: Users,    label: "Member Directory",      href: "/elder/members" },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon size={16} style={{ color: "#1B4332" }} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl border p-5"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            <h3 className="font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🌱", text: "New member 'Siddharth Nair' joined from Mangaluru branch", time: "2h ago" },
                { icon: "🌳", text: "Tree update: 'Shrinivas Bhat' lineage roots connected", time: "5h ago" },
                { icon: "📂", text: "Digital archive: temple photos batch uploaded", time: "1d ago" },
              ].map(({ icon, text, time }) => (
                <div key={text} className="flex gap-3 text-sm">
                  <span className="text-base shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-gray-700 text-xs leading-relaxed">{text}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Elder Wisdom */}
          <div className="rounded-2xl p-5" style={{ background: "linear-gradient(160deg, #0D2B1E, #1B4332)" }}>
            <p className="text-green-400 text-xs font-semibold mb-2 tracking-widest">LINEAGE WISDOM</p>
            <blockquote className="text-white italic text-sm leading-relaxed"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              &ldquo;A tree without roots is just wood; a community without history is just a crowd.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
