"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Heart, Shield, Search } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";

const CARD_BG_COLORS = ["c9a96e", "1a5c32", "8b0000", "2e3f5c"];

export default function MatrimonialPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const FILTERS = ["All", "Bride", "Groom", "Bengaluru", "Mumbai", "Delhi", "Kashyap Gotra"];

  return (
    <SidebarLayout title="Matrimonial Hub">
      {/* Elder Mediated Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5 mb-6 flex items-start gap-4"
        style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #A67C52, #D4AF7A)" }}
        >
          <Shield size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Elder-Mediated Flow
          </p>
          <p className="text-green-200 text-sm leading-relaxed">
            All matrimonial introductions in the Samaj network are facilitated by the Elder sub-committee to ensure
            cultural integrity, lineage authenticity, and family alignment. Every profile is verified by Aadhaar and
            peer vouching.
          </p>
        </div>
        <button
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors"
        >
          Register Profile →
        </button>
      </motion.div>

      {/* Search and Filter bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name, gotra, city..."
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border w-full outline-none"
            style={{ borderColor: "#E8D5BC", background: "white" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
              style={
                activeFilter === f
                  ? { background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "white", borderColor: "#1B4332" }
                  : { borderColor: "#E8D5BC", color: "#6B7280", background: "white" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {MATRIMONIAL_CANDIDATES.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group rounded-2xl overflow-hidden border cursor-pointer"
            style={{
              background: "white",
              borderColor: "#E8D5BC",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
            onClick={() => router.push(`/matrimonial/${c.id}`)}
          >
            {/* Photo header */}
            <div className="relative overflow-hidden" style={{ height: "180px" }}>
              <img
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(c.name)}&scale=85&backgroundColor=${CARD_BG_COLORS[i % CARD_BG_COLORS.length]}`}
                alt={c.name}
                className="w-full h-full object-cover"
              />
              {c.verified && (
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold"
                  style={{
                    background: "rgba(209,250,229,0.95)",
                    color: "#065F46",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  ✓ Verified
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Card content */}
            <div className="p-4 pt-2">
              <h3
                className="font-bold text-lg mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
              >
                {c.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {c.age} yrs · {c.location} · {c.gotra}
              </p>
              <div className="space-y-1.5 mb-4">
                {[
                  { label: "Education", val: c.education.split(",")[0] },
                  { label: "Works at", val: c.company },
                  { label: "Family", val: c.familyType + " · " + c.height },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-medium text-right max-w-32" style={{ color: "#1B4332" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all group-hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/matrimonial/${c.id}`);
                }}
              >
                <Heart size={14} /> Express Interest
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="text-center text-sm text-gray-500">
        Showing 4 of 47 profiles ·{" "}
        <span
          className="font-semibold cursor-pointer hover:underline"
          style={{ color: "#1B4332" }}
        >
          Load More Profiles
        </span>
      </div>
    </SidebarLayout>
  );
}
