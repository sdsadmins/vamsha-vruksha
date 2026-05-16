"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, GitMerge, AlertTriangle, CheckCircle, Clock,
  FileText, MessageSquare, ThumbsUp, Shield, Send, MoreHorizontal
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { CONFLICT_CASES } from "@/lib/data";

export default function ConflictDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const conflict = CONFLICT_CASES.find(c => c.id === id) ?? CONFLICT_CASES[0];

  const [note, setNote] = useState("");
  const [resolved, setResolved] = useState<null | "A" | "B" | "merge">(null);
  const [moreEvidence, setMoreEvidence] = useState(false);

  if (resolved) return (
    <SidebarLayout title="Conflict Resolution" requiredRole="elder">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #D1FAE5, #B7E4C7)" }}>
          <CheckCircle size={44} style={{ color: "#1B4332" }} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Conflict Resolved
          </h2>
          <p className="text-gray-500 max-w-sm">
            {resolved === "merge"
              ? `The records for ${conflict.subject} have been submitted for merge review.`
              : `${resolved === "A" ? conflict.versionA.label : conflict.versionB.label} has been accepted as the canonical record for ${conflict.subject}.`}
          </p>
          <p className="text-xs text-gray-400 mt-2">All contributors have been notified. This case is now archived.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/elder/verifications")}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            Back to Verifications
          </button>
          <button onClick={() => router.push("/elder")}
            className="px-6 py-3 rounded-xl font-semibold border"
            style={{ borderColor: "#DFC5A0", color: "#1B4332" }}>
            Elder Dashboard
          </button>
        </div>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout title="Conflict Resolution" requiredRole="elder">
      {/* Back */}
      <div className="mb-6">
        <Link href="/elder/verifications" className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "#1B4332" }}>
          <ArrowLeft size={15} /> Back to Verifications
        </Link>
      </div>

      {/* Subject header */}
      <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: "#DFC5A0" }}>
        <div className="flex items-center gap-5 p-5 bg-white">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0"
            style={{ borderColor: "#C4823A" }}>
            <img src={conflict.photo} alt={conflict.subject} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: conflict.type === "Duplicate" ? "#FEF3C7" : "#FEE2E2",
                  color: conflict.type === "Duplicate" ? "#92400E" : "#991B1B" }}>
                <AlertTriangle size={11} /> {conflict.conflictTitle}
              </span>
              <span className="text-xs text-gray-400">Case #{conflict.id.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              {conflict.subject}
            </h2>
            <p className="text-sm text-gray-500">{conflict.born} – {conflict.died}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Clock size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400">Opened 4 days ago</span>
          </div>
        </div>
        <div className="px-5 py-3 border-t" style={{ background: "#FFF7ED", borderColor: "#DFC5A0" }}>
          <p className="text-sm text-amber-800">{conflict.conflictDesc}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Version A */}
        <VersionCard
          version={conflict.versionA}
          letter="A"
          color={conflict.versionA.backed ? "#1B4332" : "#6B7280"}
          onAccept={() => setResolved("A")}
        />

        {/* VS divider */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-3 py-4">
          <div className="w-px h-full lg:h-px lg:w-full bg-gray-200 hidden lg:block" />
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white z-10 shrink-0"
            style={{ borderColor: "#DFC5A0" }}>
            <span className="text-xs font-bold text-gray-400">VS</span>
          </div>
          <div className="w-px h-full lg:h-px lg:w-full bg-gray-200 hidden lg:block" />
        </div>

        {/* Version B */}
        <VersionCard
          version={conflict.versionB}
          letter="B"
          color="#6B7280"
          onAccept={() => setResolved("B")}
        />
      </div>

      {/* Discussion */}
      <div className="rounded-2xl border p-5 mb-6" style={{ background: "white", borderColor: "#DFC5A0" }}>
        <h3 className="font-bold mb-4 flex items-center gap-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
          <MessageSquare size={16} style={{ color: "#8B5E3C" }} /> Elder Discussion Thread
        </h3>

        <div className="space-y-4 mb-5">
          {conflict.discussion.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2"
                style={{ borderColor: "#C4823A" }}>
                <img src={d.photo} alt={d.author} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: "#0D2B1E" }}>{d.author}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#D1FAE5", color: "#065F46" }}>{d.role}</span>
                  <span className="text-xs text-gray-400 ml-auto">{d.time}</span>
                </div>
                <div className="rounded-xl px-4 py-3 text-sm text-gray-700"
                  style={{ background: "#F7F0E8", border: "1px solid #DFC5A0" }}>
                  {d.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add note */}
        <div className="flex gap-3 items-end">
          <textarea
            rows={2}
            placeholder="Add your committee note or observation…"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="flex-1 px-4 py-3 text-sm border rounded-xl outline-none resize-none"
            style={{ borderColor: "#DFC5A0" }}
          />
          <button
            disabled={!note.trim()}
            className="px-4 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
            onClick={() => setNote("")}>
            <Send size={15} /> Post
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setResolved("merge")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all hover:bg-gray-50"
            style={{ borderColor: "#DFC5A0", color: "#374151" }}>
            <GitMerge size={15} /> Merge Records into New Version
          </button>
          <button
            onClick={() => setMoreEvidence(!moreEvidence)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all"
            style={moreEvidence
              ? { borderColor: "#8B5E3C", background: "#FFF7ED", color: "#92400E" }
              : { borderColor: "#DFC5A0", color: "#374151" }}>
            <FileText size={15} /> {moreEvidence ? "Evidence Request Sent ✓" : "Request More Evidence"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Shield size={12} /> Only verified Elders can resolve conflicts
        </div>
      </div>

      <AnimatePresence>
        {moreEvidence && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{ background: "#FEF3C7", border: "1px solid #FCD34D", color: "#92400E" }}>
            <AlertTriangle size={14} />
            Both contributors have been notified to submit additional supporting documents within 7 days.
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}

function VersionCard({
  version, letter, color, onAccept
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  version: any; letter: string; color: string; onAccept: () => void;
}) {
  return (
    <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
      style={{ background: "white", borderColor: version.backed ? "#1B4332" : "#DFC5A0" }}>
      {version.backed && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs font-bold"
          style={{ background: "#D1FAE5", color: "#065F46" }}>
          <ThumbsUp size={11} /> Most-backed version · {version.votes} vouches
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
            {letter}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#0D2B1E" }}>{version.label}</p>
            {!version.backed && (
              <p className="text-xs text-gray-400">{version.votes} vouche{version.votes !== 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-2 mb-4">
          {version.fields.map((f: { label: string; value: string }) => (
            <div key={f.label} className="flex justify-between text-sm py-1.5 border-b"
              style={{ borderColor: "#F3F4F6" }}>
              <span className="text-gray-500">{f.label}</span>
              <span className="font-semibold text-right ml-3" style={{ color: "#0D2B1E" }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">EVIDENCE</p>
          <div className="space-y-1.5">
            {version.evidence.map((e: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600 px-3 py-2 rounded-lg"
                style={{ background: "#F7F0E8" }}>
                <FileText size={11} className="mt-0.5 shrink-0 text-amber-600" />
                {e}
              </div>
            ))}
          </div>
        </div>

        {/* Submitted by */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
          style={{ background: "#F7F0E8", border: "1px solid #DFC5A0" }}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img src={version.submittedPhoto} alt={version.submittedBy} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "#0D2B1E" }}>{version.submittedBy}</p>
            <p className="text-xs text-gray-400">Submitted this version</p>
          </div>
          <MoreHorizontal size={15} className="ml-auto text-gray-300" />
        </div>

        <button onClick={onAccept}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          style={version.backed
            ? { background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "white", boxShadow: "0 4px 16px rgba(27,67,50,0.25)" }
            : { border: "2px solid #DFC5A0", color: "#374151" }
          }>
          <CheckCircle size={15} /> Accept Version {letter}
        </button>
      </div>
    </div>
  );
}
