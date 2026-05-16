"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Download, Heart, CheckCircle, Star, MapPin, Briefcase, Users, GraduationCap } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [proposed, setProposed] = useState(false);
  const candidate = MATRIMONIAL_CANDIDATES.find(c => c.id === id);

  if (!candidate) return (
    <SidebarLayout title="Candidate Profile">
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400">Profile not found</p>
        <button onClick={() => router.push("/matrimonial")} className="text-sm font-semibold" style={{ color: "#1B4332" }}>
          ← Back to Matrimonial Hub
        </button>
      </div>
    </SidebarLayout>
  );

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
          <button className="p-2 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
            <Share2 size={16} style={{ color: "#6B7280" }} />
          </button>
          <button className="p-2 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
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
          <div className="rounded-3xl overflow-hidden border sticky top-4" style={{ background: "white", borderColor: "#E8D5BC" }}>
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
                  onClick={() => setProposed(true)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.3)" }}
                >
                  <Heart size={16} /> Initiate Interest via Elder
                </button>
                <button className="w-full py-3 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#E8D5BC", color: "#1B4332" }}>
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
                style={{ background: "white", borderColor: "#E8D5BC" }}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-bold" style={{ color: "#1B4332" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              About
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">{candidate.about}</p>
          </div>

          {/* Career & Family — 2 col */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
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

            <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
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
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#0D2B1E" }}>
              <Star size={16} style={{ color: "#A67C52" }} fill="#A67C52" /> Astro Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "Star / Nakshatra", value: candidate.star },
                { label: "Rashi",            value: candidate.rashi },
                { label: "Gotra",            value: candidate.gotra },
                { label: "Mangal",           value: candidate.mangal === "Yes" ? "Mangalik ⚠" : "Non-Mangalik ✓" },
                { label: "Time of Birth",    value: candidate.timeOfBirth },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#F9F5F0" }}>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold" style={{ color: "#1B4332" }}>{value}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 text-sm border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#D4AF7A", color: "#A67C52" }}>
              View Full Horoscope Chart
            </button>
          </div>

          {/* Partner Expectations */}
          <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
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
              style={{ background: "linear-gradient(135deg, #A67C52, #D4AF7A)" }}>
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Elder-Mediated Introduction
              </p>
              <p className="text-green-200 text-xs leading-relaxed">
                All Daivadnya Samaj introductions are managed by the Elder sub-committee to ensure cultural and lineage alignment. Once you express interest, the committee will review both profiles and facilitate a formal introduction.
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
