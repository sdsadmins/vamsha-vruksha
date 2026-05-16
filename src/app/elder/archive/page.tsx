"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, BookOpen, Image, Mic, Download } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";

const ARCHIVES = [
  { id: "a1", title: "Samaj Bhavan Inauguration — 1974", type: "Photo Album", icon: Image, count: "48 photos", tag: "Heritage" },
  { id: "a2", title: "Annual Report 2024–25", type: "Document", icon: FileText, count: "PDF, 24 pages", tag: "Admin" },
  { id: "a3", title: "Oral History — Ramachandra Shet (Kundapura, 1962)", type: "Audio", icon: Mic, count: "38 min recording", tag: "Oral History" },
  { id: "a4", title: "Genealogy Register Vol. I (1880–1950)", type: "Document", icon: BookOpen, count: "Scanned, 312 pages", tag: "Lineage" },
  { id: "a5", title: "Samaj Utsava 2022 — Photo Gallery", type: "Photo Album", icon: Image, count: "214 photos", tag: "Cultural" },
  { id: "a6", title: "Scholarship Recipients 2010–2024", type: "Document", icon: FileText, count: "Excel + PDF", tag: "Education" },
  { id: "a7", title: "Oral History — Savitribai Shet (Kundapura, 1975)", type: "Audio", icon: Mic, count: "22 min recording", tag: "Oral History" },
  { id: "a8", title: "Genealogy Register Vol. II (1950–2000)", type: "Document", icon: BookOpen, count: "Scanned, 480 pages", tag: "Lineage" },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Heritage:     { bg: "#F3E8E8", text: "#A67C52" },
  Admin:        { bg: "#EDE9FE", text: "#5B21B6" },
  "Oral History": { bg: "#FEF3C7", text: "#D97706" },
  Lineage:      { bg: "#D1FAE5", text: "#065F46" },
  Cultural:     { bg: "#DBEAFE", text: "#1E40AF" },
  Education:    { bg: "#D1FAE5", text: "#065F46" },
};

export default function ArchivePage() {
  return (
    <SidebarLayout title="Digital Archive" requiredRole="elder">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Digital Archive
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Historical records, photos, and oral histories of Daivadnya Samaj</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: "#D4AF7A", color: "#A67C52" }}>
          <Download size={15} /> Export All
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARCHIVES.map((a, i) => {
          const col = TAG_COLORS[a.tag] ?? { bg: "#F3F4F6", text: "#374151" };
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl border p-5 hover:shadow-md transition-shadow cursor-pointer"
              style={{ background: "white", borderColor: "#E8D5BC" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: col.bg }}>
                <Icon size={22} style={{ color: col.text }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold mb-2 inline-block"
                style={{ background: col.bg, color: col.text }}>{a.tag}</span>
              <h3 className="font-bold text-sm mb-1" style={{ color: "#0D2B1E" }}>{a.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{a.type} · {a.count}</p>
              <button className="text-xs font-semibold flex items-center gap-1 hover:underline"
                style={{ color: "#1B4332" }}>
                <Download size={11} /> Download
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-400 text-center">
        <Link href="/elder" className="font-semibold hover:underline" style={{ color: "#1B4332" }}>← Back to Overview</Link>
      </div>
    </SidebarLayout>
  );
}
