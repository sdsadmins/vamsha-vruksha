"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function HeritagePage() {
  const router = useRouter();
  const [gotra, setGotra] = useState("Kashyap");
  const [native, setNative] = useState("Udupi, Karnataka");
  const [bio, setBio] = useState("");
  const [matrimonial, setMatrimonial] = useState(false);

  return (
    <div className="min-h-screen" style={{backgroundColor: "#FAF7F2"}}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8 max-w-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{backgroundColor: "#D1FAE5", color: "#1B4332"}}>✓</div>
          <div className="flex-1 h-1 rounded mx-1" style={{backgroundColor: "#1B4332"}}></div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{backgroundColor: "#D1FAE5", color: "#1B4332"}}>✓</div>
          <div className="flex-1 h-1 rounded mx-1" style={{backgroundColor: "#1B4332"}}></div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{backgroundColor: "#1B4332"}}>3</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 -mt-6 mb-8 px-1 max-w-lg">
          <span>Identity</span>
          <span>Lineage</span>
          <span style={{color: "#1B4332", fontWeight: 600}}>Heritage</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2" style={{fontFamily: "'Playfair Display', serif"}}>Cultural Profile &amp; Heritage</h1>
            <p className="text-gray-500 mb-6 text-sm">The final step to documenting your legacy within the Daivagna community.</p>

            <div className="bg-white rounded-2xl p-6 border space-y-4" style={{borderColor: "#E5DDD0"}}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Gotra</label>
                  <input
                    type="text" placeholder="e.g. Kashyap"
                    value={gotra} onChange={e => setGotra(e.target.value)}
                    className="w-full px-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-200"
                    style={{borderColor: "#E5DDD0"}}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Native Place (Kula Devata Location)</label>
                  <input
                    type="text" placeholder="e.g. Gokarna"
                    value={native} onChange={e => setNative(e.target.value)}
                    className="w-full px-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-200"
                    style={{borderColor: "#E5DDD0"}}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Professional Bio</label>
                <textarea
                  rows={4} placeholder="Tell the community about your work and skills."
                  value={bio} onChange={e => setBio(e.target.value)}
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-200 resize-none"
                  style={{borderColor: "#E5DDD0"}}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
                <input type="checkbox" checked={matrimonial} onChange={e => setMatrimonial(e.target.checked)} className="mt-1" />
                <div>
                  <p className="text-sm font-medium">Opt-in to Matrimonial Hub</p>
                  <p className="text-xs text-gray-500 mt-0.5">Make your profile discoverable to families seeking matrimonial connections within the Samaj. You can change this preference anytime.</p>
                </div>
              </label>
              <div>
                <p className="text-xs text-gray-500 mb-2">Optional: Upload Family Documents (birth certificate, old letters or heirlooms PDF/JPG)</p>
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-400" style={{borderColor: "#D1D5DB"}}>
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500">Click to upload family documents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="hidden lg:block">
            <div className="rounded-2xl p-5 text-white" style={{backgroundColor: "#1B4332"}}>
              <p className="text-xs text-green-300 mb-1 font-medium">Welcome to the Samaj</p>
              <p className="text-sm leading-relaxed">By completing this step, you become a verified member in our living digital tree. You help maintain the cultural integrity and social fabric of the Daivajna community.</p>
              <div className="mt-4 space-y-2 text-sm">
                {["Access to the Global Lineage Directory", "Participation in Samaja Governance", "Community Welfare Program Eligibility"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-green-200">
                    <span className="text-green-400">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 max-w-2xl">
          <button onClick={() => router.push("/onboarding/lineage")} className="px-6 py-3 rounded-xl border text-sm" style={{borderColor: "#E5DDD0"}}>← Back to Lineage</button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-4 text-white rounded-xl font-semibold"
            style={{backgroundColor: "#1B4332"}}
          >
            Complete Profile ✓
          </button>
        </div>
      </div>
    </div>
  );
}
