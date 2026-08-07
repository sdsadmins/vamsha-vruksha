"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, AlertTriangle, Clock, Shield, TrendingUp, ChevronRight, UserCheck, UserX, Image as ImageIcon, FileText } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { apiGet, apiPatch, errorMessage } from "@/lib/api";
import { VERIFICATION_REQUESTS } from "@/lib/data";

interface PendingUser {
  id: string; name: string; phone: string; gotra: string;
  native: string; role: string; createdAt: string;
}

const RISK_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: "#D1FAE5", text: "#065F46", label: "Low Risk"  },
  medium: { bg: "#FEF3C7", text: "#D97706", label: "Med Risk"  },
  high:   { bg: "#FEE2E2", text: "#DC2626", label: "High Risk" },
};

const VELOCITY_MONTHS = ["W1", "W2", "W3", "W4"];
const VELOCITY_DATA   = [6, 9, 11, 14];

export default function VerificationsPage() {
  const [search, setSearch]         = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dbPending, setDbPending]   = useState<PendingUser[]>([]);
  const [approving, setApproving]   = useState<string | null>(null);
  const [acted, setActed]           = useState<Record<string, "approved"|"rejected">>({});

  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    apiGet<PendingUser[]>("/api/admin/verifications")
      .then(setDbPending)
      .catch(err => setLoadError(errorMessage(err, "Could not load the queue.")));
  }, []);

  const handleAction = async (id: string, action: "approve"|"reject") => {
    setApproving(id);
    setLoadError("");
    try {
      await apiPatch(`/api/admin/verifications/${id}`, { action });
      setActed(prev => ({ ...prev, [id]: action === "approve" ? "approved" : "rejected" }));
      setDbPending(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      // The old page swallowed this and removed the row anyway, so a failed
      // approval looked like a successful one.
      setLoadError(errorMessage(err, "Could not record that decision."));
    } finally {
      setApproving(null);
    }
  };

  // Static fallback filtered
  const filtered = useMemo(() => {
    return VERIFICATION_REQUESTS.filter(r => {
      const matchRisk = riskFilter === "All" || r.riskLevel === riskFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.claimingFrom.toLowerCase().includes(q) || r.gotra.toLowerCase().includes(q);
      return matchRisk && matchSearch;
    });
  }, [search, riskFilter]);

  return (
    <SidebarLayout title="Elder Verification Queue" requiredRole="elder">
      {loadError && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-sm"
          style={{ background: "#FEE2E2", borderColor: "#FCA5A5", color: "#991B1B" }}>
          {loadError}
        </div>
      )}

      {/* Velocity + Trust Level header */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {/* Verification Velocity */}
        <div className="sm:col-span-2 rounded-2xl border p-5"
          style={{ background: "white", borderColor: "#DFC5A0" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">VERIFICATION VELOCITY</p>
              <p className="text-sm text-gray-600">Elder claims processed this week</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full"
              style={{ background: "#D1FAE5", color: "#065F46" }}>
              <TrendingUp size={14} /> +14%
            </span>
          </div>
          <div className="flex items-end gap-3" style={{ height: "64px" }}>
            {VELOCITY_MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <motion.div className="w-full rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(VELOCITY_DATA[i] / 14) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                  style={{ background: i === VELOCITY_MONTHS.length - 1 ? "#1B4332" : "#B7E4C7" }} />
                <span className="text-xs text-gray-400">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Level */}
        <div className="rounded-2xl border p-5 flex flex-col items-center justify-center text-center"
          style={{ background: "linear-gradient(135deg, #1B4332, #0D2B1E)", borderColor: "#1B4332" }}>
          <Shield size={24} className="text-green-400 mb-2" />
          <p className="text-xs font-semibold text-green-400 mb-1">TRUST LEVEL</p>
          <p className="text-sm text-green-300 mb-2">Community Vouching Rate</p>
          <p className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>92.4%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search pending elders…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#DFC5A0" }} />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border rounded-xl outline-none"
          style={{ borderColor: "#DFC5A0" }}>
          {["All Status", "Pending", "Verified", "Rejected"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border rounded-xl outline-none"
          style={{ borderColor: "#DFC5A0" }}>
          <option value="All">Oldest First</option>
          <option value="high">High Risk First</option>
          <option value="low">Low Risk First</option>
        </select>
      </div>

      {/* ── DB Real Pending Users ── */}
      {dbPending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            New Registrations Awaiting Approval ({dbPending.length})
          </h2>
          <div className="space-y-3">
            {dbPending.filter(u => {
              const q = search.toLowerCase();
              return !q || u.name.toLowerCase().includes(q) || u.gotra.toLowerCase().includes(q) || u.native.toLowerCase().includes(q);
            }).map((u, i) => (
              <motion.div key={u.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}
                className="rounded-2xl border p-4 flex items-center gap-4"
                style={{ background:"white", borderColor:"#1B4332" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0"
                  style={{ background:"linear-gradient(135deg,#1B4332,#2D6A4F)", color:"white" }}>
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold" style={{ color:"#0D2B1E" }}>{u.name}</p>
                  <p className="text-sm text-gray-500">{u.phone} · {u.gotra} Gotra · {u.native}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background:"#FEF3C7", color:"#D97706" }}>
                    {u.role === "elder" ? "Elder Application" : "Member Registration"}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAction(u.id, "approve")} disabled={!!approving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl font-bold text-white disabled:opacity-50"
                    style={{ background:"linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                    {approving === u.id ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <UserCheck size={13} />}
                    Approve
                  </button>
                  <button onClick={() => handleAction(u.id, "reject")} disabled={!!approving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl font-bold border disabled:opacity-50"
                    style={{ borderColor:"#FCA5A5", color:"#DC2626" }}>
                    <UserX size={13} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sample claims. The real queue is the section above, backed by
          /api/admin/verifications. These rows are illustrative only — the
          lineage-claim review they demonstrate has no backend yet, and their
          buttons change nothing. Labelled so no elder mistakes them for work
          waiting on them. */}
      <div className="mb-4 rounded-xl border px-4 py-3 text-sm"
        style={{ background: "#F3F4F6", borderColor: "#E5E7EB", color: "#4B5563" }}>
        <strong>Sample data.</strong> Lineage-claim review is not built yet —
        the rows below are a design preview and approving them does nothing.
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
          Pending Claims ({VERIFICATION_REQUESTS.length})
        </h2>
        <div className="flex gap-2">
          {["All", "low", "medium", "high"].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
              style={riskFilter === r
                ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
                : { borderColor: "#DFC5A0", color: "#374151" }
              }>
              {r === "All" ? "All Status" : RISK_COLORS[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims list */}
      <div className="space-y-4">
        {filtered.map((req, i) => {
          const risk = RISK_COLORS[req.riskLevel];
          const isFirst = i === 0;
          return (
            <motion.div key={req.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "white", borderColor: isFirst ? "#1B4332" : "#DFC5A0" }}>

              {isFirst && (
                <div className="px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  style={{ background: "#FEE2E2", color: "#DC2626" }}>
                  <AlertTriangle size={11} /> Latest
                </div>
              )}

              <div className="p-5">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2"
                    style={{ borderColor: "#DFC5A0" }}>
                    <img src={req.photo} alt={req.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-bold text-base" style={{ color: "#0D2B1E" }}>{req.name}</p>
                        <p className="text-sm text-gray-500">Age: {req.age ?? "–"}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-semibold shrink-0"
                        style={{ background: risk.bg, color: risk.text }}>
                        {risk.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div>
                        <p className="text-gray-400">Lineage Node</p>
                        <p className="font-semibold text-gray-700">{req.claimingFrom}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ID Status</p>
                        <p className="font-semibold"
                          style={{ color: req.aadhaarStatus === "Verified" ? "#065F46" : "#D97706" }}>
                          {req.aadhaarStatus === "Verified" ? "✓ Verified" : "⚠ " + req.aadhaarStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Vouching</p>
                        <p className="font-semibold text-gray-700">{req.vouches} Peer Vouches</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents row */}
                {req.documents && req.documents.length > 0 && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <p className="text-xs text-gray-400 mb-2 font-semibold">SUPPORTING DOCUMENTS</p>
                    <div className="flex gap-2 flex-wrap">
                      {req.documents.map((doc: string) => (
                        <div key={doc} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
                          style={{ borderColor: "#DFC5A0", background: "#F7F0E8" }}>
                          {doc.match(/\.(jpg|jpeg|png)/i) ? (
                            <ImageIcon size={12} style={{ color: "#8B5E3C" }} />
                          ) : (
                            <FileText size={12} style={{ color: "#8B5E3C" }} />
                          )}
                          <span className="text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button className="px-4 py-2 text-xs rounded-xl font-semibold border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#DFC5A0", color: "#374151" }}>
                    Contact Applicant
                  </button>
                  <button className="px-4 py-2 text-xs rounded-xl font-semibold border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#DFC5A0", color: "#374151" }}>
                    Request More Info
                  </button>
                  <Link href={`/elder/verifications/${req.id}`}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    Approve Membership <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, "…", 12].map((p, i) => (
          <button key={i}
            className="w-8 h-8 rounded-lg text-sm font-semibold border transition-all"
            style={p === 1
              ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
              : { borderColor: "#DFC5A0", color: "#374151" }
            }>
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Clock size={32} className="mx-auto mb-3" />
          <p className="font-semibold">No requests match your filter</p>
        </div>
      )}
    </SidebarLayout>
  );
}
