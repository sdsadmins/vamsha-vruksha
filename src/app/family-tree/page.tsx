"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Plus, Search, Star, MapPin, Briefcase, Calendar, Users } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { FAMILY_MEMBERS } from "@/lib/data";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

type Member = (typeof FAMILY_MEMBERS)[0];

const LIFE_ARCHIVES: Record<string, string> = {
  "1": "Ramachandra Shet was the patriarch of our Kundapura branch — a master goldsmith who established the family jewellery tradition in 1942. He trained over 40 craftsmen in the Daivadnya tradition, and his 47-year handwritten ledger is the foundation of this digital tree.",
  "2": "Savitribai Shet was the matriarch renowned for devotion to Samaj seva and Sanskrit shlokas. She organised the first Samaj women's collective in Kundapura and led fund drives for the community temple for over three decades.",
  "3": "Venkatesh Kamat migrated from Kumta to Bengaluru in 1975 to expand the jewellery trade to Commercial Street. He mentored 12 apprentices from the Samaj and his descendants now span Bengaluru, Mangaluru, Singapore, and Dubai.",
  "4": "Suresh Kamat is the first in the family to enter software engineering — bridging the goldsmith legacy with the Bengaluru IT boom. He co-founded the Daivadnya Samaj IT professionals' WhatsApp network, which now has 600+ members.",
  "5": "Rekha Pai is a distinguished educator and community leader. She established the Daivadnya Samaj scholarship fund in 2008 and has personally mentored over 300 students from the Samaj across Karnataka.",
  "6": "Priya Kamat represents the new generation — digitising 500+ family photos, building this Vamsha Vruksha platform, and connecting 1,400+ families worldwide. She won the Samaj Youth Icon award in 2023.",
};

// Node positions — viewBox "0 40 900 620"
const NODES = [
  { id: "1", x: 300, y: 110,  label: "Ramachandra Shet",  sub: "Patriarch · Kashyap",      gen: 1 },
  { id: "2", x: 570, y: 110,  label: "Savitribai Shet",   sub: "Matriarch · Kashyap",      gen: 1 },
  { id: "3", x: 435, y: 265,  label: "Venkatesh Kamat",   sub: "Grandfather · Bharadwaja", gen: 2 },
  { id: "4", x: 240, y: 415,  label: "Suresh Kamat",      sub: "Father · Kashyap",         gen: 3 },
  { id: "5", x: 660, y: 415,  label: "Rekha Pai",         sub: "Aunt · Bharadwaja",        gen: 3 },
  { id: "6", x: 240, y: 560,  label: "Priya Kamat",       sub: "You · Kashyap",            gen: 4 },
];

const LINES: Array<{ x1: number; y1: number; x2: number; y2: number; delay: number }> = [
  { x1: 300, y1: 110, x2: 435, y2: 265, delay: 0.25 },
  { x1: 570, y1: 110, x2: 435, y2: 265, delay: 0.35 },
  { x1: 435, y1: 265, x2: 240, y2: 415, delay: 0.65 },
  { x1: 435, y1: 265, x2: 660, y2: 415, delay: 0.75 },
  { x1: 240, y1: 415, x2: 240, y2: 560, delay: 1.05 },
];

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const R = 46; // node radius

function TreeNode({
  node, isSelected, onClick, drawn, isLate,
}: {
  node: (typeof NODES)[0]; isSelected: boolean; onClick: () => void; drawn: boolean; isLate: boolean;
}) {
  const isYou = node.id === "6";
  const photoSize = R * 2 - 6; // 86px
  const half = photoSize / 2;

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.45s ease ${0.15 + (node.gen - 1) * 0.38}s` }}
    >
      {/* Animated glow ring when selected */}
      {isSelected && (
        <circle cx={node.x} cy={node.y} r={R + 8} fill="none" stroke="#D4AF7A" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values={`${R+6};${R+12};${R+6}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* White backing circle */}
      <circle cx={node.x} cy={node.y} r={R}
        fill="white"
        stroke={isSelected ? "#D4AF7A" : isLate ? "#D1D5DB" : "#2D6A4F"}
        strokeWidth={isSelected ? 3 : 2.5} />

      {/* Clipped photo */}
      <defs>
        <clipPath id={`clip-${node.id}`}>
          <circle cx={node.x} cy={node.y} r={R - 3} />
        </clipPath>
      </defs>
      <foreignObject
        x={node.x - half} y={node.y - half}
        width={photoSize} height={photoSize}
        clipPath={`url(#clip-${node.id})`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR_SVGS[node.id] ?? ""}
          alt={node.label}
          width={photoSize} height={photoSize}
          style={{ objectFit: "cover", display: "block", filter: isLate ? "grayscale(55%)" : "none" }}
        />
      </foreignObject>

      {/* Border ring on top */}
      <circle cx={node.x} cy={node.y} r={R} fill="none"
        stroke={isSelected ? "#D4AF7A" : isLate ? "#9CA3AF" : "#2D6A4F"}
        strokeWidth={isSelected ? 3 : 2.5} />

      {/* YOU badge */}
      {isYou && (
        <>
          <rect x={node.x - 16} y={node.y + R - 2} width="32" height="14" rx="7" fill="#D4AF7A" />
          <text x={node.x} y={node.y + R + 9} textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter, sans-serif">YOU</text>
        </>
      )}

      {/* Name label */}
      <text x={node.x} y={node.y + R + (isYou ? 22 : 14)}
        textAnchor="middle" fill="#0D2B1E" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
        {node.label.split(" ").slice(0, 2).join(" ")}
      </text>
      <text x={node.x} y={node.y + R + (isYou ? 35 : 27)}
        textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="Inter, sans-serif">
        {node.sub.split("·")[0].trim()}
      </text>
    </g>
  );
}

export default function FamilyTreePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 220);
    return () => clearTimeout(t);
  }, []);

  const selectedMember: Member | undefined = FAMILY_MEMBERS.find(m => m.id === selected);
  const parentMember = selectedMember?.parent
    ? FAMILY_MEMBERS.find(m => m.id === selectedMember.parent)
    : null;
  const childrenMembers = selectedMember
    ? FAMILY_MEMBERS.filter(m => m.parent === selectedMember.id)
    : [];

  return (
    <SidebarLayout title="Vamsha Vruksha — Family Tree">
      <div className="flex gap-6" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* ── Tree Canvas ──────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search family members…" className="input-premium pl-9 py-2 text-sm w-56" />
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#F0E6D3", border: "1px solid #E8D5BC" }}>
                {["Patriarchal", "Matriarchal"].map((v, i) => (
                  <button key={v} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={i === 0
                      ? { background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "white" }
                      : { color: "#6B7280" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 2px 12px rgba(27,67,50,0.3)" }}
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(160deg, #FAF7F2 0%, #F0E6D3 100%)", border: "1px solid #E8D5BC", minHeight: "620px" }}>

            {/* Generation labels (left rail) */}
            <div className="absolute left-3 top-0 bottom-0 flex flex-col pointer-events-none py-16 justify-around">
              {["Gen I", "Gen II", "Gen III", "Gen IV"].map(g => (
                <span key={g} className="text-xs font-semibold"
                  style={{ color: "#C49A6C", letterSpacing: "0.08em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {g}
                </span>
              ))}
            </div>

            <svg viewBox="0 40 900 620" className="w-full h-full" style={{ minHeight: "600px" }}>
              {/* Dashed generation guide lines */}
              {[110, 265, 415, 560].map(y => (
                <line key={y} x1="60" y1={y} x2="840" y2={y}
                  stroke="#1B4332" strokeWidth="0.5" strokeDasharray="4,10" opacity="0.1" />
              ))}

              {/* Spouse connector */}
              <line x1={300 + R} y1="110" x2={570 - R} y2="110"
                stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="5,4"
                opacity={drawn ? 0.65 : 0} style={{ transition: "opacity 0.4s 0.1s" }} />
              <text x="435" y="106" textAnchor="middle" fontSize="10"
                opacity={drawn ? 0.8 : 0} style={{ transition: "opacity 0.4s 0.15s" }}>♥</text>

              {/* Animated connecting lines */}
              {LINES.map(({ x1, y1, x2, y2, delay }, i) => {
                const length = dist(x1, y1, x2, y2);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#A67C52" strokeWidth="2" strokeLinecap="round"
                    strokeDasharray={length} strokeDashoffset={drawn ? 0 : length}
                    style={{ transition: `stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1) ${delay}s` }}
                    opacity="0.6" />
                );
              })}

              {/* Junction dots */}
              {drawn && (
                <>
                  <circle cx="435" cy="265" r="5" fill="#A67C52" opacity="0.45" />
                  <circle cx="240" cy="415" r="5" fill="#A67C52" opacity="0.45" />
                </>
              )}

              {/* Nodes */}
              {NODES.map(node => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isSelected={selected === node.id}
                  isLate={FAMILY_MEMBERS.find(m => m.id === node.id)?.status === "Late"}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                  drawn={drawn}
                />
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
              {[
                { color: "#A67C52", label: "Gen I–II" },
                { color: "#1B4332", label: "Gen III+" },
                { color: "#D4AF7A", label: "You" },
                { color: "#9CA3AF", label: "In Memoriam" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #E8D5BC" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Click hint */}
            {!selected && drawn && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background: "rgba(27,67,50,0.07)", color: "#2D6A4F", border: "1px solid rgba(27,67,50,0.12)" }}>
                👆 Click any node to explore
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Detail Panel ─────────────────────────── */}
        <AnimatePresence>
          {selected && selectedMember && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.97 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-96 shrink-0"
            >
              <div className="rounded-3xl overflow-hidden sticky top-4"
                style={{ background: "white", border: "1px solid #E8D5BC", boxShadow: "0 8px 48px rgba(27,67,50,0.15)" }}>

                {/* ─── Photo header ─── */}
                <div className="relative" style={{ height: "220px" }}>
                  <img
                    src={AVATAR_SVGS[selected] ?? ""}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover object-top"
                    style={selectedMember.status === "Late" ? { filter: "grayscale(40%)" } : {}}
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(13,43,30,0.95) 100%)" }} />

                  {/* Close button */}
                  <button onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(0,0,0,0.35)" }}>
                    <X size={15} className="text-white" />
                  </button>

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    {selectedMember.status === "Active"
                      ? <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(209,250,229,0.9)", color: "#065F46" }}>✓ Active Member</span>
                      : <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(156,163,175,0.85)", color: "#fff" }}>In Memoriam</span>
                    }
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedMember.status === "Late" ? "Late " : ""}{selectedMember.name}
                    </h3>
                    <p className="text-green-300 text-sm">{selectedMember.relation}</p>
                  </div>
                </div>

                {/* ─── Detail body ─── */}
                <div className="p-5 space-y-4">
                  {/* Key stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Calendar, label: "Born", value: selectedMember.birthYear ?? "—" },
                      { icon: Star,     label: "Gotra", value: selectedMember.gotra },
                      { icon: MapPin,   label: "Native", value: selectedMember.native.split(",")[0] },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "#F9F5F0" }}>
                        <Icon size={12} className="mx-auto mb-1" style={{ color: "#A67C52" }} />
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: "#0D2B1E" }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Occupation */}
                  <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: "#F0FBF4", border: "1px solid #B7E4C7" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#D1FAE5" }}>
                      <Briefcase size={13} style={{ color: "#1B4332" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Occupation</p>
                      <p className="text-sm font-semibold leading-snug" style={{ color: "#0D2B1E" }}>{selectedMember.occupation}</p>
                    </div>
                  </div>

                  {/* Family connections */}
                  {(parentMember || childrenMembers.length > 0) && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Users size={11} /> Family
                      </p>
                      <div className="space-y-1.5">
                        {parentMember && (
                          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(parentMember.id)}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: "#E8D5BC" }}>
                              <img src={AVATAR_SVGS[parentMember.id] ?? ""} alt={parentMember.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{parentMember.name}</p>
                              <p className="text-xs text-gray-400">{parentMember.relation}</p>
                            </div>
                            <ArrowRight size={11} className="text-gray-300" />
                          </div>
                        )}
                        {childrenMembers.map(child => (
                          <div key={child.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(child.id)}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: "#E8D5BC" }}>
                              <img src={AVATAR_SVGS[child.id] ?? ""} alt={child.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{child.name}</p>
                              <p className="text-xs text-gray-400">{child.relation}</p>
                            </div>
                            <ArrowRight size={11} className="text-gray-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Life Archive */}
                  {LIFE_ARCHIVES[selected] && (
                    <div className="rounded-xl p-4" style={{ background: "#FBF8F3", border: "1px solid #E8D5BC" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={12} style={{ color: "#A67C52" }} fill="#A67C52" />
                        <span className="text-xs font-semibold" style={{ color: "#1B4332" }}>Life Archive</span>
                      </div>
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        &ldquo;{LIFE_ARCHIVES[selected]}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/profile/${selected}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.25)" }}
                  >
                    View Full Profile <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarLayout>
  );
}
