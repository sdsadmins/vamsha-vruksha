"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, IndianRupee, TreePine, Users } from "lucide-react";
import AdminShell, { Card, ErrorText, RoleBadge, Spinner } from "./_components/AdminShell";
import { adminApi, errorMessage, formatDate, type AdminMember, type CommunityStats } from "./_lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [recent, setRecent] = useState<AdminMember[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, page] = await Promise.all([
          adminApi.stats(),
          adminApi.members({ page: 1, limit: 5 }),
        ]);
        if (cancelled) return;
        setStats(s);
        setRecent(page.users);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const tiles = stats
    ? [
        { icon: Users, label: "Total Members", value: stats.totalMembers, href: "/admin/members" },
        { icon: TreePine, label: "Family Trees", value: stats.activeTrees, href: "/admin/members" },
        { icon: Heart, label: "Matrimonial Profiles", value: stats.matrimonialProfiles, href: "/admin/members" },
        { icon: IndianRupee, label: "Donations", value: `₹${stats.totalDonationAmount.toLocaleString("en-IN")}`, href: "/admin/members", sub: `${stats.totalDonations} contributions` },
      ]
    : [];

  return (
    <AdminShell title="Dashboard" subtitle="Community overview">
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {tiles.map(({ icon: Icon, label, value, href, sub }) => (
              <Link key={label} href={href}>
                <Card className="p-5 h-full hover:shadow-premium transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#D8F3DC" }}>
                    <Icon size={18} style={{ color: "#1B4332" }} />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                  {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </Card>
              </Link>
            ))}
          </div>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E8D5BC" }}>
              <h2 className="font-bold" style={{ color: "#0D2B1E" }}>Recently joined members</h2>
              <Link href="/admin/members" className="text-sm font-semibold flex items-center gap-1" style={{ color: "#1B4332" }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-500 text-center">No members yet.</p>
            ) : (
              <ul className="divide-y" style={{ borderColor: "#E8D5BC" }}>
                {recent.map((m) => (
                  <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/admin/members/${m.id}`} className="font-semibold text-sm truncate hover:underline" style={{ color: "#0D2B1E" }}>{m.name}</Link>
                      <p className="text-xs text-gray-500 truncate">@{m.userName} · {m.phone} · {m.gotra}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <RoleBadge role={m.role} />
                      <span className="text-xs text-gray-400">{formatDate(m.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </AdminShell>
  );
}
