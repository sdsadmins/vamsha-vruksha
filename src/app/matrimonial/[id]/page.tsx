"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Download, Heart, CheckCircle, Star, MapPin, Briefcase, Users, GraduationCap, Clock } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";
import { apiGet, apiPost, errorMessage } from "@/lib/api";

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
  designation: string;
  verified: boolean;
  photo: string;
  familyType: string;
  height: string;
  about: string;
}

function isMongoId(s: string) { return /^[a-f0-9]{24}$/i.test(s); }

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const rawId = Array.isArray(id) ? id[0] : id ?? "";

  const [proposed, setProposed]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [dbProfile, setDbProfile]   = useState<DbProfile | null>(null);
  const [dbLoading, setDbLoading]   = useState(isMongoId(rawId));
  const [proposeError, setProposeError] = useState("");

  // One profile, from its own endpoint — the page used to pull every profile
  // in the hub and find this one client-side.
  useEffect(() => {
    if (!isMongoId(rawId)) return;
    apiGet<DbProfile>(`/api/matrimonial/${rawId}`)
      .then(setDbProfile)
      .catch(() => setDbProfile(null))
      .finally(() => setDbLoading(false));
  }, [rawId]);

  /**
   * Express interest — a connection request to the member behind the profile.
   * The old page showed the "proposed" modal even when the request failed, so
   * a member could believe they had reached out when nothing was sent.
   */
  const handlePropose = async () => {
    if (!dbProfile?.userId) {
      setProposeError("This is a sample profile — there is no member to contact.");
      return;
    }
    setSaving(true);
    setProposeError("");
    try {
      await apiPost("/api/connections", { toUserId: dbProfile.userId });
      setProposed(true);
    } catch (err) {
      setProposeError(errorMessage(err, "Could not send your interest."));
    } finally {
      setSaving(false);
    }
  };

  if (dbLoading) return (
    <SidebarLayout title="Candidate Profile">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor:"#DFC5A0", borderTopColor:"#1B4332" }} />
      </div>
    </SidebarLayout>
  );

  // ── DB profile view ──
  if (isMongoId(rawId) && dbProfile) {
    return (
      <SidebarLayout title="Candidate Profile">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/matrimonial")}
            className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color:"#1B4332" }}>
            <ArrowLeft size={15} /> Back to Matrimonial Hub
          </button>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="lg:col-span-1">
            <div className="rounded-3xl overflow-hidden border sticky top-4" style={{ background:"white", borderColor:"#DFC5A0" }}>
              <div className="relative" style={{ height:"300px", background:"linear-gradient(160deg, #0D2B1E, #1B4332)" }}>
                {dbProfile.photo
                  ? <img src={dbProfile.photo} alt={dbProfile.name} className="w-full h-full object-cover object-top" />
                  : <div className="w-full h-full flex items-center justify-center text-7xl">{dbProfile.gender === "Bride" ? "👩" : "👨"}</div>}
                <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 50%, rgba(13,43,30,0.92) 100%)" }} />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background:"rgba(254,243,199,0.95)", color:"#D97706" }}>
                    ⏳ Pending Review
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background:dbProfile.gender==="Bride"?"rgba(253,232,246,0.95)":"rgba(232,240,253,0.95)", color:dbProfile.gender==="Bride"?"#9D174D":"#1E40AF" }}>
                    {dbProfile.gender}
                  </span>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'Playfair Display', serif" }}>{dbProfile.name}</h1>
                  <p className="text-green-300 text-sm">{dbProfile.age ? `${dbProfile.age} yrs` : ""} · {dbProfile.height || "—"}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { icon:MapPin,        label:"Location",  value:dbProfile.location || "—" },
                  { icon:Briefcase,     label:"Works at",  value:dbProfile.company  || "Details pending" },
                  { icon:GraduationCap, label:"Education", value:dbProfile.education || "Details pending" },
                  { icon:Users,         label:"Family",    value:`${dbProfile.familyType || "Nuclear"} family · ${dbProfile.gotra} gotra` },
                ].map(({ icon:Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:"#F0FBF4" }}>
                      <Icon size={14} style={{ color:"#1B4332" }} />
                    </div>
                    <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-semibold" style={{ color:"#0D2B1E" }}>{value}</p></div>
                  </div>
                ))}
                <div className="pt-2">
                  <button onClick={handlePropose} disabled={saving || proposed}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 4px 16px rgba(27,67,50,0.3)" }}>
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                      : proposed ? "✓ Interest Sent" : <><Heart size={16} /> Initiate Interest via Elder</>}
                  </button>
                  {proposeError && <p className="text-xs text-red-600 mt-2">{proposeError}</p>}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border p-6" style={{ background:"white", borderColor:"#DFC5A0" }}>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} style={{ color:"#D97706" }} />
                <p className="font-semibold text-sm" style={{ color:"#D97706" }}>Profile Pending Elder Review</p>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                This profile was recently submitted and is awaiting Elder committee approval. Full details (astro, family background, partner expectations) will be visible once the Elder panel verifies and approves the listing.
              </p>
            </div>
            <div className="rounded-2xl border p-5 grid grid-cols-2 gap-4" style={{ background:"white", borderColor:"#DFC5A0" }}>
              {[
                { label:"Gotra",        value:dbProfile.gotra },
                { label:"Location",     value:dbProfile.location },
                { label:"Education",    value:dbProfile.education || "—" },
                { label:"Family Type",  value:dbProfile.familyType || "Nuclear" },
              ].map(({label,value}) => (
                <div key={label} className="rounded-xl p-3" style={{ background:"#F7F0E8" }}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-sm mt-0.5" style={{ color:"#0D2B1E" }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background:"linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:"linear-gradient(135deg, #8B5E3C, #C4823A)" }}>
                <Users size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1" style={{ fontFamily:"'Playfair Display', serif" }}>Elder-Mediated Introduction</p>
                <p className="text-green-200 text-xs leading-relaxed">All introductions are managed by the Elder sub-committee. Once you express interest, the committee will review both profiles and facilitate a formal introduction.</p>
              </div>
            </div>
          </motion.div>
        </div>
        <AnimatePresence>
          {proposed && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.55)" }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setProposed(false)}>
              <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.9,opacity:0 }}
                className="rounded-3xl p-10 text-center max-w-sm w-full" style={{ background:"white" }} onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background:"#D1FAE5" }}>
                  <CheckCircle size={32} style={{ color:"#1B4332" }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Interest Initiated!</h3>
                <p className="text-gray-500 text-sm mb-6">The Elder sub-committee will review both profiles and reach out within 3 working days.</p>
                <button onClick={() => { setProposed(false); router.push("/matrimonial"); }}
                  className="w-full py-3 text-white rounded-xl font-semibold" style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  Back to Matrimonial Hub
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarLayout>
    );
  }

  // ── Static candidate not found (unknown ID) ──
  const staticCandidate = MATRIMONIAL_CANDIDATES.find(c => c.id === rawId);
  if (!staticCandidate) return (
    <SidebarLayout title="Candidate Profile">
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400">Profile not found</p>
        <button onClick={() => router.push("/matrimonial")} className="text-sm font-semibold" style={{ color:"#1B4332" }}>← Back to Matrimonial Hub</button>
      </div>
    </SidebarLayout>
  );

  const candidate = staticCandidate;

  return (
    <SidebarLayout title="Candidate Profile">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/matrimonial")}
          className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "#1B4332" }}
        >
          <ArrowLeft size={15} /> Back to Matrimonial Hub
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: "#DFC5A0" }}>
            <Share2 size={16} style={{ color: "#6B7280" }} />
          </button>
          <button className="p-2 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: "#DFC5A0" }}>
            <Download size={16} style={{ color: "#6B7280" }} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN — profile card ─────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-1"
        >
          <div className="rounded-3xl overflow-hidden border sticky top-4" style={{ background: "white", borderColor: "#DFC5A0" }}>
            {/* Photo */}
            <div className="relative" style={{ height: "300px" }}>
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(13,43,30,0.92) 100%)" }} />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {candidate.verified && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(209,250,229,0.95)", color: "#065F46" }}>
                    ✓ Verified
                  </span>
                )}
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: candidate.gender === "F" ? "rgba(253,232,246,0.95)" : "rgba(232,240,253,0.95)", color: candidate.gender === "F" ? "#9D174D" : "#1E40AF" }}>
                  {candidate.gender === "F" ? "Bride" : "Groom"}
                </span>
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-4 left-5 right-5">
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {candidate.name}
                </h1>
                <p className="text-green-300 text-sm">{candidate.age} yrs · {candidate.height}</p>
              </div>
            </div>

            {/* Key details */}
            <div className="p-5 space-y-4">
              {[
                { icon: MapPin,     label: "Location",  value: candidate.location },
                { icon: Briefcase,  label: "At",        value: candidate.company.split("—")[0].trim() },
                { icon: GraduationCap, label: "Education", value: candidate.education.split(",")[0] },
                { icon: Users,      label: "Family",    value: candidate.familyType + " family · " + candidate.gotra + " gotra" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#F0FBF4" }}>
                    <Icon size={14} style={{ color: "#1B4332" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{value}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2 space-y-2">
                <button
                  onClick={handlePropose}
                  disabled={saving || proposed}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.3)" }}
                >
                  {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    : proposed ? "✓ Interest Sent" : <><Heart size={16} /> Initiate Interest via Elder</>}
                </button>
                <button className="w-full py-3 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#DFC5A0", color: "#1B4332" }}>
                  <Download size={15} /> Download Biodata PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMNS — details ─────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* Income badge */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Annual Income", value: candidate.income },
              { label: "Designation",   value: candidate.designation },
              { label: "Complexion",    value: candidate.complexion },
              { label: "Mangal",        value: candidate.mangal === "Yes" ? "Mangalik" : "Non-Mangalik" },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-2 rounded-xl border text-center"
                style={{ background: "white", borderColor: "#DFC5A0" }}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-bold" style={{ color: "#1B4332" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              About
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">{candidate.about}</p>
          </div>

          {/* Career & Family — 2 col */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#DFC5A0" }}>
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
                <GraduationCap size={16} style={{ color: "#1B4332" }} /> Career &amp; Education
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Education",   value: candidate.education },
                  { label: "Company",     value: candidate.company },
                  { label: "Designation", value: candidate.designation },
                  { label: "Income",      value: candidate.income + " p.a." },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#DFC5A0" }}>
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
                <Users size={16} style={{ color: "#1B4332" }} /> Family Background
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Father",      value: candidate.fatherOccupation },
                  { label: "Mother",      value: candidate.motherOccupation },
                  { label: "Siblings",    value: candidate.siblings },
                  { label: "Family Type", value: candidate.familyType },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1E" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Astro */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
              <Star size={16} style={{ color: "#8B5E3C" }} fill="#8B5E3C" /> Astro Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "Star / Nakshatra", value: candidate.star },
                { label: "Rashi",            value: candidate.rashi },
                { label: "Gotra",            value: candidate.gotra },
                { label: "Mangal",           value: candidate.mangal === "Yes" ? "Mangalik ⚠" : "Non-Mangalik ✓" },
                { label: "Time of Birth",    value: candidate.timeOfBirth },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#F7F0E8" }}>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold" style={{ color: "#1B4332" }}>{value}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 text-sm border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#C4823A", color: "#8B5E3C" }}>
              View Full Horoscope Chart
            </button>
          </div>

          {/* Partner Expectations */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#DFC5A0" }}>
            <h2 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Partner Expectations
            </h2>
            <ul className="space-y-3">
              {candidate.partnerExpectations.map((exp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "#D1FAE5" }}>
                    <CheckCircle size={12} style={{ color: "#065F46" }} />
                  </div>
                  <span className="text-gray-600">{exp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Elder mediation note */}
          <div className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)" }}>
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Elder-Mediated Introduction
              </p>
              <p className="text-green-200 text-xs leading-relaxed">
                All Daivajna Samaja introductions are managed by the Elder sub-committee to ensure cultural and lineage alignment. Once you express interest, the committee will review both profiles and facilitate a formal introduction.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {proposed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setProposed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl p-10 text-center max-w-sm w-full"
              style={{ background: "white" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#D1FAE5" }}>
                <CheckCircle size={32} style={{ color: "#1B4332" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Interest Initiated!
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                The Elder sub-committee will review both profiles and reach out within 3 working days to facilitate an introduction.
              </p>
              <button
                onClick={() => { setProposed(false); router.push("/matrimonial"); }}
                className="w-full py-3 text-white rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
              >
                Back to Matrimonial Hub
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
