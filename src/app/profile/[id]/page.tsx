"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Edit2, MapPin, ChevronRight, Star, TreePine, Calendar, Briefcase } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { FAMILY_MEMBERS } from "@/lib/data";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

interface DbMember {
  _id: string; name: string; gender: string; dob?: string; dod?: string;
  gotra: string; native: string; occupation: string; phone: string;
  photoUrl: string; generation: number; branch: string; notes: string; parentId?: string;
}

const LIFE_ARCHIVES: Record<string, string> = {
  "1": "Ramachandra Shet was the patriarch of our Kundapura branch and a master goldsmith. He established the family jewellery tradition in 1942 and his 47-year handwritten ledger is the foundation of our digital tree today.",
  "2": "Savitribai Shet was the matriarch renowned for her devotion to Samaj seva and Sanskrit shlokas. She organised the first Samaj women's collective in Kundapura and raised funds for the community temple.",
  "3": "Venkatesh Kamat migrated from Kumta to Bengaluru in 1975 to expand the jewellery business to Commercial Street. His descendants now span Bengaluru, Mangaluru, Singapore, and Dubai.",
  "4": "Suresh Kamat is the first in the family to enter software engineering — bridging the goldsmith legacy with the Bengaluru IT boom. He co-founded the Daivajna Samaja IT professionals' network.",
  "5": "Rekha Pai is a distinguished educator and Samaj community leader. She established the Daivajna Samaja annual scholarship fund in 2008, mentoring over 300 students from the community.",
  "6": "Priya Kamat represents the new generation — digitising 500+ family photos, creating this Daivajna Samaja platform, and connecting 1,400+ families across the Daivajna Samaja worldwide.",
};

function isMongoId(id: string) {
  return /^[a-f0-9]{24}$/i.test(id);
}

export default function ProfilePage() {
  const { id } = useParams();
  const memberId = Array.isArray(id) ? id[0] : id ?? "";

  // DB member state
  const [dbMember, setDbMember]       = useState<DbMember | null>(null);
  const [dbParent, setDbParent]       = useState<DbMember | null>(null);
  const [dbChildren, setDbChildren]   = useState<DbMember[]>([]);
  const [dbLoading, setDbLoading]     = useState(isMongoId(memberId));

  useEffect(() => {
    if (!isMongoId(memberId)) return;
    setDbLoading(true);
    Promise.all([
      fetch(`/api/family/${memberId}`).then(r => r.ok ? r.json() : null),
      fetch("/api/family").then(r => r.ok ? r.json() : []),
    ]).then(([member, all]: [DbMember | null, DbMember[]]) => {
      if (member) {
        setDbMember(member);
        if (member.parentId) {
          setDbParent(all.find((m: DbMember) => m._id === member.parentId) ?? null);
        }
        setDbChildren(all.filter((m: DbMember) => m.parentId === memberId));
      }
      setDbLoading(false);
    }).catch(() => setDbLoading(false));
  }, [memberId]);

  // Static member fallback
  const staticMember = FAMILY_MEMBERS.find((m) => m.id === memberId);

  if (dbLoading) {
    return (
      <SidebarLayout title="Member Profile">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-t-green-800 rounded-full animate-spin" style={{ borderColor:"#DFC5A0", borderTopColor:"#1B4332" }} />
        </div>
      </SidebarLayout>
    );
  }

  // ── DB Member Profile ──
  if (dbMember) {
    const isLate = !!dbMember.dod;
    return (
      <SidebarLayout title={dbMember.name}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left card */}
          <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5 }} className="lg:col-span-1">
            <div className="rounded-3xl overflow-hidden border sticky top-4" style={{ background:"white", borderColor:"#DFC5A0" }}>
              <div className="relative" style={{ background:"linear-gradient(160deg, #0D2B1E, #1B4332)", padding:"32px 24px 48px" }}>
                <div className="absolute inset-0 opacity-20" style={{ background:"radial-gradient(ellipse at 50% 0%, #C4823A33, transparent 70%)" }} />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 mx-auto"
                      style={{ borderColor:"#C4823A", filter:isLate?"grayscale(30%)":"none" }}>
                      {dbMember.photoUrl
                        ? <img src={dbMember.photoUrl} alt={dbMember.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl bg-green-900">{dbMember.gender==="F"?"👩":"👨"}</div>
                      }
                    </div>
                    {!isLate && (
                      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 flex items-center justify-center"
                        style={{ background:"#D1FAE5", borderColor:"white" }}>
                        <span className="text-xs" style={{ color:"#065F46" }}>✓</span>
                      </div>
                    )}
                  </div>
                  {isLate && (
                    <span className="text-xs px-2 py-0.5 rounded-full mb-2 font-medium"
                      style={{ background:"rgba(156,163,175,0.2)", color:"#D1D5DB" }}>In Memoriam</span>
                  )}
                  <h1 className="text-xl font-bold text-white" style={{ fontFamily:"'Playfair Display', serif" }}>
                    {isLate ? "Late " : ""}{dbMember.name}
                  </h1>
                  <p className="text-green-300 text-sm">{dbMember.branch} Branch · Gen {dbMember.generation}</p>
                </div>
              </div>
              <div className="p-5 -mt-6">
                <div className="bg-white rounded-2xl border p-4 mb-4 grid grid-cols-2 gap-3" style={{ borderColor:"#F0E6D3" }}>
                  {[
                    { label:"Gotra",  val:dbMember.gotra },
                    { label:"Native", val:(dbMember.native||"—").split(",")[0] },
                  ].map(({label,val}) => (
                    <div key={label} className="text-center rounded-xl p-3" style={{ background:"#FAF7F2" }}>
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="font-bold text-sm" style={{ color:"#1B4332" }}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mb-3">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all hover:-translate-y-0.5"
                    style={{ borderColor:"#1B4332", color:"#1B4332" }}>
                    <UserPlus size={15} /> Add Relative
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all hover:-translate-y-0.5"
                    style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    <Edit2 size={15} /> Edit Profile
                  </button>
                </div>
                <div className="rounded-xl p-4 flex items-center gap-3 border" style={{ background:"#FAF7F2", borderColor:"#DFC5A0" }}>
                  <MapPin size={16} style={{ color:"#8B5E3C" }} />
                  <div>
                    <p className="text-xs text-gray-400">Native Place</p>
                    <p className="font-semibold text-sm">{dbMember.native || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5, delay:0.1 }}
            className="lg:col-span-2 space-y-5">
            {/* Details card */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ background:"white", borderColor:"#DFC5A0" }}>
              <h2 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                Personal Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon:Calendar, label:"Date of Birth", val:dbMember.dob||"—" },
                  { icon:Calendar, label:"Date of Death", val:dbMember.dod||"—" },
                  { icon:Briefcase,label:"Occupation",    val:dbMember.occupation||"—" },
                  { icon:MapPin,   label:"Branch",        val:dbMember.branch },
                ].map(({icon:Icon,label,val}) => (
                  <div key={label} className="rounded-xl p-3" style={{ background:"#F7F0E8" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} style={{ color:"#8B5E3C" }} />
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color:"#0D2B1E" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Relations */}
            {(dbParent || dbChildren.length > 0) && (
              <div className="rounded-2xl border overflow-hidden" style={{ background:"white", borderColor:"#DFC5A0" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor:"#F3F4F6" }}>
                  <h2 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                    <TreePine size={18} style={{ color:"#1B4332" }} /> Family Relations
                  </h2>
                  <Link href="/family-tree" className="text-xs font-semibold" style={{ color:"#1B4332" }}>View Full Tree →</Link>
                </div>
                <div className="divide-y" style={{ borderColor:"#F9F9F9" }}>
                  {dbParent && (
                    <Link href={`/profile/${dbParent._id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center"
                          style={{ borderColor:"#DFC5A0", background:"#F7F0E8" }}>
                          {dbParent.photoUrl
                            ? <img src={dbParent.photoUrl} alt={dbParent.name} className="w-full h-full object-cover" />
                            : <span className="text-2xl">{dbParent.gender==="F"?"👩":"👨"}</span>}
                        </div>
                        <div>
                          <p className="font-semibold">{dbParent.name}</p>
                          <p className="text-xs text-gray-400">Parent · Gen {dbParent.generation}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  )}
                  {dbChildren.map(child => (
                    <Link key={child._id} href={`/profile/${child._id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center"
                          style={{ borderColor:"#DFC5A0", background:"#F7F0E8" }}>
                          {child.photoUrl
                            ? <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                            : <span className="text-2xl">{child.gender==="F"?"👩":"👨"}</span>}
                        </div>
                        <div>
                          <p className="font-semibold">{child.name}</p>
                          <p className="text-xs text-gray-400">Child · Gen {child.generation}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Life Notes */}
            {dbMember.notes && (
              <div className="rounded-2xl border p-6" style={{ background:"white", borderColor:"#DFC5A0" }}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                  <Star size={18} style={{ color:"#8B5E3C" }} fill="#8B5E3C" /> Life Archive
                </h2>
                <blockquote className="text-gray-600 italic leading-relaxed border-l-4 pl-4 text-base"
                  style={{ borderColor:"#8B5E3C", fontFamily:"'Playfair Display', serif" }}>
                  &ldquo;{dbMember.notes}&rdquo;
                </blockquote>
              </div>
            )}

            {/* Back */}
            <Link href="/family-tree"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color:"#1B4332" }}>
              ← Back to Family Tree
            </Link>
          </motion.div>
        </div>
      </SidebarLayout>
    );
  }

  // ── Static Member Profile ──
  if (!staticMember) {
    return (
      <SidebarLayout title="Member Profile">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-400">Member not found</p>
          <Link href="/family-tree" className="text-sm font-semibold" style={{ color:"#1B4332" }}>← Back to Family Tree</Link>
        </div>
      </SidebarLayout>
    );
  }

  const parent = staticMember.parent ? FAMILY_MEMBERS.find((m) => m.id === staticMember.parent) : null;
  const children = FAMILY_MEMBERS.filter((m) => m.parent === staticMember.id);
  const isLate = staticMember.status === "Late";

  return (
    <SidebarLayout title={staticMember.name}>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5 }} className="lg:col-span-1">
          <div className="rounded-3xl overflow-hidden border sticky top-4" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <div className="relative" style={{ background:"linear-gradient(160deg, #0D2B1E, #1B4332)", padding:"32px 24px 48px" }}>
              <div className="absolute inset-0 opacity-20" style={{ background:"radial-gradient(ellipse at 50% 0%, #C4823A33, transparent 70%)" }} />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 mx-auto"
                    style={{ borderColor:"#C4823A", filter:isLate?"grayscale(30%)":"none" }}>
                    <img src={AVATAR_SVGS[memberId]??""} alt={staticMember.name} className="w-full h-full object-cover" />
                  </div>
                  {staticMember.status === "Active" && (
                    <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 flex items-center justify-center"
                      style={{ background:"#D1FAE5", borderColor:"white" }}>
                      <span className="text-xs" style={{ color:"#065F46" }}>✓</span>
                    </div>
                  )}
                </div>
                {isLate && (
                  <span className="text-xs px-2 py-0.5 rounded-full mb-2 font-medium"
                    style={{ background:"rgba(156,163,175,0.2)", color:"#D1D5DB" }}>In Memoriam</span>
                )}
                <h1 className="text-xl font-bold text-white" style={{ fontFamily:"'Playfair Display', serif" }}>
                  {isLate ? "Late " : ""}{staticMember.name}
                </h1>
                <p className="text-green-300 text-sm">{staticMember.relation}</p>
              </div>
            </div>
            <div className="p-5 -mt-6">
              <div className="bg-white rounded-2xl border p-4 mb-4 grid grid-cols-2 gap-3" style={{ borderColor:"#F0E6D3" }}>
                {[{label:"Gotra",val:staticMember.gotra},{label:"Native",val:staticMember.native.split(",")[0]}].map(({label,val})=>(
                  <div key={label} className="text-center rounded-xl p-3" style={{ background:"#FAF7F2" }}>
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="font-bold text-sm" style={{ color:"#1B4332" }}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mb-3">
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all hover:-translate-y-0.5"
                  style={{ borderColor:"#1B4332", color:"#1B4332" }}>
                  <UserPlus size={15} /> Add Relative
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all hover:-translate-y-0.5"
                  style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  <Edit2 size={15} /> Edit Profile
                </button>
              </div>
              <Link href="/profile/verify"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border mb-4 transition-all hover:bg-amber-50"
                style={{ borderColor:"#C4823A", color:"#8B5E3C" }}>
                🛡️ Verify &amp; Update Info
              </Link>
              <div className="rounded-xl p-4 flex items-center gap-3 border" style={{ background:"#FAF7F2", borderColor:"#DFC5A0" }}>
                <MapPin size={16} style={{ color:"#8B5E3C" }} />
                <div>
                  <p className="text-xs text-gray-400">Home Location</p>
                  <p className="font-semibold text-sm">{staticMember.native}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5, delay:0.1 }}
          className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border overflow-hidden" style={{ background:"white", borderColor:"#DFC5A0" }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor:"#F3F4F6" }}>
              <h2 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                <TreePine size={18} style={{ color:"#1B4332" }} /> Family Relations
              </h2>
              <Link href="/family-tree" className="text-xs font-semibold" style={{ color:"#1B4332" }}>View Full Tree →</Link>
            </div>
            <div className="divide-y" style={{ borderColor:"#F9F9F9" }}>
              {parent && (
                <Link href={`/profile/${parent.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor:"#DFC5A0" }}>
                      <img src={AVATAR_SVGS[parent.id]??""} alt={parent.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{parent.status==="Late"?"Late ":""}{parent.name}</p>
                      <p className="text-xs text-gray-400">Parent / Father</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              )}
              {children.map(child=>(
                <Link key={child.id} href={`/profile/${child.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor:"#DFC5A0" }}>
                      <img src={AVATAR_SVGS[child.id]??""} alt={child.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-xs text-gray-400">Son / Daughter</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
              {!parent && children.length===0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-400 text-sm">No connected relations yet</p>
                  <button className="mt-2 text-sm font-semibold" style={{ color:"#1B4332" }}>+ Add Family Member</button>
                </div>
              )}
            </div>
          </div>

          {LIFE_ARCHIVES[memberId] && (
            <div className="rounded-2xl border p-6" style={{ background:"white", borderColor:"#DFC5A0" }}>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                <Star size={18} style={{ color:"#8B5E3C" }} fill="#8B5E3C" /> Life Archive
              </h2>
              <blockquote className="text-gray-600 italic leading-relaxed border-l-4 pl-4 text-base"
                style={{ borderColor:"#8B5E3C", fontFamily:"'Playfair Display', serif" }}>
                &ldquo;{LIFE_ARCHIVES[memberId]}&rdquo;
              </blockquote>
            </div>
          )}

          <div className="rounded-2xl border p-5" style={{ background:"linear-gradient(160deg, #F7F0E8, #FAF7F2)", borderColor:"#DFC5A0" }}>
            <h2 className="font-bold mb-3" style={{ color:"#0D2B1E" }}>Lineage Position</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {["Ramachandra Bhat","Venkatesh Bhat",staticMember.name].map((name,i,arr)=>(
                <div key={name} className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background:i===arr.length-1?"linear-gradient(135deg, #1B4332, #2D6A4F)":"#DFC5A0", color:i===arr.length-1?"white":"#6B5C4A" }}>
                    {name.split(" ")[0]}
                  </span>
                  {i<arr.length-1 && <span className="text-gray-300 text-lg">›</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
}
