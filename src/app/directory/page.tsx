"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Navigation, Filter, UserPlus } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { apiGet } from "@/lib/api";
import { COMMUNITY_MEMBERS } from "@/lib/data";

/** A row from GET /api/user/directory — deliberately PII-light. */
interface DbUser {
  id: string;
  samajId: string;
  userName: string;
  name: string;
  gotra: string;
  native: string;
  occupation: string;
  profileUrl: string;
  verified: boolean;
  role: string;
  isPurohit: boolean;
}

interface DirectoryResponse {
  count: number;
  page: number;
  limit: number;
  users: DbUser[];
}

const MEMBER_COORDS: Record<string, { lat: number; lng: number }> = {
  m1:  { lat: 13.3392, lng: 74.7449 },
  m2:  { lat: 13.3392, lng: 74.7449 },
  m3:  { lat: 13.3392, lng: 74.7449 },
  m4:  { lat: 13.3392, lng: 74.7449 },
  m5:  { lat: 13.3392, lng: 74.7449 },
  m6:  { lat: 14.4264, lng: 74.4179 },
  m7:  { lat: 14.4264, lng: 74.4179 },
  m8:  { lat: 14.4264, lng: 74.4179 },
  m9:  { lat: 14.4264, lng: 74.4179 },
  m10: { lat: 12.9141, lng: 74.8560 },
  m11: { lat: 12.9141, lng: 74.8560 },
  m12: { lat: 12.9141, lng: 74.8560 },
  m13: { lat: 12.9141, lng: 74.8560 },
  m14: { lat: 12.9716, lng: 77.5946 },
  m15: { lat: 12.9716, lng: 77.5946 },
  m16: { lat: 12.9352, lng: 77.6245 },
  m17: { lat: 12.9784, lng: 77.6408 },
  m18: { lat: 12.9419, lng: 77.5732 },
  m19: { lat: 12.9243, lng: 77.5455 },
  m20: { lat: 13.0037, lng: 77.5662 },
  m21: { lat: 12.9279, lng: 77.5803 },
  m22: { lat: 13.3379, lng: 74.7443 },
  m23: { lat: 13.3379, lng: 74.7443 },
  m24: { lat: 18.5204, lng: 73.8567 },
};

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
const GOTRAS   = ["Gotra: All", "Kashyap", "Bharadwaja", "Vasishtha", "Atreya"];

const AREA_LABELS: Record<string, string> = {
  Kundapura:    "KUNDAPURA · UDUPI",
  Kumta:        "KUMTA · UTTARA KANNADA",
  Mangaluru:    "MANGALURU CENTRAL",
  Bengaluru:    "BENGALURU URBAN",
  Udupi:        "UDUPI CENTRAL",
  "Out-of-State": "OUT OF STATE",
};

export default function DirectoryPage() {
  const [search, setSearch]     = useState("");
  const [branch, setBranch]     = useState("All");
  const [gotra, setGotra]       = useState("Gotra: All");
  const [selected, setSelected] = useState<string | null>(null);
  const [dbUsers, setDbUsers]   = useState<DbUser[]>([]);

  // The real member directory, searched server-side. Debounced so typing does
  // not fire a request per keystroke.
  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(() => {
      apiGet<DirectoryResponse>("/api/user/directory", {
        query: { q: search.trim() || undefined, limit: 24, page: 1 },
        signal: controller.signal,
      })
        .then(res => setDbUsers(res.users ?? []))
        .catch(() => {});
    }, 300);
    return () => { clearTimeout(t); controller.abort(); };
  }, [search]);

  const filtered = useMemo(() => COMMUNITY_MEMBERS.filter(m => {
    const matchBranch  = branch === "All" || m.branch === branch;
    const matchGotra   = gotra === "Gotra: All" || m.gotra === gotra;
    const q = search.toLowerCase();
    const matchSearch  = !q || m.name.toLowerCase().includes(q)
      || m.occupation.toLowerCase().includes(q)
      || m.location.toLowerCase().includes(q);
    return matchBranch && matchGotra && matchSearch;
  }), [search, branch, gotra]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach(m => {
      if (!map[m.branch]) map[m.branch] = [];
      map[m.branch].push(m);
    });
    return map;
  }, [filtered]);

  const mapMembers = filtered.map(m => ({
    id: m.id, name: m.name, area: m.branch, address: m.location,
    photo: m.photo,
    lat: MEMBER_COORDS[m.id]?.lat ?? 12.972,
    lng: MEMBER_COORDS[m.id]?.lng ?? 77.594,
  }));

  return (
    <SidebarLayout title="Community Directory">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-0.5" style={{ color: "#8B5E3C" }}>
            DAIVAJNA SAMAJA · GLOBAL NETWORK
          </p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Community Directory
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or family ID…"
              className="pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none w-52"
              style={{ borderColor: "#DFC5A0" }} />
          </div>
          <select value={gotra} onChange={e => setGotra(e.target.value)}
            className="px-3 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#DFC5A0" }}>
            {GOTRAS.map(g => <option key={g}>{g}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2.5 text-sm border rounded-xl hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#DFC5A0", color: "#374151" }}>
            <Filter size={13} /> Profession
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2.5 text-sm border rounded-xl hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#DFC5A0", color: "#374151" }}>
            <MapPin size={13} /> Native Place
          </button>
        </div>
      </div>

      {/* Branch pills */}
      <div className="flex gap-2 flex-wrap mb-4">
        {BRANCHES.map(b => (
          <button key={b} onClick={() => setBranch(b)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style={branch === b
              ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
              : { borderColor: "#DFC5A0", color: "#374151" }}>
            {b}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        <span className="font-bold" style={{ color: "#1B4332" }}>{filtered.length}</span> families nearby
      </p>

      {/* MAP LEFT (col-3) · MEMBERS RIGHT (col-2) */}
      <div className="grid lg:grid-cols-5 gap-5" style={{ minHeight: "calc(100vh - 320px)" }}>

        {/* MAP */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ border: "1px solid #DFC5A0", minHeight: "560px", height: "calc(100vh - 360px)", position: "sticky", top: "80px" }}>
          <DirectoryMap members={mapMembers} highlighted={selected} onSelect={setSelected} />
        </div>

        {/* MEMBERS — area-grouped */}
        <div className="lg:col-span-2 space-y-5 overflow-y-auto pr-0.5" style={{ maxHeight: "calc(100vh - 360px)" }}>
          {Object.entries(grouped).map(([branchName, members]) => (
            <div key={branchName}>
              <p className="text-xs font-bold tracking-widest mb-3 px-1" style={{ color: "#8B5E3C" }}>
                {AREA_LABELS[branchName] ?? branchName.toUpperCase()}
              </p>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm"
                    style={{
                      background: "white",
                      borderColor: selected === m.id ? "#1B4332" : "#DFC5A0",
                      boxShadow: selected === m.id ? "0 0 0 2px rgba(27,67,50,0.15)" : undefined,
                    }}
                    onClick={() => setSelected(selected === m.id ? null : m.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate" style={{ color: "#0D2B1E" }}>{m.name}</p>
                          {m.verified && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                              style={{ background: "#D1FAE5", color: "#065F46" }}>✓</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{m.occupation}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs flex items-center gap-1 text-gray-400">
                            <MapPin size={9} /> {m.location.split(",")[0]}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: "#F0FBF4", color: "#1B4332" }}>
                            {m.gotra} Gotra
                          </span>
                        </div>
                      </div>
                    </div>
                    {selected === m.id && (
                      <div className="mt-2 pt-2 border-t flex gap-2" style={{ borderColor: "#F3F4F6" }}>
                        <Link href="/invitations"
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                          <Navigation size={11} /> Plan Visit
                        </Link>
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                          style={{ borderColor: "#DFC5A0", color: "#374151" }}>
                          <Users size={11} /> View Profile
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={28} className="mx-auto mb-2" />
              <p className="text-sm font-semibold">No members found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recently Registered (DB users) */}
      {dbUsers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
            <UserPlus size={16} style={{ color:"#8B5E3C" }} />
            Registered Members ({dbUsers.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dbUsers.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}
                className="rounded-2xl border p-4"
                style={{ background:"white", borderColor:"#DFC5A0" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0"
                    style={{ background:"linear-gradient(135deg,#1B4332,#2D6A4F)", color:"white" }}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color:"#0D2B1E" }}>{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.gotra} Gotra</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={9} className="text-gray-400" />
                      <span className="text-xs text-gray-400">{(u.native||"—").split(",")[0]}</span>
                    </div>
                  </div>
                </div>
                <span className="mt-2 text-xs px-2 py-0.5 rounded-full inline-block"
                  style={u.verified
                    ? { background:"#D1FAE5", color:"#065F46" }
                    : { background:"#FEF3C7", color:"#D97706" }}>
                  {u.verified ? "Verified" : "Pending Verification"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
