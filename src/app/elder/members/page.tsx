"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, AlertCircle, Users } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { COMMUNITY_MEMBERS } from "@/lib/data";

const BRANCHES = ["All", "Kundapura", "Kumta", "Mangaluru", "Bengaluru", "Udupi", "Out-of-State"];

export default function MembersPage() {
  const router = useRouter();
  void router;
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  const filtered = useMemo(() => {
    return COMMUNITY_MEMBERS.filter(m => {
      const matchBranch = branch === "All" || m.branch === branch;
      const matchGender = genderFilter === "All" || m.gender === genderFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.occupation.toLowerCase().includes(q) || m.gotra.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
      return matchBranch && matchGender && matchSearch;
    });
  }, [search, branch, genderFilter]);

  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { All: COMMUNITY_MEMBERS.length };
    COMMUNITY_MEMBERS.forEach(m => { counts[m.branch] = (counts[m.branch] ?? 0) + 1; });
    return counts;
  }, []);

  return (
    <SidebarLayout title="Member Directory" requiredRole="elder">
      {/* Stats banner */}
      <div className="rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-center"
        style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
        <div>
          <p className="text-green-400 text-xs font-semibold tracking-widest mb-1">DAIVAJNA SAMAJA BANGALORE</p>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Community Member Registry
          </h2>
          <p className="text-green-300 text-sm mt-1">Showing {filtered.length} of 1,428 registered members</p>
        </div>
        <div className="ml-auto flex gap-3 flex-wrap">
          {[
            { label: "Total Members",  val: "1,428" },
            { label: "Verified",       val: "1,392" },
            { label: "Active Branches",val: "6" },
            { label: "NRI Members",    val: "84" },
          ].map(({ label, val }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-lg font-bold text-white">{val}</p>
              <p className="text-green-300 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, gotra, occupation…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#DFC5A0" }}
          />
        </div>
        <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border rounded-xl outline-none" style={{ borderColor: "#DFC5A0" }}>
          <option value="All">All Genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      {/* Branch tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {BRANCHES.map(b => (
          <button key={b} onClick={() => setBranch(b)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style={branch === b
              ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
              : { borderColor: "#DFC5A0", color: "#374151" }
            }>
            {b} {branchCounts[b] != null ? `(${branchCounts[b]})` : ""}
          </button>
        ))}
      </div>

      {/* Member grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
            style={{ background: "white", borderColor: "#DFC5A0" }}
          >
            {/* Photo */}
            <div className="relative h-36">
              <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(13,43,30,0.85))" }} />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white font-bold text-sm leading-tight">{m.name}</p>
                <p className="text-green-300 text-xs">{m.age} yrs · {m.gotra} Gotra</p>
              </div>
              <div className="absolute top-2 right-2">
                {m.verified
                  ? <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1"
                      style={{ background: "rgba(209,250,229,0.92)", color: "#065F46" }}>
                      <CheckCircle size={10} /> Verified
                    </span>
                  : <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(254,243,199,0.92)", color: "#D97706" }}>
                      Pending
                    </span>
                }
              </div>
            </div>

            {/* Details */}
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-0.5 truncate">{m.occupation}</p>
              <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "#1B4332" }}>
                <Users size={10} /> {m.branch} Branch · Since {m.joinedYear}
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F0FBF4", color: "#1B4332", border: "1px solid #B7E4C7" }}>
                  {m.gender === "M" ? "Male" : "Female"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F7F0E8", color: "#8B5E3C", border: "1px solid #DFC5A0" }}>
                  {m.location.split(",")[0]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <AlertCircle size={32} className="mx-auto mb-3" />
          <p className="font-semibold">No members match your filter</p>
        </div>
      )}

      {/* Pagination note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">Showing {filtered.length} sample records · <Link href="/elder" className="font-semibold hover:underline" style={{ color: "#1B4332" }}>← Back to Overview</Link></p>
      </div>
    </SidebarLayout>
  );
}
