"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, GitBranch, Search, CheckCircle } from "lucide-react";

const STATIC_ANCESTORS = [
  { id: "1", name: "Rameshwar Rao Revankar", location: "Puttur, Kumta · Kashyap Gotra", nominator: "Nominated by 3 Existing Members", avatar: "RR", gotra: "Kashyap" },
  { id: "2", name: "Vinayak Gokarnakar Lineage", location: "Kumta, Karnataka · Bharadwaja Gotra", nominator: "Nominated by 2 Existing Members", avatar: "VG", gotra: "Bharadwaja" },
];

interface Ancestor {
  id: string; name: string; location: string; nominator: string; avatar: string; gotra: string;
}

export default function LineagePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [connected, setConnected] = useState<string[]>([]);
  const [dbMembers, setDbMembers] = useState<Ancestor[]>([]);
  const [newRoot, setNewRoot] = useState(false);

  useEffect(() => {
    fetch("/api/family")
      .then(r => r.ok ? r.json() : [])
      .then((members: { _id: string; name: string; gotra?: string; native?: string }[]) => {
        setDbMembers(members.map(m => ({
          id: m._id,
          name: m.name,
          location: m.native || "Karnataka",
          nominator: `${m.gotra || ""} Gotra · DB Member`,
          avatar: m.name.slice(0, 2).toUpperCase(),
          gotra: m.gotra || "",
        })));
      })
      .catch(() => {});
  }, []);

  const allAncestors = useMemo(() => [...dbMembers, ...STATIC_ANCESTORS], [dbMembers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allAncestors;
    return allAncestors.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.gotra.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  }, [query, allAncestors]);

  const handleContinue = () => {
    router.push("/onboarding/heritage");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8 max-w-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: "#D1FAE5", color: "#1B4332" }}>✓</div>
          <div className="flex-1 h-1 rounded mx-1" style={{ backgroundColor: "#1B4332" }} />
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#1B4332" }}>2</div>
          <div className="flex-1 h-1 rounded mx-1 bg-gray-200" />
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-gray-400 text-sm">3</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 -mt-6 mb-8 px-1 max-w-lg">
          <span>Identity</span>
          <span style={{ color: "#1B4332", fontWeight: 600 }}>Lineage</span>
          <span>Heritage</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Find Your Roots</h1>
            <p className="text-gray-500 mb-6 text-sm">Search for your parents, gotra, or ancestor village to find an existing branch in the Daivajna Samaja tree.</p>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter a parent name, Gotra, or ancestor village…"
                className="w-full pl-9 pr-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-green-200"
                style={{ borderColor: "#E5DDD0" }}
              />
            </div>

            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              {query ? `Results for "${query}"` : "Potential Connections"}
              {filtered.length > 0 && <span className="ml-2 text-gray-400 font-normal">({filtered.length})</span>}
            </h2>

            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No matches found for &ldquo;{query}&rdquo;</p>
            )}

            <div className="space-y-3">
              {filtered.map((a) => (
                <div key={a.id} className="bg-white rounded-xl p-4 border flex items-center justify-between transition-all"
                  style={{ borderColor: connected.includes(a.id) ? "#6EE7B7" : "#E5DDD0" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                      style={{ backgroundColor: "#2D6A4F" }}>
                      {a.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{a.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} /> {a.location}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "#1B4332" }}>✓ {a.nominator}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnected(c => c.includes(a.id) ? c.filter(x => x !== a.id) : [...c, a.id])}
                    className="shrink-0 px-3 py-2 text-xs rounded-lg font-medium border transition-all"
                    style={connected.includes(a.id)
                      ? { backgroundColor: "#D1FAE5", borderColor: "#6EE7B7", color: "#065F46" }
                      : { borderColor: "#1B4332", color: "#1B4332" }}>
                    {connected.includes(a.id) ? <><CheckCircle size={11} className="inline mr-1" />Requested</> : "Request to Connect"}
                  </button>
                </div>
              ))}
            </div>

            {/* New Root Node */}
            <div className="mt-5 p-4 rounded-xl border border-dashed text-center" style={{ borderColor: "#D1D5DB" }}>
              {!newRoot ? (
                <>
                  <p className="text-sm text-gray-500 font-medium">Can&apos;t find your branch?</p>
                  <p className="text-xs text-gray-400 mt-1">You can start a new root node if your family hasn&apos;t registered yet.</p>
                  <button
                    onClick={() => setNewRoot(true)}
                    className="mt-3 px-5 py-2.5 text-xs font-semibold rounded-xl border transition-all hover:bg-green-50"
                    style={{ borderColor: "#1B4332", color: "#1B4332" }}>
                    Establish New Root Node →
                  </button>
                </>
              ) : (
                <div className="py-1">
                  <CheckCircle size={20} className="mx-auto mb-2" style={{ color: "#1B4332" }} />
                  <p className="text-sm font-semibold" style={{ color: "#1B4332" }}>New Root Node Established</p>
                  <p className="text-xs text-gray-500 mt-1">Your family will be added as a new branch. An elder will verify and link it during review.</p>
                  <button
                    onClick={() => setNewRoot(false)}
                    className="mt-2 text-xs text-gray-400 underline">
                    Undo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lineage Preview */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border sticky top-24" style={{ borderColor: "#E5DDD0" }}>
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <GitBranch size={16} style={{ color: "#1B4332" }} /> Lineage Preview
              </h3>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600">
                <div className="px-4 py-2 rounded-lg border text-center w-full" style={{ borderColor: "#1B4332", color: "#1B4332" }}>
                  {newRoot ? "New Root (Your Family)" : "Ancestral Root"}
                </div>
                {!newRoot && (
                  <>
                    <div className="w-px h-6 bg-gray-300" />
                    <div className="px-4 py-2 rounded-lg border text-center w-full border-gray-200">
                      {connected.length > 0
                        ? allAncestors.find(a => a.id === connected[0])?.name ?? "Rameshwar Rao Revankar"
                        : "Rameshwar Rao Revankar"}
                    </div>
                  </>
                )}
                <div className="w-px h-6 bg-gray-300" />
                <div className="px-4 py-2 rounded-lg border text-center w-full border-dashed border-gray-300 text-gray-400">Your Placement Here</div>
                <div className="w-px h-6 bg-gray-300" />
                <div className="px-4 py-2 rounded-lg text-center w-full text-white text-xs" style={{ backgroundColor: "#1B4332" }}>
                  {connected.length > 0 || newRoot ? "✓ Connection Requested" : "Unverified Link"}
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
                <p className="font-semibold mb-1">Nominate Vouchers</p>
                <p>To complete your lineage integrity, nominate 3 existing verified members who can vouch for your connection.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 max-w-lg">
          <button onClick={() => router.push("/onboarding/identity")}
            className="px-6 py-3 rounded-xl border text-sm"
            style={{ borderColor: "#E5DDD0" }}>← Back</button>
          <button onClick={handleContinue}
            className="flex-1 py-3 text-white rounded-xl font-semibold text-sm"
            style={{ backgroundColor: "#1B4332" }}>
            Continue to Heritage →
          </button>
        </div>
      </div>
    </div>
  );
}
