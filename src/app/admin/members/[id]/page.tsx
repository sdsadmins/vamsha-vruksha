"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, RoleBadge, Spinner, inputClass, inputStyle } from "../../_components/AdminShell";
import { adminApi, errorMessage, formatDate, type AdminMember, type AdminRole } from "../../_lib/api";
import { getUser } from "@/lib/auth";

export default function AdminMemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<AdminMember | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const isSelf = getUser()?.id === id;

  useEffect(() => {
    let cancelled = false;
    adminApi.member(id)
      .then((m) => { if (!cancelled) setMember(m); })
      .catch((err) => { if (!cancelled) setError(errorMessage(err)); });
    return () => { cancelled = true; };
  }, [id]);

  const patch = async (changes: Parameters<typeof adminApi.updateMember>[1]) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      setMember(await adminApi.updateMember(id, changes));
      setNotice("Saved.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!member) return;
    if (!window.confirm(`Delete ${member.name} (@${member.userName})? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await adminApi.deleteMember(id);
      router.replace("/admin/members");
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  const addr = member?.currentAddress;
  const addressLine = addr
    ? [addr.street, addr.landmark, addr.area, addr.city, addr.district, addr.state, addr.pincode].filter(Boolean).join(", ")
    : "";

  return (
    <AdminShell
      title={member?.name ?? "Member"}
      subtitle={member ? `@${member.userName} · ${member.samajId || "no Samaj ID"}` : undefined}
      actions={
        <Link href="/admin/members" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#1B4332" }}>
          <ArrowLeft size={16} /> Back
        </Link>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}

      {!member ? (
        !error && <Spinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl" style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4332)" }}>
                {member.profileUrl ? <img src={member.profileUrl} alt="" className="w-full h-full object-cover" /> : member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>{member.name}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <RoleBadge role={member.role} />
                  {member.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gold">Pending</Badge>}
                  {member.isPurohit && <Badge tone="gold">Purohit</Badge>}
                  {member.hasDonated && <Badge tone="green">Donated</Badge>}
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Phone", member.phone],
                ["Samaj ID", member.samajId],
                ["Gender", member.gender === "M" ? "Male" : member.gender === "F" ? "Female" : ""],
                ["Date of birth", member.dob],
                ["Marital status", member.maritalStatus],
                ["Occupation", member.occupation],
                ["Gotra", member.gotra],
                ["Native", member.native],
                ["Current address", addressLine || member.address],
                ["Aadhaar (masked)", member.masked_aadhaar],
                ["Matrimonial opt-in", member.matrimonialOptIn ? "Yes" : "No"],
                ["Phone visible to members", member.showPhoneToMembers ? "Yes" : "No"],
                ["Joined", formatDate(member.createdAt)],
                ["Last login", formatDate(member.lastLoginAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{k}</dt>
                  <dd className="font-medium" style={{ color: "#0D2B1E" }}>{v || "—"}</dd>
                </div>
              ))}
              {member.bio && (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Bio</dt>
                  <dd className="font-medium whitespace-pre-line" style={{ color: "#0D2B1E" }}>{member.bio}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="font-bold mb-4" style={{ color: "#0D2B1E" }}>Account</h2>

              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Role</label>
              <select
                value={member.role}
                disabled={saving || isSelf}
                onChange={(e) => void patch({ role: e.target.value as AdminRole })}
                className={`${inputClass} mb-4`}
                style={inputStyle}
              >
                <option value="member">Member</option>
                <option value="elder">Elder</option>
                <option value="admin">Admin</option>
              </select>
              {isSelf && <p className="text-xs text-gray-400 -mt-3 mb-4">You cannot change your own role.</p>}

              {[
                { key: "verified", label: "Verified member" },
                { key: "hasDonated", label: "Registration donation done" },
                { key: "isPurohit", label: "Listed as Purohit" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between py-2 text-sm cursor-pointer">
                  <span style={{ color: "#0D2B1E" }}>{label}</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#1B4332]"
                    disabled={saving}
                    checked={Boolean(member[key as "verified" | "hasDonated" | "isPurohit"])}
                    onChange={(e) => void patch({ [key]: e.target.checked })}
                  />
                </label>
              ))}
            </Card>

            {!isSelf && (
              <Card className="p-5">
                <h2 className="font-bold mb-1 text-red-700">Danger zone</h2>
                <p className="text-xs text-gray-500 mb-3">Permanently removes this account.</p>
                <button
                  onClick={remove}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border text-red-700 hover:bg-red-50 disabled:opacity-60"
                  style={{ borderColor: "#FCA5A5" }}
                >
                  <Trash2 size={16} /> Delete member
                </button>
              </Card>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
