"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  TreePine,
  AlertTriangle,
  Settings,
  FileText,
  Calendar,
  CheckCircle,
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { ELDER_QUEUE } from "@/lib/data";
import { getUser } from "@/lib/auth";

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;
const ELDER_QUEUE_PHOTOS = [PX(7345266), PX(30004176)];

export default function ElderDashboard() {
  const router = useRouter();
  const [vouched, setVouched] = useState<string[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u) router.push("/login");
  }, [router]);

  const STATS = [
    { label: "Total Members", val: "1,428", sub: "+12 this week", icon: Users, color: "#1B4332", href: "/elder/members" },
    { label: "Pending Verifications", val: "24", sub: "↑ High priority", icon: Shield, color: "#D97706", href: "/elder/verifications" },
    { label: "Active Trees", val: "86", sub: "Global connections", icon: TreePine, color: "#1B4332", href: "/family-tree" },
  ];

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"];
  const GROWTH = [55, 62, 70, 80, 95];

  return (
    <SidebarLayout title="Elder Portal">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map(({ label, val, sub, icon: Icon, color, href }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={href} className="block rounded-2xl p-5 border hover:shadow-md transition-shadow cursor-pointer"
              style={{ background: "white", borderColor: "#E8D5BC" }}>
              <div className="flex justify-between items-start mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: color === "#D97706" ? "#FEF3C7" : "#D1FAE5" }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                {color === "#D97706" && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "#FEF3C7", color: "#D97706" }}>
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif", color }}>
                {val}
              </p>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Verification Queue + Alerts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#E8D5BC" }}
          >
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: "#F3F4F6" }}
            >
              <h2
                className="font-bold text-lg flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "#D97706" }}
                >
                  !
                </span>
                Needs Your Vouch
              </h2>
              <Link href="/elder/verifications" className="text-xs font-semibold" style={{ color: "#1B4332" }}>
                View all 24 →
              </Link>
            </div>
            {ELDER_QUEUE.map((member, i) => (
              <div
                key={member.id}
                className={`p-5 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "#F3F4F6" }}
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={ELDER_QUEUE_PHOTOS[i]}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{member.name}</h3>
                    <p className="text-sm text-gray-500">Claiming from: {member.claimingFrom}</p>
                    <p className="text-xs mt-1" style={{ color: "#1B4332" }}>
                      {member.relation}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.hasDocument && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#D1FAE5", color: "#065F46" }}
                        >
                          📄 Document Attached
                        </span>
                      )}
                      {member.hasPhoto && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#EDE9FE", color: "#5B21B6" }}
                        >
                          📷 Photo Proof
                        </span>
                      )}
                      {member.vouches > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#FEF3C7", color: "#D97706" }}
                        >
                          ✓ Vouched ({member.vouches})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setVouched((v) => [...v, member.id])}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all"
                    style={{
                      background: vouched.includes(member.id)
                        ? "#2D6A4F"
                        : "linear-gradient(135deg, #1B4332, #2D6A4F)",
                    }}
                  >
                    <CheckCircle size={16} />
                    {vouched.includes(member.id) ? "Vouched ✓" : "Vouch"}
                  </button>
                  <Link
                    href={`/elder/verifications/${member.id}`}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 flex items-center justify-center"
                    style={{ borderColor: "#E8D5BC", color: "#4B5563" }}
                  >
                    🔍 Review Records
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tree Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#E8D5BC" }}
          >
            <div
              className="p-5 border-b flex items-center gap-2"
              style={{ borderColor: "#F3F4F6" }}
            >
              <AlertTriangle size={18} className="text-amber-500" />
              <h2
                className="font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
              >
                Tree Alerts &amp; Conflicts
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {[
                {
                  type: "⚠️",
                  id: "ck-1",
                  title: "Potential Duplicate Detected",
                  desc: 'Profile "Ananth Rao (1892–1954)" in the Mysore branch matches the Bangalore branch. Elder intervention required.',
                  primaryLabel: "Resolve Now",
                  primaryHref: "/elder/conflict/ck-1",
                },
                {
                  type: "⛓️",
                  id: "ck-2",
                  title: "Lineage Conflict",
                  desc: 'Conflicting parentage for "Savitri Bai". Three descendants provide different genealogical accounts from oral history.',
                  primaryLabel: "Open Mediation",
                  primaryHref: "/elder/conflict/ck-2",
                },
              ].map(({ type, title, desc, primaryLabel, primaryHref }) => (
                <div key={title} className="p-4 flex gap-3">
                  <span className="text-2xl shrink-0">{type}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{desc}</p>
                    <div className="flex gap-2">
                      <Link
                        href={primaryHref}
                        className="px-3 py-1.5 text-xs rounded-lg font-semibold border hover:bg-green-50 transition-colors"
                        style={{ borderColor: "#1B4332", color: "#1B4332" }}
                      >
                        {primaryLabel}
                      </Link>
                      <button
                        className="px-3 py-1.5 text-xs rounded-lg font-semibold border hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "#E8D5BC", color: "#6B7280" }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Growth Chart + Management */}
        <div className="space-y-5">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border p-5"
            style={{ background: "white", borderColor: "#E8D5BC" }}
          >
            <h3
              className="font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
            >
              Community Growth
            </h3>
            <div className="flex items-end gap-2" style={{ height: "100px" }}>
              {MONTHS.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${GROWTH[i]}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    style={{ backgroundColor: i === 4 ? "#1B4332" : "#B7E4C7" }}
                  />
                  <span className="text-xs text-gray-400">{m}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Growth:{" "}
              <span className="font-bold" style={{ color: "#1B4332" }}>
                +18%
              </span>{" "}
              this quarter
            </p>
          </motion.div>

          {/* Management Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "white", borderColor: "#E8D5BC" }}
          >
            <h3
              className="font-bold p-4 border-b"
              style={{
                borderColor: "#F3F4F6",
                fontFamily: "'Playfair Display', serif",
                color: "#0D2B1E",
              }}
            >
              Management
            </h3>
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {[
                { icon: Calendar, label: "Manage Events",          href: "/elder/events" },
                { icon: Settings, label: "Verification Settings",  href: "/elder/verifications" },
                { icon: FileText, label: "Digital Archive",        href: "/elder/archive" },
                { icon: Users,    label: "Member Directory",       href: "/elder/members" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} style={{ color: "#1B4332" }} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Elder Wisdom */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "linear-gradient(160deg, #0D2B1E, #1B4332)" }}
          >
            <p className="text-green-400 text-xs font-semibold mb-2 tracking-widest">
              ARCHIVAL NOTE #412
            </p>
            <blockquote
              className="text-white italic text-sm leading-relaxed"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              &ldquo;A tree without roots is just wood; a community without history is just a
              crowd.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
