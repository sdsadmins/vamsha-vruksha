"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Search, X, CheckCircle } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { ApiError, apiGet, apiPost, apiPut, errorMessage } from "@/lib/api";

/** A candidate card from GET /api/matrimonial. Identity is read live from the
 * member's account, so `name`/`gotra`/`photo` are never stale copies. */
interface DbProfile {
  id: string;
  userId: string;
  name: string;
  gender: string;
  age: number;
  gotra: string;
  location: string;
  occupation: string;
  education: string;
  company: string;
  photo: string;
  verified: boolean;
  familyType: string;
  height: string;
  match?: { score: number } | null;
}

interface BrowseResponse { count: number; profiles: DbProfile[] }

/** GET /api/matrimonial/eligibility — why a member can or cannot list. */
interface Eligibility {
  eligible: boolean;
  profileComplete: boolean;
  status: string;
  reasons: string[];
  missing: { key: string; label: string }[];
}

export default function MatrimonialPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dbProfiles, setDbProfiles] = useState<DbProfile[]>([]);

  const [loadError, setLoadError]     = useState("");
  const [submitError, setSubmitError] = useState("");
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [blocked, setBlocked]         = useState(false);

  // Only the fields the account does not already hold.
  const [regForm, setRegForm] = useState({
    education: "", company: "", designation: "", income: "",
    heightCm: "", familyType: "Nuclear", about: "",
  });

  useEffect(() => {
    apiGet<BrowseResponse>("/api/matrimonial")
      .then(res => { setDbProfiles(res.profiles ?? []); setBlocked(false); })
      .catch(err => {
        // The hub is reciprocal: you can browse once your own profile is
        // complete. A 403 is that rule, not a failure — say so rather than
        // showing a red error box.
        if (err instanceof ApiError && err.status === 403) setBlocked(true);
        else setLoadError(errorMessage(err, "Could not load profiles."));
      });
    apiGet<Eligibility>("/api/matrimonial/eligibility")
      .then(setEligibility)
      .catch(() => {});
  }, []);

  const FILTERS = ["All","Bride","Groom","Bengaluru","Mangaluru","Kashyap Gotra","Bharadwaja Gotra"];

  // Approved profiles only — the server decides who is visible, and sample
  // candidates are no longer mixed in with real members.
  const allCandidates = useMemo(() => dbProfiles.map(p => ({
    id: p.id,
    name: p.name,
    gender: p.gender,
    age: p.age ?? 0,
    gotra: p.gotra,
    location: p.location || "—",
    education: p.education || "Details pending",
    company: p.company || p.occupation || "Details pending",
    photo: p.photo || "",
    verified: p.verified,
    familyType: p.familyType || "—",
    height: p.height || "—",
    fromDb: true,
  })), [dbProfiles]);

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

  /**
   * List my own profile. A member can only ever create their own — name, age,
   * gotra and location come from their account, so the form asks for the parts
   * the account does not already know. Saving and submitting for review are two
   * calls: the draft is editable until it is submitted.
   */
  const handleRegisterSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await apiPut("/api/matrimonial/me", {
        education: regForm.education || undefined,
        company: regForm.company || undefined,
        designation: regForm.designation || undefined,
        income: regForm.income || undefined,
        heightCm: regForm.heightCm ? Number(regForm.heightCm) : undefined,
        familyType: regForm.familyType || undefined,
        about: regForm.about || undefined,
      });
      await apiPost("/api/matrimonial/me/submit");

      setRegisterSuccess(true);
      apiGet<BrowseResponse>("/api/matrimonial")
        .then(res => setDbProfiles(res.profiles ?? []))
        .catch(() => {});
      apiGet<Eligibility>("/api/matrimonial/eligibility").then(setEligibility).catch(() => {});
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess(false);
      }, 2200);
    } catch (err) {
      setSubmitError(errorMessage(err, "Could not submit your profile."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SidebarLayout title="Matrimonial Hub">
      {loadError && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-sm"
          style={{ background:"#FEE2E2", borderColor:"#FCA5A5", color:"#991B1B" }}>
          {loadError}
        </div>
      )}

      {blocked && (
        <div className="mb-5 rounded-2xl border p-5"
          style={{ background:"#FBF6EE", borderColor:"#DFC5A0" }}>
          <h3 className="font-bold mb-1" style={{ fontFamily:"'Playfair Display', serif", color:"#6B4226" }}>
            Complete your profile to browse the hub
          </h3>
          <p className="text-sm mb-3" style={{ color:"#6B4226" }}>
            The Matrimonial Hub is reciprocal — members who are listed can see
            each other. Add the missing details and your own listing goes to the
            elders for review.
          </p>
          {eligibility && (
            <ul className="text-sm list-disc list-inside mb-4" style={{ color:"#92400E" }}>
              {eligibility.reasons.map(r => <li key={r}>{r}</li>)}
              {eligibility.missing.map(m => <li key={m.key}>Add your {m.label.toLowerCase()}</li>)}
            </ul>
          )}
          <button onClick={() => setShowRegisterModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            List my profile
          </button>
        </div>
      )}

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
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>{allCandidates.length}</p>
            <p className="text-xs text-gray-400">Profiles Listed</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>
              {allCandidates.filter(c => c.verified).length}
            </p>
            <p className="text-xs text-gray-400">Elder Verified</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center border" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <p className="text-xl font-bold" style={{ color:"#1B4332" }}>{filtered.length}</p>
            <p className="text-xs text-gray-400">Matching Filters</p>
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
                  <p className="text-gray-500 text-sm">Your profile is with the Elder committee for review. It appears in the hub once approved.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                      List My Profile
                    </h3>
                    <button onClick={() => setShowRegisterModal(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-5">
                    Your name, age, gotra and native place come from your Samaj
                    profile. Fill in the rest and an elder will review the listing.
                  </p>

                  {eligibility && !eligibility.eligible && (
                    <div className="mb-5 rounded-xl border px-4 py-3 text-sm"
                      style={{ background:"#FEF3C7", borderColor:"#FCD34D", color:"#92400E" }}>
                      <p className="font-semibold mb-1">Before you can be listed:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {eligibility.reasons.map(r => <li key={r}>{r}</li>)}
                        {eligibility.missing.map(m => <li key={m.key}>Add your {m.label.toLowerCase()}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Education</label>
                      <input value={regForm.education} onChange={e => setRegForm(p=>({...p,education:e.target.value}))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="e.g. MBA Finance, IIM Ahmedabad" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Company</label>
                        <input value={regForm.company} onChange={e => setRegForm(p=>({...p,company:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                          placeholder="e.g. Infosys" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Designation</label>
                        <input value={regForm.designation} onChange={e => setRegForm(p=>({...p,designation:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                          placeholder="e.g. Senior Engineer" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Height (cm)</label>
                        <input type="number" value={regForm.heightCm} onChange={e => setRegForm(p=>({...p,heightCm:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}
                          placeholder="e.g. 168" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Family Type</label>
                        <select value={regForm.familyType} onChange={e => setRegForm(p=>({...p,familyType:e.target.value}))}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor:"#DFC5A0" }}>
                          <option>Nuclear</option>
                          <option>Joint</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>About</label>
                      <textarea value={regForm.about} onChange={e => setRegForm(p=>({...p,about:e.target.value}))}
                        rows={3}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" style={{ borderColor:"#DFC5A0" }}
                        placeholder="A few lines about yourself and what you are looking for" />
                    </div>
                    {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                    <p className="text-xs text-gray-400">Registration requires Elder committee approval. A nominal fee of ₹500 applies for listing.</p>
                    <button
                      onClick={handleRegisterSubmit}
                      disabled={submitting}
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
