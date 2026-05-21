"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, Plus, Search, Star, MapPin, Briefcase,
  Calendar, Users, Camera, ChevronDown, Trash2, UserPlus
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { FAMILY_MEMBERS } from "@/lib/data";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

type Member = (typeof FAMILY_MEMBERS)[0];

interface DbMember {
  _id: string; name: string; gender: string; dob?: string;
  dod?: string; gotra: string; native: string; occupation: string;
  phone: string; photoUrl: string; generation: number;
  branch: string; notes: string; parentId?: string;
}

const GOTRAS   = ["Kashyap","Bharadwaja","Vasishtha","Atreya","Kaundinya","Vishwamitra","Gautama"];
const BRANCHES = ["Bengaluru","Kundapura","Kumta","Mangaluru","Udupi","Out-of-State"];

const LIFE_ARCHIVES: Record<string, string> = {
  "1": "Ramachandra Shet was the patriarch of our Kundapura branch — a master goldsmith who established the family jewellery tradition in 1942.",
  "2": "Savitribai Shet was the matriarch renowned for devotion to Samaj seva and Sanskrit shlokas.",
  "3": "Venkatesh Kamat migrated from Kumta to Bengaluru in 1975 to expand the jewellery trade to Commercial Street.",
  "4": "Suresh Kamat is the first in the family to enter software engineering — bridging the goldsmith legacy with the Bengaluru IT boom.",
  "5": "Rekha Pai is a distinguished educator who established the Daivajna Samaja scholarship fund in 2008.",
  "6": "Priya Kamat represents the new generation — digitising 500+ family photos and building this platform.",
};

const NODES = [
  { id:"1", x:300, y:110, label:"Ramachandra Shet",  sub:"Patriarch · Kashyap",      gen:1 },
  { id:"2", x:570, y:110, label:"Savitribai Shet",   sub:"Matriarch · Kashyap",      gen:1 },
  { id:"3", x:435, y:265, label:"Venkatesh Kamat",   sub:"Grandfather · Bharadwaja", gen:2 },
  { id:"4", x:240, y:415, label:"Suresh Kamat",      sub:"Father · Kashyap",         gen:3 },
  { id:"5", x:660, y:415, label:"Rekha Pai",         sub:"Aunt · Bharadwaja",        gen:3 },
  { id:"6", x:240, y:560, label:"Priya Kamat",       sub:"You · Kashyap",            gen:4 },
];

const LINES = [
  { x1:300,y1:110,x2:435,y2:265,delay:0.25 },
  { x1:570,y1:110,x2:435,y2:265,delay:0.35 },
  { x1:435,y1:265,x2:240,y2:415,delay:0.65 },
  { x1:435,y1:265,x2:660,y2:415,delay:0.75 },
  { x1:240,y1:415,x2:240,y2:560,delay:1.05 },
];

function dist(x1:number,y1:number,x2:number,y2:number){ return Math.sqrt((x2-x1)**2+(y2-y1)**2); }
const R = 46;

function TreeNode({ node,isSelected,onClick,drawn,isLate }:{
  node:(typeof NODES)[0]; isSelected:boolean; onClick:()=>void; drawn:boolean; isLate:boolean;
}) {
  const isYou = node.id === "6";
  const photoSize = R*2-6; const half = photoSize/2;
  return (
    <g className="cursor-pointer" onClick={onClick}
      style={{ opacity: drawn?1:0, transition:`opacity 0.45s ease ${0.15+(node.gen-1)*0.38}s` }}>
      {isSelected && (
        <circle cx={node.x} cy={node.y} r={R+8} fill="none" stroke="#C4823A" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values={`${R+6};${R+12};${R+6}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={node.x} cy={node.y} r={R} fill="white"
        stroke={isSelected?"#C4823A":isLate?"#D1D5DB":"#2D6A4F"} strokeWidth={isSelected?3:2.5} />
      <defs>
        <clipPath id={`clip-${node.id}`}><circle cx={node.x} cy={node.y} r={R-3} /></clipPath>
      </defs>
      <foreignObject x={node.x-half} y={node.y-half} width={photoSize} height={photoSize} clipPath={`url(#clip-${node.id})`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AVATAR_SVGS[node.id]??""} alt={node.label} width={photoSize} height={photoSize}
          style={{ objectFit:"cover", display:"block", filter:isLate?"grayscale(55%)":"none" }} />
      </foreignObject>
      <circle cx={node.x} cy={node.y} r={R} fill="none"
        stroke={isSelected?"#C4823A":isLate?"#9CA3AF":"#2D6A4F"} strokeWidth={isSelected?3:2.5} />
      {isYou && (
        <>
          <rect x={node.x-16} y={node.y+R-2} width="32" height="14" rx="7" fill="#C4823A" />
          <text x={node.x} y={node.y+R+9} textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter, sans-serif">YOU</text>
        </>
      )}
      <text x={node.x} y={node.y+R+(isYou?22:14)} textAnchor="middle" fill="#0D2B1E" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
        {node.label.split(" ").slice(0,2).join(" ")}
      </text>
      <text x={node.x} y={node.y+R+(isYou?35:27)} textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="Inter, sans-serif">
        {node.sub.split("·")[0].trim()}
      </text>
    </g>
  );
}

const BLANK_FORM = { name:"", gender:"M", dob:"", dod:"", gotra:"Kashyap", native:"",
  occupation:"", phone:"", generation:1, branch:"Bengaluru", notes:"", parentId:"" };

export default function FamilyTreePage() {
  const [selected, setSelected]     = useState<string|null>(null);
  const [drawn, setDrawn]           = useState(false);
  const [showAdd, setShowAdd]       = useState(false);
  const [dbMembers, setDbMembers]   = useState<DbMember[]>([]);
  const [form, setForm]             = useState({ ...BLANK_FORM });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoBase64, setPhotoBase64]   = useState<string>("");
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [search, setSearch]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const t=setTimeout(()=>setDrawn(true),220); return ()=>clearTimeout(t); }, []);

  const fetchDbMembers = async () => {
    try {
      const res = await fetch("/api/family");
      if (res.ok) setDbMembers(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchDbMembers(); }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { setSaveError("Photo must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setPhotoPreview(b64);
      setPhotoBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError("Name is required"); return; }
    setSaving(true); setSaveError("");
    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoUrl: photoBase64 }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error || "Save failed"); setSaving(false); return; }
      setShowAdd(false);
      setForm({ ...BLANK_FORM });
      setPhotoPreview(""); setPhotoBase64("");
      fetchDbMembers();
    } catch { setSaveError("Network error"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    await fetch(`/api/family/${id}`, { method:"DELETE" });
    setDbMembers(prev => prev.filter(m => m._id !== id));
  };

  const selectedMember: Member|undefined = FAMILY_MEMBERS.find(m=>m.id===selected);
  const parentMember = selectedMember?.parent ? FAMILY_MEMBERS.find(m=>m.id===selectedMember.parent) : null;
  const childrenMembers = selectedMember ? FAMILY_MEMBERS.filter(m=>m.parent===selectedMember.id) : [];

  const filteredDb = dbMembers.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.gotra||"").toLowerCase().includes(search.toLowerCase()) ||
    (m.branch||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout title="Daivajna Samaja — Family Tree">
      <div className="flex gap-6" style={{ minHeight:"calc(100vh - 120px)" }}>
        {/* Tree Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search family members…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border rounded-xl outline-none w-56"
                  style={{ borderColor:"#DFC5A0" }} />
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ background:"#F0E6D3", border:"1px solid #DFC5A0" }}>
                {["Patriarchal","Matriarchal"].map((v,i) => (
                  <button key={v} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={i===0 ? { background:"linear-gradient(135deg, #1B4332, #2D6A4F)", color:"white" } : { color:"#6B7280" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { setShowAdd(true); setSaveError(""); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 2px 12px rgba(27,67,50,0.3)" }}>
              <Plus size={16} /> Add Member
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background:"linear-gradient(160deg, #FAF7F2 0%, #F0E6D3 100%)", border:"1px solid #DFC5A0", minHeight:"620px" }}>
            <div className="absolute left-3 top-0 bottom-0 flex flex-col pointer-events-none py-16 justify-around">
              {["Gen I","Gen II","Gen III","Gen IV"].map(g => (
                <span key={g} className="text-xs font-semibold"
                  style={{ color:"#C49A6C", letterSpacing:"0.08em", writingMode:"vertical-rl", transform:"rotate(180deg)" }}>{g}</span>
              ))}
            </div>
            <svg viewBox="0 40 900 620" className="w-full h-full" style={{ minHeight:"600px" }}>
              {[110,265,415,560].map(y=>(
                <line key={y} x1="60" y1={y} x2="840" y2={y} stroke="#1B4332" strokeWidth="0.5" strokeDasharray="4,10" opacity="0.1" />
              ))}
              <line x1={300+R} y1="110" x2={570-R} y2="110" stroke="#C4823A" strokeWidth="1.5" strokeDasharray="5,4"
                opacity={drawn?0.65:0} style={{ transition:"opacity 0.4s 0.1s" }} />
              <text x="435" y="106" textAnchor="middle" fontSize="10" opacity={drawn?0.8:0} style={{ transition:"opacity 0.4s 0.15s" }}>♥</text>
              {LINES.map(({x1,y1,x2,y2,delay},i)=>{
                const length=dist(x1,y1,x2,y2);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={length} strokeDashoffset={drawn?0:length}
                  style={{ transition:`stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1) ${delay}s` }} opacity="0.6" />;
              })}
              {drawn && <><circle cx="435" cy="265" r="5" fill="#8B5E3C" opacity="0.45" /><circle cx="240" cy="415" r="5" fill="#8B5E3C" opacity="0.45" /></>}
              {NODES.map(node=>(
                <TreeNode key={node.id} node={node} isSelected={selected===node.id}
                  isLate={FAMILY_MEMBERS.find(m=>m.id===node.id)?.status==="Late"}
                  onClick={()=>setSelected(selected===node.id?null:node.id)} drawn={drawn} />
              ))}
            </svg>
            <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
              {[{color:"#8B5E3C",label:"Gen I–II"},{color:"#1B4332",label:"Gen III+"},{color:"#C4823A",label:"You"},{color:"#9CA3AF",label:"In Memoriam"}].map(l=>(
                <div key={l.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background:"rgba(255,255,255,0.92)", border:"1px solid #DFC5A0" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor:l.color }} />{l.label}
                </div>
              ))}
            </div>
            {!selected && drawn && (
              <motion.div initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.4 }}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background:"rgba(27,67,50,0.07)", color:"#2D6A4F", border:"1px solid rgba(27,67,50,0.12)" }}>
                👆 Click any node to explore
              </motion.div>
            )}
          </div>

          {/* DB Members Grid */}
          {filteredDb.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                  Family Members Added ({filteredDb.length})
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDb.map(m => (
                  <motion.div key={m._id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    className="rounded-2xl border overflow-hidden"
                    style={{ background:"white", borderColor:"#DFC5A0" }}>
                    <div className="relative h-32 overflow-hidden"
                      style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserPlus size={36} className="text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 40%, rgba(13,43,30,0.85) 100%)" }} />
                      <button onClick={() => handleDelete(m._id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-100 transition-colors"
                        style={{ background:"rgba(0,0,0,0.35)" }}>
                        <Trash2 size={13} className="text-white" />
                      </button>
                      <div className="absolute bottom-2 left-3">
                        <p className="text-white font-bold text-sm">{m.name}</p>
                        <p className="text-green-300 text-xs">{m.gotra} Gotra · Gen {m.generation}</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-1.5">
                      {m.occupation && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={11} style={{ color:"#8B5E3C" }} />
                          <p className="text-xs text-gray-600 truncate">{m.occupation}</p>
                        </div>
                      )}
                      {m.native && (
                        <div className="flex items-center gap-2">
                          <MapPin size={11} style={{ color:"#8B5E3C" }} />
                          <p className="text-xs text-gray-600 truncate">{m.native}</p>
                        </div>
                      )}
                      {m.dob && (
                        <div className="flex items-center gap-2">
                          <Calendar size={11} style={{ color:"#8B5E3C" }} />
                          <p className="text-xs text-gray-500">{m.dob}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"#F0FBF4", color:"#1B4332" }}>
                          {m.branch}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"#F7F0E8", color:"#8B5E3C" }}>
                          {m.gender === "M" ? "Male" : "Female"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {dbMembers.length === 0 && drawn && (
            <div className="mt-6 rounded-2xl border-2 border-dashed p-8 text-center"
              style={{ borderColor:"#DFC5A0" }}>
              <UserPlus size={32} className="mx-auto mb-2" style={{ color:"#C4823A" }} />
              <p className="font-semibold text-gray-600 mb-1">No members added yet</p>
              <p className="text-sm text-gray-400 mb-4">Start building your family tree by adding members</p>
              <button onClick={() => setShowAdd(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2"
                style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                <Plus size={15} /> Add First Member
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && selectedMember && (
            <motion.div key={selected}
              initial={{ opacity:0,x:40,scale:0.97 }} animate={{ opacity:1,x:0,scale:1 }}
              exit={{ opacity:0,x:40,scale:0.97 }} transition={{ duration:0.28, ease:"easeOut" }}
              className="w-96 shrink-0">
              <div className="rounded-3xl overflow-hidden sticky top-4"
                style={{ background:"white", border:"1px solid #DFC5A0", boxShadow:"0 8px 48px rgba(27,67,50,0.15)" }}>
                <div className="relative" style={{ height:"220px" }}>
                  <img src={AVATAR_SVGS[selected]??""} alt={selectedMember.name}
                    className="w-full h-full object-cover object-top"
                    style={selectedMember.status==="Late"?{filter:"grayscale(40%)"}:{}} />
                  <div className="absolute inset-0"
                    style={{ background:"linear-gradient(to bottom, transparent 30%, rgba(13,43,30,0.95) 100%)" }} />
                  <button onClick={()=>setSelected(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full" style={{ background:"rgba(0,0,0,0.35)" }}>
                    <X size={15} className="text-white" />
                  </button>
                  <div className="absolute top-3 left-3">
                    {selectedMember.status==="Active"
                      ? <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:"rgba(209,250,229,0.9)", color:"#065F46" }}>✓ Active Member</span>
                      : <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:"rgba(156,163,175,0.85)", color:"#fff" }}>In Memoriam</span>}
                  </div>
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily:"'Playfair Display', serif" }}>
                      {selectedMember.status==="Late"?"Late ":""}{selectedMember.name}
                    </h3>
                    <p className="text-green-300 text-sm">{selectedMember.relation}</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[{icon:Calendar,label:"Born",value:selectedMember.birthYear??"—"},{icon:Star,label:"Gotra",value:selectedMember.gotra},{icon:MapPin,label:"Native",value:selectedMember.native.split(",")[0]}].map(({icon:Icon,label,value})=>(
                      <div key={label} className="rounded-xl p-2.5 text-center" style={{ background:"#F7F0E8" }}>
                        <Icon size={12} className="mx-auto mb-1" style={{ color:"#8B5E3C" }} />
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color:"#0D2B1E" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 rounded-xl p-3" style={{ background:"#F0FBF4", border:"1px solid #B7E4C7" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background:"#D1FAE5" }}>
                      <Briefcase size={13} style={{ color:"#1B4332" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Occupation</p>
                      <p className="text-sm font-semibold leading-snug" style={{ color:"#0D2B1E" }}>{selectedMember.occupation}</p>
                    </div>
                  </div>
                  {(parentMember||childrenMembers.length>0) && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Users size={11} /> Family</p>
                      <div className="space-y-1.5">
                        {parentMember && (
                          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={()=>setSelected(parentMember.id)}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor:"#DFC5A0" }}>
                              <img src={AVATAR_SVGS[parentMember.id]??""} alt={parentMember.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{parentMember.name}</p>
                              <p className="text-xs text-gray-400">{parentMember.relation}</p>
                            </div>
                            <ArrowRight size={11} className="text-gray-300" />
                          </div>
                        )}
                        {childrenMembers.map(child=>(
                          <div key={child.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={()=>setSelected(child.id)}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor:"#DFC5A0" }}>
                              <img src={AVATAR_SVGS[child.id]??""} alt={child.name} className="w-full h-full object-cover" />
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
                  {LIFE_ARCHIVES[selected] && (
                    <div className="rounded-xl p-4" style={{ background:"#FBF8F3", border:"1px solid #DFC5A0" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={12} style={{ color:"#8B5E3C" }} fill="#8B5E3C" />
                        <span className="text-xs font-semibold" style={{ color:"#1B4332" }}>Life Archive</span>
                      </div>
                      <p className="text-xs text-gray-600 italic leading-relaxed">&ldquo;{LIFE_ARCHIVES[selected]}&rdquo;</p>
                    </div>
                  )}
                  <Link href={`/profile/${selected}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                    style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 4px 16px rgba(27,67,50,0.25)" }}>
                    View Full Profile <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Add Member Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor:"rgba(0,0,0,0.55)" }}
            onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale:0.95,y:20 }} animate={{ scale:1,y:0 }} exit={{ scale:0.95,y:20 }}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ background:"white", maxHeight:"90vh", display:"flex", flexDirection:"column" }}
              onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b shrink-0"
                style={{ borderColor:"#DFC5A0", background:"linear-gradient(135deg, #0D2B1E, #1B4332)" }}>
                <div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily:"'Playfair Display', serif" }}>Add Family Member</h2>
                  <p className="text-green-300 text-xs mt-0.5">Enter details and upload a photo</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 space-y-5">
                {/* Photo upload */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer border-2 border-dashed"
                    style={{ borderColor:"#DFC5A0", background:"#F7F0E8" }}
                    onClick={() => fileRef.current?.click()}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera size={22} style={{ color:"#C4823A" }} />
                        <span className="text-xs text-gray-400">Add Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    <button onClick={() => fileRef.current?.click()}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border mb-1"
                      style={{ borderColor:"#DFC5A0", color:"#1B4332" }}>
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-400">JPG, PNG — max 2 MB</p>
                    {photoPreview && (
                      <button onClick={() => { setPhotoPreview(""); setPhotoBase64(""); }}
                        className="text-xs text-red-400 hover:underline mt-1">Remove photo</button>
                    )}
                  </div>
                </div>

                {/* Name + Gender row */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Full Name *</label>
                    <input type="text" placeholder="e.g. Ramesh Kamath Shenoy" value={form.name}
                      onChange={e => setForm(p=>({...p, name:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Gender</label>
                    <div className="flex gap-2">
                      {["M","F"].map(g => (
                        <button key={g} onClick={() => setForm(p=>({...p, gender:g}))}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                          style={form.gender===g ? {background:"#1B4332",color:"white",borderColor:"#1B4332"} : {borderColor:"#DFC5A0",color:"#374151"}}>
                          {g==="M"?"Male":"Female"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DOB + DOD */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Date of Birth</label>
                    <input type="date" value={form.dob} onChange={e => setForm(p=>({...p, dob:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1">
                      <span style={{ color:"#1B4332" }}>Date of Death</span>
                      <span className="text-gray-400 font-normal">(if applicable)</span>
                    </label>
                    <input type="date" value={form.dod} onChange={e => setForm(p=>({...p, dod:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                </div>

                {/* Gotra + Branch */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Gotra</label>
                    <div className="relative">
                      <select value={form.gotra} onChange={e => setForm(p=>({...p, gotra:e.target.value}))}
                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none appearance-none"
                        style={{ borderColor:"#DFC5A0" }}>
                        {GOTRAS.map(g=><option key={g}>{g}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Branch</label>
                    <div className="relative">
                      <select value={form.branch} onChange={e => setForm(p=>({...p, branch:e.target.value}))}
                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none appearance-none"
                        style={{ borderColor:"#DFC5A0" }}>
                        {BRANCHES.map(b=><option key={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Native + Occupation */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Native Place</label>
                    <input type="text" placeholder="e.g. Kundapura, Karnataka" value={form.native}
                      onChange={e => setForm(p=>({...p, native:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Occupation</label>
                    <input type="text" placeholder="e.g. Goldsmith, Engineer" value={form.occupation}
                      onChange={e => setForm(p=>({...p, occupation:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                </div>

                {/* Phone + Generation */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Phone</label>
                    <input type="tel" placeholder="9876543210" value={form.phone}
                      onChange={e => setForm(p=>({...p, phone:e.target.value.replace(/\D/g,"")}))}
                      maxLength={10}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>Generation</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(g=>(
                        <button key={g} onClick={() => setForm(p=>({...p, generation:g}))}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                          style={form.generation===g ? {background:"#1B4332",color:"white",borderColor:"#1B4332"} : {borderColor:"#DFC5A0",color:"#374151"}}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color:"#1B4332" }}>
                    Life Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea rows={3} placeholder="A few words about this person's life, contributions, or memories…"
                    value={form.notes} onChange={e => setForm(p=>({...p, notes:e.target.value}))}
                    className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none resize-none"
                    style={{ borderColor:"#DFC5A0" }} />
                </div>

                {saveError && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{saveError}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-5 border-t shrink-0" style={{ borderColor:"#F3F4F6" }}>
                <button onClick={handleSave} disabled={saving || !form.name.trim()}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Saving…</>
                    : <><Plus size={16} /> Add to Family Tree</>}
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm border"
                  style={{ borderColor:"#DFC5A0", color:"#374151" }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
