"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Search, X, CheckCircle } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";

export default function MatrimonialPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const FILTERS = ["All", "Bride", "Groom", "Bengaluru", "Mangaluru", "Kashyap Gotra", "Bharadwaja Gotra"];

  const filtered = useMemo(() => {
    return MATRIMONIAL_CANDIDATES.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.gotra.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Bride" && c.gender === "F") ||
        (activeFilter === "Groom" && c.gender === "M") ||
        c.location.includes(activeFilter) ||
        c.gotra === activeFilter.replace(" Gotra", "");

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery]);

  const handleRegisterSubmit = () => {
    setRegisterSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterSuccess(false);
    }, 2000);
  };

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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)" }}>
          <Shield size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Elder-Mediated Introductions
          </p>
          <p className="text-green-200 text-sm leading-relaxed">
            All introductions in the Daivajna Samaja network are facilitated by the Elder sub-committee — ensuring
            lineage authenticity, gotra compatibility, and family alignment. Every profile is Aadhaar-verified.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          Register Profile →
        </button>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name, gotra, city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border w-full outline-none"
            style={{ borderColor: "#DFC5A0", background: "white" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
              style={
                activeFilter === f
                  ? { background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "white", borderColor: "#1B4332" }
                  : { borderColor: "#DFC5A0", color: "#6B7280", background: "white" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-1">No profiles match your filter</p>
          <button onClick={() => { setActiveFilter("All"); setSearchQuery(""); }} className="text-sm font-semibold" style={{ color: "#1B4332" }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="group rounded-2xl overflow-hidden border cursor-pointer"
              style={{ background: "white", borderColor: "#DFC5A0" }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
              onClick={() => router.push(`/matrimonial/${c.id}`)}
            >
              <div className="relative overflow-hidden" style={{ height: "180px" }}>
                <img
                  src={c.photo}
                  alt={c.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: c.gender === "F" ? "#FDE8F6" : "#E8F0FD", color: c.gender === "F" ? "#9D174D" : "#1E40AF" }}>
                    {c.gender === "F" ? "Bride" : "Groom"}
                  </span>
                </div>
                {c.verified && (
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(209,250,229,0.95)", color: "#065F46", backdropFilter: "blur(4px)" }}>
                    ✓ Verified
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>

              <div className="p-4 pt-2">
                <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                  {c.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{c.age} yrs · {c.location} · {c.gotra}</p>
                <div className="space-y-1.5 mb-4">
                  {[
                    { label: "Education", val: c.education.split(",")[0] },
                    { label: "Works at", val: c.company.split("—")[0].trim() },
                    { label: "Family", val: c.familyType + " · " + c.height },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between text-xs gap-2">
                      <span className="text-gray-400 shrink-0">{label}</span>
                      <span className="font-medium text-right truncate" style={{ color: "#1B4332" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                  onClick={(e) => { e.stopPropagation(); router.push(`/matrimonial/${c.id}`); }}
                >
                  <Heart size={14} /> Express Interest
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        Showing {filtered.length} of {MATRIMONIAL_CANDIDATES.length} verified profiles
      </div>

      {/* Register Profile Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowRegisterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="rounded-2xl p-8 w-full max-w-md"
              style={{ background: "white" }}
              onClick={e => e.stopPropagation()}
            >
              {registerSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#1B4332" }} />
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Request Submitted!</h3>
                  <p className="text-gray-500 text-sm">The Elder committee will review and contact you within 3 working days.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                      Register Matrimonial Profile
                    </h3>
                    <button onClick={() => setShowRegisterModal(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Candidate Name</label>
                      <input className="input-premium" placeholder="Full name as per Samaj records" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Gender</label>
                        <select className="input-premium">
                          <option>Bride</option>
                          <option>Groom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Gotra</label>
                        <input className="input-premium" placeholder="Kashyap / Bharadwaja…" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Elder Reference (Required)</label>
                      <input className="input-premium" placeholder="Name of vouching Elder / Samaj member" />
                    </div>
                    <p className="text-xs text-gray-400">Registration requires Elder committee approval. A nominal fee of ₹500 applies for listing.</p>
                    <button
                      onClick={handleRegisterSubmit}
                      className="w-full py-3 rounded-xl font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                    >
                      Submit for Elder Review
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
