"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, RoleBadge, Spinner, inputClass, inputStyle } from "../_components/AdminShell";
import { adminApi, errorMessage, formatDate, type AdminMemberPage, type AdminRole } from "../_lib/api";

const LIMIT = 20;

export default function AdminMembersPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<AdminRole | "">("");
  const [verified, setVerified] = useState<"true" | "false" | "">("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminMemberPage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await adminApi.members({ q: search, role, verified, page, limit: LIMIT }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, role, verified, page]);

  useEffect(() => { void load(); }, [load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.count / data.limit)) : 1;

  return (
    <AdminShell title="Members" subtitle={data ? `${data.count} accounts` : undefined}>
      <Card className="p-4 mb-4">
        <form
          onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q.trim()); }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, username, Samaj ID, phone, gotra, city…"
              className={`${inputClass} pl-11`}
              style={inputStyle}
            />
          </div>
          <select value={role} onChange={(e) => { setRole(e.target.value as AdminRole | ""); setPage(1); }} className={`${inputClass} md:w-40`} style={inputStyle}>
            <option value="">All roles</option>
            <option value="member">Member</option>
            <option value="elder">Elder</option>
            <option value="admin">Admin</option>
          </select>
          <select value={verified} onChange={(e) => { setVerified(e.target.value as "true" | "false" | ""); setPage(1); }} className={`${inputClass} md:w-40`} style={inputStyle}>
            <option value="">All statuses</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm" style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            Search
          </button>
        </form>
      </Card>

      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <Card>
        {loading ? (
          <Spinner />
        ) : !data || data.users.length === 0 ? (
          <p className="px-5 py-12 text-sm text-gray-500 text-center">No members match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b" style={{ borderColor: "#E8D5BC" }}>
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Samaj ID</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Gotra · Native</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#E8D5BC" }}>
                {data.users.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FAF7F2]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/members/${m.id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4332)" }}>
                          {m.profileUrl ? <img src={m.profileUrl} alt="" className="w-full h-full object-cover" /> : m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate" style={{ color: "#0D2B1E" }}>{m.name}</p>
                          <p className="text-xs text-gray-500 truncate">@{m.userName}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{m.samajId || "—"}</td>
                    <td className="px-5 py-3">{m.phone}</td>
                    <td className="px-5 py-3 text-gray-600">{m.gotra} · {m.native}</td>
                    <td className="px-5 py-3"><RoleBadge role={m.role} /></td>
                    <td className="px-5 py-3">
                      {m.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gold">Pending</Badge>}
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.count > LIMIT && (
          <div className="flex items-center justify-between px-5 py-3 border-t text-sm" style={{ borderColor: "#E8D5BC" }}>
            <span className="text-gray-500">Page {data.page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: "#DFC5A0" }} aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: "#DFC5A0" }} aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
