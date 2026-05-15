"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TreePine, Heart, Users, Shield, Calendar, ArrowRight, TrendingUp, Award, MapPin } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { getUser, type VVUser } from "@/lib/auth";
import { DASHBOARD_ACTIVITY, WELFARE_CAMPAIGNS, MATRIMONIAL_CANDIDATES } from "@/lib/data";

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  color,
  delay,
}: {
  icon: any;
  value: string;
  label: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "white",
        border: "1px solid #E8D5BC",
        boxShadow: "0 2px 16px rgba(27,67,50,0.06)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-6 translate-x-6"
        style={{ backgroundColor: color }}
      />
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            border: `1px solid ${color}33`,
          }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <TrendingUp size={14} className="text-green-500" />
      </div>
      <p
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
      >
        {value}
      </p>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </motion.div>
  );
}

const STAT_DATA = [
  { icon: Users,    value: "1,428", label: "Total Members",          sub: "+12 joined this week",        color: "#1B4332" },
  { icon: TreePine, value: "86",    label: "Active Trees",           sub: "Global connections mapped",   color: "#2D6A4F" },
  { icon: Shield,   value: "24",    label: "Pending Verifications",  sub: "Awaiting elder approval",     color: "#A67C52" },
  { icon: Calendar, value: "3",     label: "Upcoming Events",        sub: "Next: Annual Samaja Function",color: "#D4AF7A" },
];

const QUICK_ACTIONS = [
  { label: "View Family Tree",  icon: TreePine, href: "/family-tree",  desc: "Explore your lineage"  },
  { label: "Matrimonial Hub",   icon: Heart,    href: "/matrimonial",  desc: "47 active profiles"    },
  { label: "Welfare Portal",    icon: Users,    href: "/welfare",      desc: "₹42.5L raised"         },
  { label: "Elder Portal",      icon: Shield,   href: "/elder",        desc: "Community governance"  },
];

const ACTIVITY_ICONS: Record<string, string> = {
  archive: "📜",
  tree: "🌳",
  birthday: "🎂",
};

export default function DashboardPage() {
  const [user, setUser] = useState<VVUser | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  return (
    <SidebarLayout title="Dashboard">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl overflow-hidden mb-8 relative"
        style={{
          background:
            "linear-gradient(135deg, #0D2B1E 0%, #1B4332 60%, #2D6A4F 100%)",
          padding: "2px",
        }}
      >
        <div
          className="rounded-3xl p-8 lg:p-10 relative"
          style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 80% 50%, #D4AF7A22, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-green-400 text-xs font-semibold mb-2 tracking-widest">
                WELCOME BACK
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {user
                  ? `Namaskara, ${user.name.split(" ")[0]}!`
                  : "Namaskara!"}
              </h2>
              <p className="text-green-200 leading-relaxed max-w-lg">
                Explore your lineage, connect with family, and contribute to
                the Samaj community. Your heritage is preserved here.
              </p>
              {user && (
                <div className="flex items-center gap-3 mt-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: "rgba(212,175,122,0.2)",
                      color: "#D4AF7A",
                    }}
                  >
                    ✦ Gotra: {user.gotra}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: "rgba(82,183,136,0.2)",
                      color: "#95D5B2",
                    }}
                  >
                    <MapPin size={10} className="inline mr-1" />
                    {user.native.split(",")[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/family-tree"
                className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #A67C52, #D4AF7A)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(166,124,82,0.4)",
                }}
              >
                <TreePine size={16} /> View Tree
              </Link>
              <Link
                href="/welfare"
                className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border text-white"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <Heart size={16} /> Donate
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STAT_DATA.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.1 + i * 0.1} />
        ))}
      </div>

      {/* Main content: 3-column grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left + centre — Quick Actions & Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0D2B1E",
              }}
            >
              Quick Access
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {QUICK_ACTIONS.map(({ label, icon: Icon, href, desc }, i) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: "white", border: "1px solid #E8D5BC" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332, #2D6A4F)",
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "#0D2B1E" }}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-green-700 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0D2B1E",
                }}
              >
                Active Campaigns
              </h2>
              <Link
                href="/welfare"
                className="text-xs font-semibold"
                style={{ color: "#1B4332" }}
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {WELFARE_CAMPAIGNS.slice(0, 2).map((c) => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border"
                    style={{ background: "white", border: "1px solid #E8D5BC" }}
                  >
                    <span className="text-3xl">{c.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.title}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #1B4332, #52B788)",
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {pct}% · {c.daysLeft} days left
                      </p>
                    </div>
                    <Link
                      href="/welfare"
                      className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #1B4332, #2D6A4F)",
                      }}
                    >
                      Donate
                    </Link>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right column — Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0D2B1E",
              }}
            >
              Family Activity
            </h2>
            <Link
              href="/family-tree"
              className="text-xs font-semibold"
              style={{ color: "#1B4332" }}
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {DASHBOARD_ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-2xl border"
                style={{ background: "white", border: "1px solid #E8D5BC" }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img src={item.photo} alt={item.user} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{item.user}</span>{" "}
                    <span className="text-gray-600">{item.action}</span>{" "}
                    {item.detail && (
                      <span
                        className="font-semibold"
                        style={{ color: "#1B4332" }}
                      >
                        {item.detail}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
                <span className="text-lg">{ACTIVITY_ICONS[item.type]}</span>
              </motion.div>
            ))}
          </div>

          {/* Featured Matrimonial */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: "#0D2B1E" }}>
                Featured Matrimonial
              </h3>
              <Link
                href="/matrimonial"
                className="text-xs font-semibold"
                style={{ color: "#1B4332" }}
              >
                See all →
              </Link>
            </div>
            <Link
              href={`/matrimonial/${MATRIMONIAL_CANDIDATES[0].id}`}
              className="flex items-center gap-3 p-4 rounded-2xl border hover:shadow-md transition-all"
              style={{ background: "white", border: "1px solid #E8D5BC" }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: "#D4AF7A" }}>
                <img src={MATRIMONIAL_CANDIDATES[0].photo} alt={MATRIMONIAL_CANDIDATES[0].name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {MATRIMONIAL_CANDIDATES[0].name}
                </p>
                <p className="text-xs text-gray-500">
                  {MATRIMONIAL_CANDIDATES[0].age} yrs ·{" "}
                  {MATRIMONIAL_CANDIDATES[0].location}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
                >
                  ✓ Verified
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
}
