"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, AlertTriangle, Clock, Filter } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { VERIFICATION_REQUESTS } from "@/lib/data";

const RISK_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: "#D1FAE5", text: "#065F46", label: "Low Risk"   },
  medium: { bg: "#FEF3C7", text: "#D97706", label: "Med Risk"   },
  high:   { bg: "#FEE2E2", text: "#DC2626", label: "High Risk"  },
};

export default function VerificationsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const filtered = useMemo(() => {
    return VERIFICATION_REQUESTS.filter(r => {
      const matchRisk = riskFilter === "All" || r.riskLevel === riskFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.claimingFrom.toLowerCase().includes(q) || r.gotra.toLowerCase().includes(q);
      return matchRisk && matchSearch;
    });
  }, [search, riskFilter]);

  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    VERIFICATION_REQUESTS.forEach(r => { counts[r.riskLevel as keyof typeof counts]++; });
    return counts;
  }, []);

  return (
    <SidebarLayout title="Verification Queue" requiredRole="elder">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div>
            <p className="text-green-400 text-xs font-semibold tracking-widest mb-1">ELDER SUB-COMMITTEE</p>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pending Verification Queue
            </h2>
            <p className="text-green-300 text-sm mt-1">24 requests pending · {filtered.length} shown here</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Pending", val: "24",                icon: Clock,         color: "rgba(255,255,255,0.08)" },
              { label: "Low Risk", val: String(riskCounts.low),   icon: CheckCircle, color: "rgba(209,250,229,0.12)" },
              { label: "Med Risk", val: String(riskCounts.medium), icon: AlertTriangle, color: "rgba(254,243,199,0.12)" },
              { label: "High Risk", val: String(riskCounts.high),  icon: AlertTriangle, color: "rgba(254,226,226,0.12)" },
            ].map(({ label, val, icon: Icon, color }) => (
              <div key={label} className="rounded-xl px-4 py-2 text-center" style={{ background: color }}>
                <p className="text-white font-bold text-lg">{val}</p>
                <p className="text-green-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, branch, gotra…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#DFC5A0" }}
          />
        </div>
        <div className="flex gap-2">
          {["All", "low", "medium", "high"].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize"
              style={riskFilter === r
                ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
                : { borderColor: "#DFC5A0", color: "#374151" }
              }>
              {r === "All" ? "All" : RISK_COLORS[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue list */}
      <div className="space-y-3">
        {filtered.map((req, i) => {
          const risk = RISK_COLORS[req.riskLevel];
          const vouchPct = Math.round((req.vouches / req.vouchesRequired) * 100);
          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/elder/verifications/${req.id}`}
                className="flex gap-5 items-start p-5 rounded-2xl border hover:shadow-md transition-all group"
                style={{ background: "white", borderColor: "#DFC5A0" }}>

                {/* Photo */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={req.photo} alt={req.name} className="w-full h-full object-cover" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "#0D2B1E" }}>{req.name}</h3>
                      <p className="text-sm text-gray-500">{req.age} yrs · {req.gender === "M" ? "Male" : "Female"} · {req.gotra} Gotra</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: risk.bg, color: risk.text }}>
                        {risk.label}
                      </span>
                      <span className="text-xs text-gray-400">{req.submittedOn}</span>
                    </div>
                  </div>

                  <p className="text-xs mb-2" style={{ color: "#1B4332" }}>
                    {req.claimingFrom} · Claiming: {req.claimingAncestor}
                  </p>

                  {/* Vouch progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-500">Vouches</span>
                        <span className="font-semibold" style={{ color: "#1B4332" }}>{req.vouches}/{req.vouchesRequired}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${vouchPct}%`, background: vouchPct === 100 ? "#1B4332" : "#52B788" }} />
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      {req.hasDocument && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>📄 Docs</span>
                      )}
                      {req.hasPhoto && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EDE9FE", color: "#5B21B6" }}>📷 Photo</span>
                      )}
                      {req.aadhaarStatus === "Verified" && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>✓ Aadhaar</span>
                      )}
                      {req.aadhaarStatus === "Mismatch" && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#DC2626" }}>⚠ Aadhaar</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-gray-300 group-hover:text-gray-500 transition-colors text-2xl shrink-0">›</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Filter size={32} className="mx-auto mb-3" />
          <p className="font-semibold">No requests match your filter</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400 text-center">
        Showing {filtered.length} of 24 pending verifications ·{" "}
        <Link href="/elder" className="font-semibold hover:underline" style={{ color: "#1B4332" }}>← Back to Overview</Link>
      </div>
    </SidebarLayout>
  );
}
