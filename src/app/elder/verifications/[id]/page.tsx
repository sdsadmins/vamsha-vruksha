"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, FileText, User, AlertTriangle, Shield } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { VERIFICATION_REQUESTS } from "@/lib/data";

const RISK_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low:    { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7", label: "Low Risk"  },
  medium: { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D", label: "Medium Risk" },
  high:   { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5", label: "High Risk"  },
};

const AADHAAR_STYLES: Record<string, { bg: string; text: string }> = {
  Verified: { bg: "#D1FAE5", text: "#065F46" },
  Pending:  { bg: "#FEF3C7", text: "#D97706" },
  Mismatch: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function VerificationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [action, setAction] = useState<"approved" | "rejected" | "info" | null>(null);

  const req = VERIFICATION_REQUESTS.find(r => r.id === id);

  if (!req) return (
    <SidebarLayout title="Verification Detail" requiredRole="elder">
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400">Verification request not found</p>
        <Link href="/elder/verifications" className="text-sm font-semibold" style={{ color: "#1B4332" }}>
          ← Back to Queue
        </Link>
      </div>
    </SidebarLayout>
  );

  const risk = RISK_STYLES[req.riskLevel];
  const aadhaarStyle = AADHAAR_STYLES[req.aadhaarStatus];
  const vouchPct = Math.round((req.vouches / req.vouchesRequired) * 100);

  return (
    <SidebarLayout title="Verification Detail" requiredRole="elder">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/elder/verifications"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "#1B4332" }}>
          <ArrowLeft size={15} /> Back to Verification Queue
        </Link>
        <span className="text-xs text-gray-400">Submitted {req.submittedOn}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Profile card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="rounded-3xl border overflow-hidden sticky top-4" style={{ background: "white", borderColor: "#E8D5BC" }}>
            {/* Photo */}
            <div className="relative" style={{ height: "260px" }}>
              <img src={req.photo} alt={req.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(13,43,30,0.92))" }} />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: risk.bg, color: risk.text }}>
                  {risk.label}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: aadhaarStyle.bg, color: aadhaarStyle.text }}>
                  Aadhaar: {req.aadhaarStatus}
                </span>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{req.name}</h1>
                <p className="text-green-300 text-sm">{req.age} yrs · {req.gender === "M" ? "Male" : "Female"} · {req.gotra} Gotra</p>
              </div>
            </div>

            {/* Quick facts */}
            <div className="p-5 space-y-3">
              {[
                { icon: User,     label: "Occupation",  value: req.occupation },
                { icon: Shield,   label: "Claiming From", value: req.claimingFrom },
                { icon: FileText, label: "Location",    value: req.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F0FBF4" }}>
                    <Icon size={13} style={{ color: "#1B4332" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{value}</p>
                  </div>
                </div>
              ))}

              {/* Vouch progress */}
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">Vouch Progress</span>
                  <span className="font-bold" style={{ color: "#1B4332" }}>{req.vouches} / {req.vouchesRequired}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${vouchPct}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    style={{ background: vouchPct === 100 ? "#1B4332" : "linear-gradient(90deg, #1B4332, #52B788)" }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => setAction("approved")}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.25)" }}
                >
                  <CheckCircle size={16} /> Approve Verification
                </button>
                <button
                  onClick={() => setAction("info")}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50 flex items-center justify-center gap-2"
                  style={{ borderColor: "#D4AF7A", color: "#A67C52" }}
                >
                  <MessageSquare size={15} /> Request More Info
                </button>
                <button
                  onClick={() => setAction("rejected")}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                  style={{ borderColor: "#FCA5A5", color: "#DC2626" }}
                >
                  <XCircle size={15} /> Reject Request
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Detail sections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* Lineage claim */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              <Shield size={18} style={{ color: "#1B4332" }} /> Lineage Claim
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Claiming Ancestor",  value: req.claimingAncestor },
                { label: "Stated Relation",    value: req.relation },
                { label: "Branch",             value: req.claimingFrom },
                { label: "Phone (partial)",    value: req.phone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
              <FileText size={16} style={{ color: "#1B4332" }} /> Submitted Documents
            </h2>
            <div className="space-y-2">
              {req.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F9F5F0" }}>
                  <CheckCircle size={14} style={{ color: "#1B4332" }} />
                  <span className="text-sm font-medium">{doc}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>Received</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elder Vouches */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
              <CheckCircle size={16} style={{ color: "#1B4332" }} /> Elder Vouches ({req.vouches}/{req.vouchesRequired} confirmed)
            </h2>
            <div className="space-y-3">
              {req.vouchDetails.map((v, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border"
                  style={{ borderColor: v.status === "Approved" ? "#B7E4C7" : "#E5E7EB", background: v.status === "Approved" ? "#F0FBF4" : "white" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: v.status === "Approved" ? "#D1FAE5" : "#F3F4F6" }}>
                    {v.status === "Approved"
                      ? <CheckCircle size={18} style={{ color: "#1B4332" }} />
                      : <div className="w-4 h-4 rounded-full border-2 border-dashed" style={{ borderColor: "#D1D5DB" }} />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{v.name}</p>
                    <p className="text-xs text-gray-400">{v.role}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={v.status === "Approved"
                      ? { background: "#D1FAE5", color: "#065F46" }
                      : { background: "#F3F4F6", color: "#6B7280" }
                    }>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lineage Notes */}
          <div className="rounded-2xl border p-5"
            style={{
              background: req.riskLevel === "high" ? "#FFF5F5" : "white",
              borderColor: req.riskLevel === "high" ? "#FCA5A5" : "#E8D5BC"
            }}>
            <h2 className="font-bold mb-3 flex items-center gap-2"
              style={{ color: req.riskLevel === "high" ? "#DC2626" : "#0D2B1E" }}>
              {req.riskLevel === "high" ? <AlertTriangle size={16} style={{ color: "#DC2626" }} /> : <MessageSquare size={16} style={{ color: "#1B4332" }} />}
              Elder Committee Notes
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{req.lineageNotes}</p>
          </div>

          {/* Aadhaar status */}
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: aadhaarStyle.bg, border: `1px solid ${risk.border}` }}>
            <Shield size={22} style={{ color: aadhaarStyle.text }} />
            <div>
              <p className="text-sm font-bold" style={{ color: aadhaarStyle.text }}>Aadhaar Verification: {req.aadhaarStatus}</p>
              {req.aadhaarStatus === "Verified" && <p className="text-xs" style={{ color: aadhaarStyle.text }}>Identity confirmed via Aadhaar API — no discrepancy found.</p>}
              {req.aadhaarStatus === "Pending" && <p className="text-xs" style={{ color: aadhaarStyle.text }}>Applicant has not yet uploaded Aadhaar. Awaiting submission.</p>}
              {req.aadhaarStatus === "Mismatch" && <p className="text-xs" style={{ color: aadhaarStyle.text }}>Address on Aadhaar does not match declared location. Manual review required.</p>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action modals */}
      <AnimatePresence>
        {action && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl p-8 text-center max-w-sm w-full"
              style={{ background: "white" }}
              onClick={e => e.stopPropagation()}
            >
              {action === "approved" && <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#D1FAE5" }}>
                  <CheckCircle size={32} style={{ color: "#1B4332" }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Verification Approved</h3>
                <p className="text-gray-500 text-sm mb-6">{req.name} will be officially added to the Samaj registry. A notification will be sent to the applicant.</p>
              </>}
              {action === "rejected" && <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#FEE2E2" }}>
                  <XCircle size={32} style={{ color: "#DC2626" }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Request Rejected</h3>
                <p className="text-gray-500 text-sm mb-6">The verification request for {req.name} has been rejected. The applicant will be notified with a reason.</p>
              </>}
              {action === "info" && <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#FEF3C7" }}>
                  <MessageSquare size={32} style={{ color: "#D97706" }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Information Requested</h3>
                <p className="text-gray-500 text-sm mb-6">A query has been sent to {req.name} requesting additional documents or clarification. Case paused pending response.</p>
              </>}
              <div className="flex gap-3">
                <button onClick={() => { setAction(null); router.push("/elder/verifications"); }}
                  className="flex-1 py-3 text-white rounded-xl font-semibold"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  Back to Queue
                </button>
                <button onClick={() => setAction(null)}
                  className="px-4 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: "#E8D5BC", color: "#1B4332" }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
