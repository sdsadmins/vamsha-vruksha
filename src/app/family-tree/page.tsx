"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Plus, Search, Star } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { FAMILY_MEMBERS } from "@/lib/data";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

type Member = (typeof FAMILY_MEMBERS)[0];

// Avatar gradient colors per node id
const GEN_COLORS: Record<string, string[]> = {
  "1": ["#6B4226", "#A67C52"],
  "2": ["#A67C52", "#D4AF7A"],
  "3": ["#1B4332", "#2D6A4F"],
  "4": ["#0D2B1E", "#1B4332"],
  "5": ["#0D2B1E", "#1B4332"],
  "6": ["#0D2B1E", "#1B4332"],
};

const LIFE_ARCHIVES: Record<string, string> = {
  "1": "Ramachandra Shet was the patriarch of our Kundapura branch and a master goldsmith. He established the family jewellery tradition in 1942 and trained over 40 craftsmen in the Daivadnya tradition.",
  "2": "Savitribai Shet was the matriarch of the Shet household, renowned for her devotion to Samaj seva and Sanskrit shlokas. She organised the first Samaj women's collective in Kundapura.",
  "3": "Venkatesh Kamat migrated from Kumta to Bengaluru in 1975 to expand the jewellery business. His descendants now span Bengaluru, Mangaluru, Singapore, and Dubai.",
  "4": "Suresh Kamat is the first in the family to enter software engineering, bridging the goldsmith legacy with Bengaluru's IT boom. He co-founded the Samaj IT professional network.",
  "5": "Rekha Pai is a distinguished educator and Samaj community leader. She established the Daivadnya Samaj annual scholarship fund in 2008 and has mentored over 300 students.",
  "6": "Priya Kamat represents the new generation of Daivadnya Samaj — digitising over 500 family photos, creating this Vamsha Vruksha platform, and connecting 1,400+ families online.",
};

// Node positions in the SVG viewBox (0 0 900 620)
const NODES = [
  { id: "1", x: 320, y: 90,  label: "Ramachandra Shet",  sub: "Patriarch · Kashyap",      gen: 1 },
  { id: "2", x: 560, y: 90,  label: "Savitribai Shet",   sub: "Matriarch · Kashyap",      gen: 1 },
  { id: "3", x: 440, y: 230, label: "Venkatesh Kamat",   sub: "Grandfather · Bharadwaja", gen: 2 },
  { id: "4", x: 250, y: 375, label: "Suresh Kamat",      sub: "Father · Kashyap",         gen: 3 },
  { id: "5", x: 650, y: 375, label: "Rekha Pai",         sub: "Aunt · Bharadwaja",        gen: 3 },
  { id: "6", x: 250, y: 520, label: "Priya Kamat",       sub: "You · Kashyap",            gen: 4 },
];

// Lines: [x1,y1] → [x2,y2] with staggered draw delay
const LINES: Array<{
  x1: number; y1: number; x2: number; y2: number; delay: number;
}> = [
  { x1: 320, y1:  90, x2: 440, y2: 230, delay: 0.25 },
  { x1: 560, y1:  90, x2: 440, y2: 230, delay: 0.35 },
  { x1: 440, y1: 230, x2: 250, y2: 375, delay: 0.65 },
  { x1: 440, y1: 230, x2: 650, y2: 375, delay: 0.75 },
  { x1: 250, y1: 375, x2: 250, y2: 520, delay: 1.05 },
];

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function TreeNode({
  node,
  isSelected,
  onClick,
  drawn,
  isLate,
}: {
  node: (typeof NODES)[0];
  isSelected: boolean;
  onClick: () => void;
  drawn: boolean;
  isLate: boolean;
}) {
  const isYou = node.id === "6";

  return (
    <g
      className="cursor-pointer node-ring"
      onClick={onClick}
      style={{
        opacity: drawn ? 1 : 0,
        transition: `opacity 0.45s ease ${0.15 + (node.gen - 1) * 0.38}s`,
      }}
    >
      {/* Pulsing selected ring */}
      {isSelected && (
        <circle cx={node.x} cy={node.y} r={42} fill="none" stroke="#D4AF7A" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="40;46;40" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Photo background circle */}
      <circle cx={node.x} cy={node.y} r={36}
        fill={isLate ? "#9CA3AF" : "white"}
        stroke={isSelected ? "#D4AF7A" : isLate ? "#D1D5DB" : "#2D6A4F"}
        strokeWidth={isSelected ? 3 : 2} />

      {/* Avatar photo using clipPath */}
      <defs>
        <clipPath id={`clip-node-${node.id}`}>
          <circle cx={node.x} cy={node.y} r={34} />
        </clipPath>
      </defs>
      <image
        href={AVATAR_SVGS[node.id] ?? ""}
        x={node.x - 34} y={node.y - 34}
        width={68} height={68}
        clipPath={`url(#clip-node-${node.id})`}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Late member grey overlay */}
      {isLate && (
        <circle cx={node.x} cy={node.y} r={34} fill="rgba(100,100,100,0.35)"
          clipPath={`url(#clip-node-${node.id})`} />
      )}

      {/* Outer border ring */}
      <circle cx={node.x} cy={node.y} r={36} fill="none"
        stroke={isSelected ? "#D4AF7A" : isLate ? "#9CA3AF" : "#2D6A4F"}
        strokeWidth={isSelected ? 3 : 2} />

      {/* YOU badge */}
      {isYou && (
        <>
          <rect x={node.x - 14} y={node.y + 26} width="28" height="13" rx="6.5" fill="#D4AF7A" />
          <text x={node.x} y={node.y + 36} textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter, sans-serif">YOU</text>
        </>
      )}

      {/* Name */}
      <text
        x={node.x} y={node.y + (isYou ? 58 : 50)}
        textAnchor="middle"
        fill="#0D2B1E"
        fontSize="11"
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        {node.label.split(" ").slice(0, 2).join(" ")}
      </text>
      <text
        x={node.x} y={node.y + (isYou ? 70 : 62)}
        textAnchor="middle"
        fill="#6B7280"
        fontSize="9"
        fontFamily="Inter, sans-serif"
      >
        {node.sub.split("·")[1]?.trim() ?? ""}
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

  const selectedMember = FAMILY_MEMBERS.find((m) => m.id === selected);

  return (
    <SidebarLayout title="Vamsha Vruksha — Family Tree">
      <div className="flex gap-6" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* ── Tree Canvas ─────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  placeholder="Search family members…"
                  className="input-premium pl-9 py-2 text-sm w-56"
                />
              </div>
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{ background: "#F0E6D3", border: "1px solid #E8D5BC" }}
              >
                {["Patriarchal", "Matriarchal"].map((v, i) => (
                  <button
                    key={v}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={
                      i === 0
                        ? {
                            background:
                              "linear-gradient(135deg, #1B4332, #2D6A4F)",
                            color: "white",
                          }
                        : { color: "#6B7280" }
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                boxShadow: "0 2px 12px rgba(27,67,50,0.3)",
              }}
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {/* SVG Canvas */}
          <div
            className="flex-1 rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(160deg, #FAF7F2 0%, #F0E6D3 100%)",
              border: "1px solid #E8D5BC",
              minHeight: "580px",
            }}
          >
            {/* Generation labels (left rail) */}
            <div className="absolute left-3 top-0 bottom-0 flex flex-col pointer-events-none py-20 justify-around">
              {["Gen I", "Gen II", "Gen III", "Gen IV"].map((g) => (
                <span
                  key={g}
                  className="text-xs font-semibold"
                  style={{
                    color: "#C49A6C",
                    letterSpacing: "0.08em",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <svg
              viewBox="0 60 900 540"
              className="w-full h-full"
              style={{ minHeight: "560px" }}
            >
              {/* Dashed generation guide lines */}
              {[90, 230, 375, 520].map((y) => (
                <line
                  key={y}
                  x1="60" y1={y} x2="840" y2={y}
                  stroke="#1B4332"
                  strokeWidth="0.5"
                  strokeDasharray="4,10"
                  opacity="0.12"
                />
              ))}

              {/* Spouse connector (dashed gold) */}
              <line
                x1="354" y1="90" x2="526" y2="90"
                stroke="#D4AF7A"
                strokeWidth="1.5"
                strokeDasharray="5,4"
                opacity={drawn ? 0.65 : 0}
                style={{ transition: "opacity 0.4s 0.1s" }}
              />
              {/* Small heart in the middle of spouse line */}
              <text
                x="440" y="86"
                textAnchor="middle"
                fontSize="9"
                opacity={drawn ? 0.8 : 0}
                style={{ transition: "opacity 0.4s 0.15s" }}
              >
                ♥
              </text>

              {/* Animated connecting lines */}
              {LINES.map(({ x1, y1, x2, y2, delay }, i) => {
                const length = dist(x1, y1, x2, y2);
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#A67C52"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray={length}
                    strokeDashoffset={drawn ? 0 : length}
                    style={{
                      transition: `stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
                    }}
                    opacity="0.65"
                  />
                );
              })}

              {/* Branch junction dots */}
              {drawn && (
                <>
                  <circle cx="440" cy="230" r="4" fill="#A67C52" opacity="0.5" />
                  <circle cx="250" cy="375" r="4" fill="#A67C52" opacity="0.5" />
                </>
              )}

              {/* Nodes */}
              {NODES.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isSelected={selected === node.id}
                  isLate={FAMILY_MEMBERS.find(m => m.id === node.id)?.status === "Late"}
                  onClick={() =>
                    setSelected(selected === node.id ? null : node.id)
                  }
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
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid #E8D5BC",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Click hint */}
            {!selected && drawn && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: "rgba(27,67,50,0.07)",
                  color: "#2D6A4F",
                  border: "1px solid rgba(27,67,50,0.12)",
                }}
              >
                👆 Click any node to explore
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Detail Panel ────────────────────────────── */}
        <AnimatePresence>
          {selected && selectedMember && (
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.97 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-80 shrink-0"
            >
              <div
                className="rounded-3xl overflow-hidden sticky top-4"
                style={{
                  background: "white",
                  border: "1px solid #E8D5BC",
                  boxShadow: "0 8px 48px rgba(27,67,50,0.13)",
                }}
              >
                {/* Panel header */}
                <div
                  className="relative p-6 text-white"
                  style={{
                    background:
                      "linear-gradient(160deg, #0D2B1E 0%, #1B4332 100%)",
                  }}
                >
                  {/* Close */}
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <X size={15} />
                  </button>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 mx-auto mb-3" style={{borderColor: "#D4AF7A"}}>
                      <img
                        src={AVATAR_SVGS[selected] ?? ""}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                        style={selectedMember.status === "Late" ? { filter: "grayscale(40%)" } : {}}
                      />
                    </div>

                    {selectedMember.status === "Active" ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mb-2 font-medium"
                        style={{
                          backgroundColor: "rgba(82,183,136,0.2)",
                          color: "#95D5B2",
                        }}
                      >
                        ✓ Active Member
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mb-2 font-medium"
                        style={{
                          backgroundColor: "rgba(156,163,175,0.2)",
                          color: "#9CA3AF",
                        }}
                      >
                        In Memoriam
                      </span>
                    )}

                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedMember.status === "Late" ? "Late " : ""}
                      {selectedMember.name}
                    </h3>
                    <p className="text-green-300 text-sm mt-0.5">
                      {selectedMember.relation}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Key facts */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Gotra",  value: selectedMember.gotra },
                      { label: "Native", value: selectedMember.native.split(",")[0] },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl p-3 text-center"
                        style={{ background: "#F9F5F0" }}
                      >
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "#1B4332" }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Life archive */}
                  {LIFE_ARCHIVES[selected] && (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "#F0FBF4",
                        border: "1px solid #B7E4C7",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star
                          size={12}
                          style={{ color: "#A67C52" }}
                          fill="#A67C52"
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#1B4332" }}
                        >
                          Life Archive
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        &ldquo;
                        {LIFE_ARCHIVES[selected].slice(0, 120)}
                        &hellip;&rdquo;
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/profile/${selected}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332, #2D6A4F)",
                    }}
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
