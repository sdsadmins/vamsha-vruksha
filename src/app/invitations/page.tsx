"use client";
import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Users, Route, Navigation, Share2,
  CheckCircle, Plus, ChevronDown, ChevronUp, Info
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { INVITATION_FAMILIES } from "@/lib/data";

// Leaflet must be client-only (no SSR)
const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{ background: "#F0FBF4", border: "1px solid #B7E4C7" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
          style={{ borderColor: "#1B4332", borderTopColor: "transparent" }} />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    </div>
  ),
});

// Nearest-neighbour route optimizer starting from first selected
function optimizeRoute(families: typeof INVITATION_FAMILIES, selected: string[]): string[] {
  if (selected.length <= 2) return selected;
  const fams = families.filter(f => selected.includes(f.id));
  const remaining = [...fams];
  const route: typeof fams = [];

  // Start with first selected (user's own home)
  const first = remaining.splice(remaining.findIndex(f => f.id === selected[0]), 1)[0];
  route.push(first);

  while (remaining.length > 0) {
    const last = route[route.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((f, i) => {
      const d = Math.sqrt((f.lat - last.lat) ** 2 + (f.lng - last.lng) ** 2);
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    });
    route.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return route.map(f => f.id);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function InvitationsPage() {
  const [selected, setSelected] = useState<string[]>(["if7", "if8", "if1"]);
  const [optimized, setOptimized] = useState(false);
  const [routeOrder, setRouteOrder] = useState<string[]>(["if7", "if8", "if1"]);
  const [expandedStop, setExpandedStop] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const toggle = useCallback((id: string) => {
    setOptimized(false);
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setRouteOrder(next);
      return next;
    });
  }, []);

  const handleOptimize = () => {
    const order = optimizeRoute(INVITATION_FAMILIES, selected);
    setRouteOrder(order);
    setOptimized(true);
  };

  const orderedFamilies = useMemo(
    () => routeOrder.map(id => INVITATION_FAMILIES.find(f => f.id === id)!).filter(Boolean),
    [routeOrder]
  );

  const { totalKm, totalMin } = useMemo(() => {
    let km = 0;
    for (let i = 1; i < orderedFamilies.length; i++) {
      km += haversineKm(
        orderedFamilies[i - 1].lat, orderedFamilies[i - 1].lng,
        orderedFamilies[i].lat, orderedFamilies[i].lng
      );
    }
    const visitMin = orderedFamilies.reduce((s, f) => s + (f.estimatedVisit === "—" ? 0 : parseInt(f.estimatedVisit)), 0);
    const driveMin = Math.round(km * 3.5); // ~3.5 min per km in city
    return { totalKm: km.toFixed(1), totalMin: visitMin + driveMin };
  }, [orderedFamilies]);

  const mapFamilies = orderedFamilies.map((f, i) => ({ ...f, stopNumber: i + 1 }));

  // Estimated arrival times starting 9:00 AM
  const arrivals = useMemo(() => {
    const times: string[] = [];
    let minsSince = 0;
    orderedFamilies.forEach((f, i) => {
      if (i > 0) {
        const prev = orderedFamilies[i - 1];
        const driveMin = Math.round(haversineKm(prev.lat, prev.lng, f.lat, f.lng) * 3.5);
        const visitMin = prev.estimatedVisit === "—" ? 0 : parseInt(prev.estimatedVisit);
        minsSince += driveMin + visitMin;
      }
      const totalMinutes = 9 * 60 + minsSince;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      times.push(`${h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${ampm}`);
    });
    return times;
  }, [orderedFamilies]);

  return (
    <SidebarLayout title="Smart Invitation Planner">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Smart Invitation Route Planner
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Select families · optimise route · navigate stop-by-stop
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50"
            style={{ borderColor: "#E8D5BC", color: "#374151" }}>
            <Share2 size={15} /> Share Itinerary
          </button>
          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.25)" }}>
            <Navigation size={15} /> Start Navigation
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* ── LEFT: Family selector ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Route summary card */}
          <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
            <p className="text-green-400 text-xs font-semibold tracking-widest mb-3">ROUTE SUMMARY</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Users,    label: "Families",     val: selected.length.toString() },
                { icon: Route,    label: "Distance",     val: `${totalKm} km` },
                { icon: Clock,    label: "Est. Time",    val: `${Math.floor(Number(totalMin) / 60)}h ${Number(totalMin) % 60}m` },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <Icon size={14} className="mx-auto mb-1 text-green-400" />
                  <p className="text-white font-bold text-base">{val}</p>
                  <p className="text-green-300 text-xs">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleOptimize}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={optimized
                ? { background: "rgba(255,255,255,0.1)", color: "#86EFAC" }
                : { background: "linear-gradient(135deg, #A67C52, #D4AF7A)", color: "white" }
              }>
              <Route size={14} /> {optimized ? "✓ Route Optimised" : "Plan Optimised Route"}
            </button>
          </div>

          {/* Family list */}
          <div className="rounded-2xl border overflow-hidden flex-1" style={{ background: "white", borderColor: "#E8D5BC" }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#F3F4F6" }}>
              <h3 className="font-bold text-sm" style={{ color: "#0D2B1E" }}>
                Select Invitees ({selected.length} selected)
              </h3>
              <button className="text-xs font-semibold flex items-center gap-1" style={{ color: "#1B4332" }}>
                <Plus size={12} /> Add Family
              </button>
            </div>
            <div className="divide-y overflow-y-auto" style={{ borderColor: "#F9F9F9", maxHeight: "460px" }}>
              {INVITATION_FAMILIES.map(fam => {
                const isSelected = selected.includes(fam.id);
                const stopIdx = routeOrder.indexOf(fam.id);
                return (
                  <div
                    key={fam.id}
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggle(fam.id)}
                    style={isSelected ? { background: "#F0FBF4" } : {}}
                  >
                    {/* Stop number or empty circle */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={isSelected
                        ? { background: "linear-gradient(135deg,#1B4332,#2D6A4F)", color: "white" }
                        : { background: "#F3F4F6", color: "#9CA3AF" }
                      }>
                      {isSelected ? stopIdx + 1 : ""}
                    </div>
                    {/* Photo */}
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 shrink-0"
                      style={{ borderColor: isSelected ? "#1B4332" : "#E8D5BC" }}>
                      <img src={fam.photo} alt={fam.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "#0D2B1E" }}>{fam.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={10} /> {fam.area} · {fam.estimatedVisit !== "—" ? fam.estimatedVisit : "Start"}
                      </p>
                    </div>
                    {/* Toggle */}
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={isSelected
                        ? { background: "#1B4332" }
                        : { border: "2px solid #D1D5DB" }
                      }>
                      {isSelected && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Map + Itinerary ── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden" style={{ height: "420px", border: "1px solid #E8D5BC" }}>
            <RouteMap
              families={mapFamilies}
              selected={routeOrder}
              center={[12.972, 77.594]}
              zoom={12}
            />
          </div>

          {/* Journey itinerary */}
          {orderedFamilies.length > 0 && (
            <div className="rounded-2xl border overflow-hidden" style={{ background: "white", borderColor: "#E8D5BC" }}>
              <div className="p-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                <h3 className="font-bold flex items-center gap-2" style={{ color: "#0D2B1E" }}>
                  <Route size={16} style={{ color: "#1B4332" }} /> Journey Itinerary
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: "#F9F9F9" }}>
                {orderedFamilies.map((fam, idx) => {
                  const isLast = idx === orderedFamilies.length - 1;
                  const isFirst = idx === 0;
                  const isExpanded = expandedStop === fam.id;
                  return (
                    <div key={fam.id}>
                      <div
                        className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedStop(isExpanded ? null : fam.id)}
                      >
                        {/* Timeline */}
                        <div className="flex flex-col items-center shrink-0" style={{ paddingTop: "2px" }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: isFirst ? "linear-gradient(135deg,#A67C52,#D4AF7A)" : "linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                            {idx + 1}
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ background: "#E8D5BC", minHeight: "20px" }} />}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 shrink-0"
                              style={{ borderColor: "#E8D5BC" }}>
                              <img src={fam.photo} alt={fam.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate" style={{ color: "#0D2B1E" }}>{fam.name}</p>
                              <p className="text-xs text-gray-400">{fam.area} · {arrivals[idx]}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {fam.estimatedVisit !== "—" && (
                                <span className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ background: "#D1FAE5", color: "#065F46" }}>
                                  {fam.estimatedVisit}
                                </span>
                              )}
                              {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-16 pb-4 space-y-2">
                              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                                <MapPin size={11} className="shrink-0 mt-0.5" style={{ color: "#A67C52" }} />
                                {fam.address}
                              </p>
                              {fam.note && (
                                <p className="text-xs rounded-lg p-2.5 flex items-start gap-1.5"
                                  style={{ background: "#FEF3C7", color: "#92400E" }}>
                                  <Info size={11} className="shrink-0 mt-0.5" />
                                  {fam.note}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation started modal */}
      <AnimatePresence>
        {started && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setStarted(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl p-8 text-center max-w-sm w-full"
              style={{ background: "white" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#D1FAE5" }}>
                <Navigation size={28} style={{ color: "#1B4332" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Navigation Started!
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Your first stop is{" "}
                <span className="font-bold" style={{ color: "#1B4332" }}>
                  {orderedFamilies[0]?.name}
                </span>{" "}
                at {arrivals[0]}.
              </p>
              <p className="text-xs text-gray-400 mb-6">{orderedFamilies[0]?.address}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl p-3 text-center" style={{ background: "#F0FBF4" }}>
                  <p className="text-lg font-bold" style={{ color: "#1B4332" }}>{selected.length}</p>
                  <p className="text-xs text-gray-500">Stops</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#F0FBF4" }}>
                  <p className="text-lg font-bold" style={{ color: "#1B4332" }}>{totalKm} km</p>
                  <p className="text-xs text-gray-500">Total Route</p>
                </div>
              </div>
              <button onClick={() => setStarted(false)}
                className="w-full py-3 text-white rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                Begin Route ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
