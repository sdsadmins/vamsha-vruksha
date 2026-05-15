"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Download, Heart, CheckCircle, Star } from "lucide-react";
import { MATRIMONIAL_CANDIDATES } from "@/lib/data";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [proposed, setProposed] = useState(false);
  const candidate = MATRIMONIAL_CANDIDATES.find(c => c.id === id);

  if (!candidate) return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: "#FAF7F2"}}>
      <div className="text-center">
        <p className="text-gray-500 mb-4">Profile not found</p>
        <button onClick={() => router.push("/matrimonial")} className="text-sm font-medium" style={{color: "#1B4332"}}>← Back to Matrimonial Hub</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{backgroundColor: "#FAF7F2"}}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between" style={{borderColor: "#E5DDD0"}}>
        <button onClick={() => router.push("/matrimonial")} className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft size={16} /> Candidate Profile
        </button>
        <button className="text-gray-500"><Share2 size={18} /></button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Hero card */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0" style={{backgroundColor: "#1B4332"}}>
              {candidate.avatar}
            </div>
            <div className="flex-1">
              {candidate.verified && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block" style={{backgroundColor: "#D1FAE5", color: "#065F46"}}>✓ Identity Verified</span>
              )}
              <h1 className="text-xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{candidate.name}</h1>
              <p className="text-sm text-gray-500">{candidate.age} yrs • {candidate.height} • {candidate.location}</p>
              <p className="text-xs mt-1 italic text-gray-500">&ldquo;{candidate.about.slice(0, 80)}...&rdquo;</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setProposed(true)}
              className="flex-1 py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{backgroundColor: "#1B4332"}}
            >
              <Heart size={16} /> Initiate Interest
            </button>
            <button className="px-4 py-3 border rounded-xl flex items-center gap-2 text-sm" style={{borderColor: "#E5DDD0"}}>
              <Download size={16} /> Biodata
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <h2 className="font-bold mb-2 flex items-center gap-2"><span>📋</span> About Me</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{candidate.about}</p>
        </div>

        {/* Career & Education */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <h2 className="font-bold mb-3 flex items-center gap-2"><span>🎓</span> Career &amp; Education</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Education Details", value: candidate.education },
              { label: "Professional Status", value: `${candidate.designation} — ${candidate.income}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family Background */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <h2 className="font-bold mb-3 flex items-center gap-2"><span>👨‍👩‍👧</span> Family Background</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Father", value: candidate.fatherOccupation },
              { label: "Mother", value: candidate.motherOccupation },
              { label: "Siblings", value: candidate.siblings },
              { label: "Family Type", value: candidate.familyType },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}&apos;s Details</span>
                <span className="font-medium text-right max-w-48">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Astro Details */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <h2 className="font-bold mb-3 flex items-center gap-2"><Star size={16} style={{color: "#A67C52"}} /> Astro Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Star/Nakshatra", value: candidate.star },
              { label: "Rashi/Moon Sign", value: candidate.rashi },
              { label: "Gotra", value: candidate.gotra },
              { label: "Mangal", value: candidate.mangal },
              { label: "Time of Birth", value: candidate.timeOfBirth },
            ].map(({ label, value }) => (
              <div key={label} className="p-2 rounded-lg" style={{backgroundColor: "#F9F5F0"}}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2 text-sm border rounded-lg text-center font-medium" style={{borderColor: "#1B4332", color: "#1B4332"}}>
            View Full Horoscope
          </button>
        </div>

        {/* Partner Expectations */}
        <div className="bg-white rounded-2xl border p-5" style={{borderColor: "#E5DDD0"}}>
          <h2 className="font-bold mb-3">💑 Partner Expectations</h2>
          <ul className="space-y-2">
            {candidate.partnerExpectations.map((exp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle size={14} className="shrink-0 mt-0.5" style={{color: "#1B4332"}} />
                <span className="text-gray-600">{exp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t" style={{borderColor: "#E5DDD0"}}>
        <button
          onClick={() => setProposed(true)}
          className="w-full py-4 text-white rounded-2xl font-bold text-base"
          style={{backgroundColor: "#1B4332"}}
        >
          Send Proposal
        </button>
      </div>

      {/* Toast Modal */}
      {proposed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: "#D1FAE5"}}>
              <CheckCircle size={32} style={{color: "#1B4332"}} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{fontFamily: "'Playfair Display', serif"}}>Interest Initiated!</h3>
            <p className="text-gray-500 text-sm mb-6">Our Elder Sub-committee will review your profile and reach out within 3 working days.</p>
            <button
              onClick={() => { setProposed(false); router.push("/matrimonial"); }}
              className="w-full py-3 text-white rounded-xl font-semibold"
              style={{backgroundColor: "#1B4332"}}
            >
              Back to Matrimonial Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
