"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, PlusCircle, Users } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";

const EVENTS = [
  { id: "e1", title: "Annual Samaja Utsava 2025", date: "15 August 2025", time: "9:00 AM", venue: "Daivadnya Samaj Bhavan, Basavanagudi, Bengaluru", type: "Cultural", attendees: 420, status: "Upcoming" },
  { id: "e2", title: "Elder Sub-Committee Meeting — Q2", date: "28 June 2025", time: "5:00 PM", venue: "Committee Room, Samaj Bhavan", type: "Admin", attendees: 12, status: "Upcoming" },
  { id: "e3", title: "Vidya Nidhi Scholarship Ceremony", date: "10 July 2025", time: "10:30 AM", venue: "SDM College Auditorium, Mangaluru", type: "Education", attendees: 180, status: "Upcoming" },
  { id: "e4", title: "Daivadnya Youth Convention 2025", date: "22 July 2025", time: "11:00 AM", venue: "VR Mall Convention, Bengaluru", type: "Youth", attendees: 250, status: "Planning" },
  { id: "e5", title: "Samaj Bhavan Renovation — Bhumi Puja", date: "1 June 2025", time: "8:00 AM", venue: "Samaj Bhavan, Basavanagudi", type: "Heritage", attendees: 80, status: "Completed" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Cultural:  { bg: "#D1FAE5", text: "#065F46" },
  Admin:     { bg: "#EDE9FE", text: "#5B21B6" },
  Education: { bg: "#DBEAFE", text: "#1E40AF" },
  Youth:     { bg: "#FEF3C7", text: "#D97706" },
  Heritage:  { bg: "#F3E8E8", text: "#A67C52" },
};

export default function EventsPage() {
  return (
    <SidebarLayout title="Manage Events" requiredRole="elder">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Community Events
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage Daivadnya Samaj events across all branches</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
          <PlusCircle size={16} /> Add Event
        </button>
      </div>

      <div className="space-y-4">
        {EVENTS.map((e, i) => {
          const col = TYPE_COLORS[e.type] ?? { bg: "#F3F4F6", text: "#374151" };
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-5 flex gap-5 items-start"
              style={{ background: "white", borderColor: "#E8D5BC" }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: col.bg }}>
                <Calendar size={24} style={{ color: col.text }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-base" style={{ color: "#0D2B1E" }}>{e.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: col.bg, color: col.text }}>{e.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={e.status === "Completed"
                      ? { background: "#F3F4F6", color: "#6B7280" }
                      : e.status === "Planning"
                      ? { background: "#FEF3C7", color: "#D97706" }
                      : { background: "#D1FAE5", color: "#065F46" }
                    }>{e.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {e.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {e.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {e.venue}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {e.attendees} expected</span>
                </div>
              </div>
              <button className="shrink-0 text-xs px-3 py-1.5 rounded-lg border font-semibold hover:bg-gray-50"
                style={{ borderColor: "#E8D5BC", color: "#1B4332" }}>
                Manage →
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
