"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, GitBranch } from "lucide-react";

const POTENTIAL_ANCESTORS = [
  { id: "1", name: "Rameshwar Rao Daivagna", location: "Puttur, Kumta Gotra-Kashya Khittal Branch", nominator: "Nominated by 3 Existing Members", avatar: "RD" },
  { id: "2", name: "Vinayak Gokarna Lineage", location: "Kumta, Karnataka", nominator: "Nominated by 2 Existing Members", avatar: "VG" },
];

export default function LineagePage() {
  const router = useRouter();
  const [connected, setConnected] = useState<string[]>([]);

  return (
    <div className="min-h-screen" style={{backgroundColor: "#FAF7F2"}}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8 max-w-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{backgroundColor: "#D1FAE5", color: "#1B4332"}}>✓</div>
          <div className="flex-1 h-1 rounded mx-1" style={{backgroundColor: "#1B4332"}}></div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{backgroundColor: "#1B4332"}}>2</div>
          <div className="flex-1 h-1 rounded mx-1 bg-gray-200"></div>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-gray-400 text-sm">3</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 -mt-6 mb-8 px-1 max-w-lg">
          <span>Identity</span>
          <span style={{color: "#1B4332", fontWeight: 600}}>Lineage</span>
          <span>Heritage</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2" style={{fontFamily: "'Playfair Display', serif"}}>Find Your Roots</h1>
            <p className="text-gray-500 mb-6 text-sm">Search for your identity to find the existing community lineage. Search for your parents or an existing family branch to establish your place in the Daivajna Samaja.</p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter a parent name, Gotra, or ancestor village..."
                className="w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-green-200"
                style={{borderColor: "#E5DDD0"}}
              />
            </div>

            <h2 className="text-sm font-semibold text-gray-700 mb-3">Potential Connections</h2>
            <div className="space-y-3">
              {POTENTIAL_ANCESTORS.map((a) => (
                <div key={a.id} className="bg-white rounded-xl p-4 border flex items-center justify-between" style={{borderColor: "#E5DDD0"}}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{backgroundColor: "#2D6A4F"}}>
                      {a.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{a.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10}/> {a.location}
                      </div>
                      <p className="text-xs mt-0.5" style={{color: "#1B4332"}}>✓ {a.nominator}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnected(c => connected.includes(a.id) ? c : [...c, a.id])}
                    className="px-3 py-2 text-xs rounded-lg font-medium border transition-colors"
                    style={connected.includes(a.id)
                      ? {backgroundColor: "#D1FAE5", borderColor: "#6EE7B7", color: "#065F46"}
                      : {borderColor: "#1B4332", color: "#1B4332"}}
                  >
                    {connected.includes(a.id) ? "✓ Requested" : "Request to Connect"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-xl border border-dashed text-center" style={{borderColor: "#D1D5DB"}}>
              <p className="text-sm text-gray-500 font-medium">Can&apos;t find your branch?</p>
              <p className="text-xs text-gray-400 mt-1">You can start a new root node if your family hasn&apos;t registered yet.</p>
              <button className="mt-2 text-xs font-medium" style={{color: "#1B4332"}}>Establish New Root Node →</button>
            </div>
          </div>

          {/* Lineage Preview */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border sticky top-24" style={{borderColor: "#E5DDD0"}}>
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <GitBranch size={16} style={{color: "#1B4332"}} /> Lineage Preview
              </h3>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600">
                <div className="px-4 py-2 rounded-lg border text-center w-full" style={{borderColor: "#1B4332", color: "#1B4332"}}>Ancestral Root</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="px-4 py-2 rounded-lg border text-center w-full border-gray-200">Rameshwar Rao</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="px-4 py-2 rounded-lg border text-center w-full border-dashed border-gray-300 text-gray-400">Your Placement Here</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="px-4 py-2 rounded-lg text-center w-full text-white text-xs" style={{backgroundColor: "#1B4332"}}>Unverified Link</div>
              </div>
              <div className="mt-4 p-3 rounded-lg text-xs" style={{backgroundColor: "#D1FAE5", color: "#065F46"}}>
                <p className="font-semibold mb-1">Nominate Vouchers</p>
                <p>To complete your lineage integrity, please nominate 3 existing verified members who can vouch for your connection.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 max-w-lg">
          <button onClick={() => router.push("/onboarding/identity")} className="px-6 py-3 rounded-xl border text-sm" style={{borderColor: "#E5DDD0"}}>← Back</button>
          <button onClick={() => router.push("/onboarding/heritage")} className="flex-1 py-3 text-white rounded-xl font-semibold text-sm" style={{backgroundColor: "#1B4332"}}>
            Continue to Heritage →
          </button>
        </div>
      </div>
    </div>
  );
}
