"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Navigation } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { COMMUNITY_MEMBERS } from "@/lib/data";

// Assign rough Bengaluru-region coordinates to each member
const MEMBER_COORDS: Record<string, { lat: number; lng: number }> = {
  m1:  { lat: 13.3392, lng: 74.7449 }, // Kundapura
  m2:  { lat: 13.3392, lng: 74.7449 },
  m3:  { lat: 13.3392, lng: 74.7449 },
  m4:  { lat: 13.3392, lng: 74.7449 },
  m5:  { lat: 13.3392, lng: 74.7449 },
  m6:  { lat: 14.4264, lng: 74.4179 }, // Kumta
  m7:  { lat: 14.4264, lng: 74.4179 },
  m8:  { lat: 14.4264, lng: 74.4179 },
  m9:  { lat: 14.4264, lng: 74.4179 },
  m10: { lat: 12.9141, lng: 74.8560 }, // Mangaluru
  m11: { lat: 12.9141, lng: 74.8560 },
  m12: { lat: 12.9141, lng: 74.8560 },
  m13: { lat: 12.9141, lng: 74.8560 },
  m14: { lat: 12.9716, lng: 77.5946 }, // Bengaluru
  m15: { lat: 12.9716, lng: 77.5946 },
  m16: { lat: 12.9352, lng: 77.6245 },
  m17: { lat: 12.9784, lng: 77.6408 },
  m18: { lat: 12.9419, lng: 77.5732 },
  m19: { lat: 12.9243, lng: 77.5455 },
  m20: { lat: 13.0037, lng: 77.5662 },
  m21: { lat: 12.9279, lng: 77.5803 },
  m22: { lat: 13.3379, lng: 74.7443 }, // Udupi
  m23: { lat: 13.3379, lng: 74.7443 },
  m24: { lat: 18.5204, lng: 73.8567 }, // Pune
};

// Community Directory map — client only
const DirectoryMap = dynamic(() => import("@/components/DirectoryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{ background: "#F0FBF4", border: "1px solid #B7E4C7" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
          style={{ borderColor: "#1B4332", borderTopColor: "transparent" }} />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    </div>
  ),
});

const BRANCHES = ["All", "Kundapura", "Kumta", "Mangaluru", "Bengaluru", "Udupi", "Out-of-State"];
const GOTRAS   = ["All Gotras", "Kashyap", "Bharadwaja", "Vasishtha", "Atreya"];

export default function DirectoryPage() {
  const [search, setSearch]     = useState("");
  const [branch, setBranch]     = useState("All");
  const [gotra, setGotra]       = useState("All Gotras");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return COMMUNITY_MEMBERS.filter(m => {
      const matchBranch = branch === "All" || m.branch === branch;
      const matchGotra  = gotra === "All Gotras" || m.gotra === gotra;
      const q = search.toLowerCase();
      const matchSearch = !q
        || m.name.toLowerCase().includes(q)
        || m.occupation.toLowerCase().includes(q)
        || m.location.toLowerCase().includes(q);
      return matchBranch && matchGotra && matchSearch;
    });
  }, [search, branch, gotra]);

  const mapMembers = filtered.map(m => ({
    id: m.id,
    name: m.name,
    area: m.branch,
    address: m.location,
    photo: m.photo,
    lat: MEMBER_COORDS[m.id]?.lat ?? 12.972,
    lng: MEMBER_COORDS[m.id]?.lng ?? 77.594,
  }));

  const selectedMember = COMMUNITY_MEMBERS.find(m => m.id === selected);

  return (
    <SidebarLayout title="Community Directory">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Community Directory
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} of 1,428 families · Daivadnya Samaj Global Network
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, occupation…"
              className="pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none w-52"
              style={{ borderColor: "#E8D5BC" }} />
          </div>
          <select value={gotra} onChange={e => setGotra(e.target.value)}
            className="px-3 py-2.5 text-sm border rounded-xl outline-none" style={{ borderColor: "#E8D5BC" }}>
            {GOTRAS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Branch filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {BRANCHES.map(b => (
          <button key={b} onClick={() => setBranch(b)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style={branch === b
              ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
              : { borderColor: "#E8D5BC", color: "#374151" }
            }>
            {b}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6" style={{ minHeight: "calc(100vh - 260px)" }}>
        {/* ── LEFT: Member list ── */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "68vh" }}>
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm"
              style={{
                background: "white",
                borderColor: selected === m.id ? "#1B4332" : "#E8D5BC",
                boxShadow: selected === m.id ? "0 0 0 2px rgba(27,67,50,0.15)" : undefined,
              }}
              onClick={() => setSelected(selected === m.id ? null : m.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#0D2B1E" }}>{m.name}</p>
                      <p className="text-xs text-gray-500 truncate">{m.occupation}</p>
                    </div>
                    {m.verified && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: "#D1FAE5", color: "#065F46" }}>✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs flex items-center gap-1 text-gray-400">
                      <MapPin size={10} /> {m.location.split(",")[0]}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: "#F0FBF4", color: "#1B4332" }}>
                      {m.gotra} Gotra
                    </span>
                  </div>
                  {selected === m.id && (
                    <div className="mt-2 pt-2 border-t flex gap-2" style={{ borderColor: "#F3F4F6" }}>
                      <Link
                        href="/invitations"
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                        style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                        <Navigation size={11} /> Plan Visit
                      </Link>
                      <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                        style={{ borderColor: "#E8D5BC", color: "#374151" }}>
                        <Users size={11} /> View Profile
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={28} className="mx-auto mb-2" />
              <p className="text-sm font-semibold">No members found</p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Map ── */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ border: "1px solid #E8D5BC", minHeight: "500px" }}>
          <DirectoryMap
            members={mapMembers}
            highlighted={selected}
            onSelect={setSelected}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
