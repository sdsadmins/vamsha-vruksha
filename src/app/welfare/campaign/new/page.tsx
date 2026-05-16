"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle, Lock } from "lucide-react";
import { getUser, clearUser } from "@/lib/auth";

const CATEGORIES = ["Cultural Heritage", "Education", "Infrastructure", "Health & Welfare", "Youth Development", "Elder Support"];
const STEPS = ["Details", "Funding", "Transparency"];

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [form, setForm] = useState({ title: "", category: "Cultural Heritage", story: "", goal: "", minDonation: "100", endDate: "", impactDesc: "" });

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setAuthorized(u.role === "elder");
  }, [router]);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (authorized === null) return null;

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#FEF3C7" }}>
          <Lock size={36} style={{ color: "#8B5E3C" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>
          Elder Access Required
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Only verified Elders and Administrators can start welfare campaigns. All campaigns require Elder committee approval before going live.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { clearUser(); router.push("/login"); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)" }}
          >
            Switch to Elder Login
          </button>
          <button
            onClick={() => router.push("/welfare")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: "#DFC5A0", color: "#1B4332" }}
          >
            Back to Welfare
          </button>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{backgroundColor: "#FAF7F2"}}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: "#D1FAE5"}}>
          <CheckCircle size={40} style={{color: "#1B4332"}} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{fontFamily: "'Playfair Display', serif"}}>Campaign Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">Your campaign has been submitted to the Elder Sub-committee for review. You&apos;ll receive a notification within 48 hours.</p>
        <button onClick={() => router.push("/welfare")} className="w-full py-3 text-white rounded-xl font-semibold" style={{backgroundColor: "#1B4332"}}>
          Back to Welfare Portal
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{backgroundColor: "#FAF7F2"}}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-3" style={{borderColor: "#E5DDD0"}}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : router.push("/welfare")}>
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Launch a New Campaign</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={i + 1 <= step ? {backgroundColor: "#1B4332", color: "white"} : {backgroundColor: "#E5E7EB", color: "#6B7280"}}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className="text-xs mt-1" style={{color: i + 1 === step ? "#1B4332" : "#9CA3AF"}}>{s}</span>
              </div>
              {i < 2 && <div className="w-12 h-0.5 mb-4" style={{backgroundColor: i + 1 < step ? "#1B4332" : "#E5E7EB"}}></div>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6" style={{borderColor: "#E5DDD0"}}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Campaign Details</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Campaign Title</label>
                <input
                  type="text" placeholder="e.g. Restoration of Heritage Library"
                  value={form.title} onChange={e => update("title", e.target.value)}
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-200"
                  style={{borderColor: "#E5DDD0"}}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full px-3 py-3 text-sm border rounded-lg outline-none" style={{borderColor: "#E5DDD0"}}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Campaign Story</label>
                <textarea
                  rows={4} placeholder="Describe the history, the need, and the impact of this campaign on our community..."
                  value={form.story} onChange={e => update("story", e.target.value)}
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none resize-none"
                  style={{borderColor: "#E5DDD0"}}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Campaign Banner</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-green-400" style={{borderColor: "#D1D5DB"}}>
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Upload banner image</p>
                  <p className="text-xs text-gray-400 mt-1">High-resolution JPEG or PNG. Recommended: 1200×480px</p>
                </div>
              </div>
              <div className="p-4 rounded-xl flex gap-3" style={{backgroundColor: "#FEF3C7"}}>
                <span className="text-xl">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">A Note on Transparency</p>
                  <p className="text-xs text-amber-700 mt-1">Each campaign within Daivajna Samaja is vetted by the elder sub-committee to ensure heritage alignment and financial integrity.</p>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 text-white rounded-xl font-semibold" style={{backgroundColor: "#1B4332"}}>
                Next: Funding Goals →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Funding Goals</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Fundraising Goal (₹)</label>
                <input
                  type="number" placeholder="e.g. 500000"
                  value={form.goal} onChange={e => update("goal", e.target.value)}
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none"
                  style={{borderColor: "#E5DDD0"}}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Minimum Donation (₹)</label>
                <div className="flex gap-2">
                  {["100", "500", "1000"].map(amt => (
                    <button key={amt} onClick={() => update("minDonation", amt)} className="px-4 py-2 rounded-lg text-sm border"
                      style={form.minDonation === amt ? {backgroundColor: "#1B4332", color: "white", borderColor: "#1B4332"} : {borderColor: "#E5DDD0"}}>
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Campaign End Date</label>
                <input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)} className="w-full px-3 py-3 text-sm border rounded-lg outline-none" style={{borderColor: "#E5DDD0"}} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-xl text-sm" style={{borderColor: "#E5DDD0"}}>← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 text-white rounded-xl font-semibold" style={{backgroundColor: "#1B4332"}}>
                  Next: Transparency →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Transparency &amp; Impact</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Impact Description</label>
                <textarea
                  rows={4} placeholder="How will the funds be used? What is the measurable impact?"
                  value={form.impactDesc} onChange={e => update("impactDesc", e.target.value)}
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none resize-none"
                  style={{borderColor: "#E5DDD0"}}
                />
              </div>
              <div className="p-4 rounded-xl space-y-2" style={{backgroundColor: "#D1FAE5"}}>
                <p className="font-semibold text-sm" style={{color: "#065F46"}}>Verification Checklist</p>
                {["Campaign is for community benefit", "Funds will be managed by committee", "Monthly progress reports will be shared", "Elder sub-committee has been informed"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{color: "#047857"}}>
                    <CheckCircle size={14} /> {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border rounded-xl text-sm" style={{borderColor: "#E5DDD0"}}>← Back</button>
                <button onClick={() => setSubmitted(true)} className="flex-1 py-3 text-white rounded-xl font-semibold" style={{backgroundColor: "#1B4332"}}>
                  Submit Campaign ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
