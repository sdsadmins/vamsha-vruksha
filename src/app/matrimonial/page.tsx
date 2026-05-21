"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Search, X, CheckCircle } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";

interface DbProfile {
  _id: string; name: string; gender: string; age?: number; gotra: string;
  location: string; education: string; company: string; phone: string;
  verified: boolean; photo: string; familyType: string; height: string;
  status: string;
}

const GOTRAS = ["Kashyap","Bharadwaja","Vasishtha","Atreya","Kaundinya","Vishwamitra","Gautama"];

export default function MatrimonialPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dbProfiles, setDbProfiles] = useState<DbProfile[]>([]);

  // Register form state
  const [regForm, setRegForm] = useState({
    name: "", gender: "Bride", gotra: "Kashyap", phone: "", elderRef: "",
    age: "", education: "", company: "", location: "Bengaluru",
  });

  useEffect(() => {
    fetch("/api/matrimonial")
      .then(r => r.ok ? r.json() : [])
      .then(setDbProfiles)
      .catch(() => {});
  }, []);

  const FILTERS = ["All","Bride","Groom","Bengaluru","Mangaluru","Kashyap Gotra","Bharadwaja Gotra"];

  // Combine DB profiles with static ones (DB first)
  const allCandidates = useMemo(() => {
    const dbMapped = dbProfiles.map(p => ({
      id: p._id,
      name: p.name,
      gender: p.gender === "Bride" ? "F" : "M",
      age: p.age ?? 0,
      gotra: p.gotra,
      location: p.location,
      education: p.education || "Details pending",
      company: p.company || "Details pending",
      photo: p.photo || "",
      verified: p.verified,
      familyType: p.familyType || "Nuclear",
      height: p.height || "—",
      fromDb: true,
    }));
    return [...dbMapped, ...MATRIMONIAL_CANDIDATES];
  }, [dbProfiles]);

  const filtered = useMemo(() => {
    return allCandidates.filter((c) => {
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
  }, [allCandidates, activeFilter, searchQuery]);

  const handleRegisterSubmit = async () => {
    if (!regForm.name || !regForm.phone) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/matrimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.name,
          gender: regForm.gender,
          age: regForm.age ? parseInt(regForm.age) : null,
          gotra: regForm.gotra,
          location: regForm.location,
          education: regForm.education,
          company: regForm.company,
          phone: regForm.phone,
        }),
      });
      if (res.ok) {
        setRegisterSuccess(true);
        // Refresh DB profiles
        fetch("/api/matrimonial").then(r => r.ok ? r.json() : []).then(setDbProfiles).catch(() => {});
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegisterSuccess(false);
          setRegForm({ name:"", gender:"Bride", gotra:"Kashyap", phone:"", elderRef:"", age:"", education:"", company:"", location:"Bengaluru" });
        }, 2200);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <SidebarLayout title="Matrimonial Hub">
      {/* Elder Mediated Banner */}
      <motion.div
        initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
        className="rounded-2xl p-5 mb-6 flex items-start gap-4"
        style={{ background:"linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background:"linear-gradient(135deg, #8B5E3C, #C4823A)" }}>
          <Shield size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold mb-1" style={{ fontFamily:"'Playfair Display', serif" }}>
            Elder-Mediated Introductions
          </p>
          <p className="text-green-200 text-sm leading-relaxed">
            All introductions in the Daivajna Samaja network are facilitated by the Elder sub-committee — ensuring
            lineage authenticity, gotra compatibility, and family alignment. Every profile is Aadhaar-verified.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors whitespace-nowrap">
          Register Profile →
        </button>
      </motion.div>

      {/* Stats row */}
      {dbProfiles.length > 0 && (
        <div className="flex gap-3 mb-6">
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>{dbProfiles.length}</p>
            <p className="text-xs text-gray-400">New Registrations</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>{MATRIMONIAL_CANDIDATES.length}</p>
            <p className="text-xs text-gray-400">Verified Profiles</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>{allCandidates.length}</p>
            <p className="text-xs text-gray-400">Total Listed</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name, gotra, city..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border w-full outline-none"
            style={{ borderColor:"#DFC5A0", background:"white" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
              style={activeFilter===f
                ? { background:"linear-gradient(135deg, #1B4332, #2D6A4F)", color:"white", borderColor:"#1B4332" }
                : { borderColor:"#DFC5A0", color:"#6B7280", background:"white" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-1">No profiles match your filter</p>
          <button onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
            className="text-sm font-semibold" style={{ color:"#1B4332" }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {filtered.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }}
              transition={{ delay:i*0.08, duration:0.45 }}
              className="group rounded-2xl overflow-hidden border cursor-pointer"
              style={{ background:"white", borderColor:"#DFC5A0" }}
              whileHover={{ y:-6, boxShadow:"0 16px 40px rgba(0,0,0,0.10)" }}
              onClick={() => router.push(`/matrimonial/${c.id}`)}>
              <div className="relative overflow-hidden" style={{ height:"180px" }}>
                {c.photo ? (
                  <img src={c.photo} alt={c.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ background:`linear-gradient(135deg, ${c.gender==="F"?"#6B2D5E, #9D3E7D":"#1B4332, #2D6A4F"})` }}>
                    {c.gender==="F"?"👩":"👨"}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background:c.gender==="F"?"#FDE8F6":"#E8F0FD", color:c.gender==="F"?"#9D174D":"#1E40AF" }}>
                    {c.gender==="F"?"Bride":"Groom"}
                  </span>
                </div>
                {c.verified && (
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ background:"rgba(209,250,229,0.95)", color:"#065F46", backdropFilter:"blur(4px)" }}>
                    ✓ Verified
                  </span>
                )}
                {"fromDb" in c && c.fromDb && (
                  <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background:"rgba(196,130,58,0.9)", color:"white" }}>
                    New
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-4 pt-2">
                <h3 className="font-bold text-base mb-0.5" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                  {c.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{c.age ? `${c.age} yrs · ` : ""}{c.location} · {c.gotra}</p>
                <div className="space-y-1.5 mb-4">
                  {[
                    { label:"Education", val:c.education.split(",")[0] },
                    { label:"Works at",  val:c.company.split("—")[0].trim() },
                    { label:"Family",    val:`${c.familyType} · ${c.height}` },
                  ].map(({label,val}) => (
                    <div key={label} className="flex justify-between text-xs gap-2">
                      <span className="text-gray-400 shrink-0">{label}</span>
                      <span className="font-medium text-right truncate" style={{ color:"#1B4332" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all"
                  style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                  onClick={e => { e.stopPropagation(); router.push(`/matrimonial/${c.id}`); }}>
                  <Heart size={14} /> Express Interest
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        Showing {filtered.length} of {allCandidates.length} profiles
      </div>

      {/* Register Profile Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.5)" }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowRegisterModal(false)}>
            <motion.div
              initial={{ scale:0.92,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.92,opacity:0 }}
              className="rounded-2xl p-8 w-full max-w-md overflow-y-auto"
              style={{ background:"white", maxHeight:"90vh" }}
              onClick={e => e.stopPropagation()}>
              {registerSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color:"#1B4332" }} />
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Request Submitted!</h3>
                  <p className="text-gray-500 text-sm">Your profile has been saved. The Elder committee will review and contact you within 3 working days.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                      Register Matrimonial Profile
                    </h3>
                    <button onClick={() => setShowRegisterModal(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Candidate Name *</label>
                      <input value={regForm.name} onChange={e => setRegForm(p=>({...p,name:e.target.value}))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="Full name as per Samaj records" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Looking For</label>
                        <select value={regForm.gender} onChange={e => setRegForm(p=>({...p,gender:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}>
                          <option>Bride</option>
                          <option>Groom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Age</label>
                        <input type="number" value={regForm.age} onChange={e => setRegForm(p=>({...p,age:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                          placeholder="e.g. 27" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Gotra</label>
                        <select value={regForm.gotra} onChange={e => setRegForm(p=>({...p,gotra:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}>
                          {GOTRAS.map(g=><option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Phone *</label>
                        <input type="tel" value={regForm.phone} onChange={e => setRegForm(p=>({...p,phone:e.target.value.replace(/\D/g,"")}))}
                          maxLength={10}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                          placeholder="9876543210" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Education</label>
                      <input value={regForm.education} onChange={e => setRegForm(p=>({...p,education:e.target.value}))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="e.g. MBA Finance, IIM Ahmedabad" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Company / Occupation</label>
                      <input value={regForm.company} onChange={e => setRegForm(p=>({...p,company:e.target.value}))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="e.g. Goldman Sachs" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Elder Reference (Required)</label>
                      <input value={regForm.elderRef} onChange={e => setRegForm(p=>({...p,elderRef:e.target.value}))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="Name of vouching Elder / Samaj member" />
                    </div>
                    <p className="text-xs text-gray-400">Registration requires Elder committee approval. A nominal fee of ₹500 applies for listing.</p>
                    <button
                      onClick={handleRegisterSubmit}
                      disabled={submitting || !regForm.name || !regForm.phone}
                      className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                      {submitting
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                        : "Submit for Elder Review"}
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
