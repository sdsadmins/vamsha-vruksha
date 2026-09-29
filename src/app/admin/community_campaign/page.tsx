"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Pencil, PlayCircle, Plus, Trash2, XCircle } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, PrimaryButton, Spinner, inputClass, inputStyle } from "../_components/AdminShell";
import {
  CAMPAIGN_STATUSES,
  daysLeft,
  deleteCampaign,
  formatRupees,
  gradientCss,
  loadCampaigns,
  setCampaignStatus,
  type Campaign,
  type CampaignStatus,
} from "../_lib/campaigns";
import { fixedOptions } from "../_lib/dropdowns";
import { errorMessage, formatDate } from "../_lib/api";

const STATUS_TONE: Record<CampaignStatus, "green" | "gold" | "gray"> = {
  active: "green",
  completed: "gold",
  closed: "gray",
};

/**
 * Community campaigns are created and run by the admin, not by members. This
 * lists every campaign with its progress and lets the admin open, complete,
 * close, edit, or delete one.
 */
export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<CampaignStatus | "">("");
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const reload = async () => {
    setError("");
    try {
      setCampaigns(await loadCampaigns());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    setCategories(Object.fromEntries(fixedOptions("welfare-category").map((o) => [o.value, o.label])));
    void reload();
  }, []);

  const totals = useMemo(() => {
    const active = campaigns.filter((c) => c.status === "active");
    return {
      active: active.length,
      raised: campaigns.reduce((s, c) => s + c.raised, 0),
      goal: active.reduce((s, c) => s + c.goal, 0),
      donors: campaigns.reduce((s, c) => s + c.donors, 0),
    };
  }, [campaigns]);

  const visible = campaigns.filter(
    (c) =>
      (!status || c.status === status) &&
      (!q || `${c.title} ${c.slug} ${categories[c.category] ?? c.category}`.toLowerCase().includes(q.toLowerCase())),
  );

  const act = async (slug: string, action: () => Promise<unknown>) => {
    setBusy(slug);
    setError("");
    try {
      await action();
      setCampaigns(await loadCampaigns());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const changeStatus = (slug: string, next: CampaignStatus) => act(slug, () => setCampaignStatus(slug, next));

  const remove = (c: Campaign) => {
    if (c.raised > 0 || c.donors > 0) {
      setError("This campaign has donations and cannot be deleted. Mark it completed or closed instead.");
      return;
    }
    if (!window.confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    void act(c.slug, () => deleteCampaign(c.slug));
  };

  return (
    <AdminShell
      title="Community Campaigns"
      subtitle="Welfare fundraisers shown to members"
      actions={
        <Link href="/admin/community_campaign/new">
          <PrimaryButton><Plus size={16} /> New campaign</PrimaryButton>
        </Link>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active campaigns", value: String(totals.active) },
          { label: "Total raised", value: formatRupees(totals.raised) },
          { label: "Active goal", value: formatRupees(totals.goal) },
          { label: "Donations", value: totals.donors.toLocaleString("en-IN") },
        ].map((t) => (
          <Card key={t.label} className="p-5">
            <p className="text-2xl font-bold" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>{t.value}</p>
            <p className="text-sm text-gray-500">{t.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, id, category…" className={`${inputClass} flex-1`} style={inputStyle} />
          <select value={status} onChange={(e) => setStatus(e.target.value as CampaignStatus | "")} className={`${inputClass} md:w-44`} style={inputStyle}>
            <option value="">All statuses</option>
            {CAMPAIGN_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </Card>

      {!ready ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-sm mb-4">{campaigns.length === 0 ? "No campaigns yet." : "No campaigns match."}</p>
          {campaigns.length === 0 && (
            <Link href="/admin/community_campaign/new"><PrimaryButton><Plus size={16} /> Create the first campaign</PrimaryButton></Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((c) => {
            const pct = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0;
            const left = daysLeft(c.endsAt);
            return (
              <Card key={c.slug} className={`overflow-hidden flex flex-col ${busy === c.slug ? "opacity-60 pointer-events-none" : ""}`}>
                <div className="h-28 flex items-center justify-center text-5xl relative" style={{ background: gradientCss(c.color) }}>
                  {/^https?:\/\//.test(c.image) ? <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" /> : <span>{c.image || "🏛️"}</span>}
                  <span className="absolute top-3 left-3"><Badge tone={STATUS_TONE[c.status]}>{c.status[0].toUpperCase() + c.status.slice(1)}</Badge></span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#C4823A" }}>{categories[c.category] ?? c.category ?? "—"}</p>
                  <Link href={`/admin/community_campaign/${c.slug}`} className="font-bold leading-snug hover:underline" style={{ color: "#0D2B1E" }}>{c.title}</Link>
                  <p className="text-xs font-mono text-gray-400 mb-3">{c.slug}</p>

                  <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#F0E6D3" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #2D6A4F, #52B788)" }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span><strong style={{ color: "#0D2B1E" }}>{formatRupees(c.raised)}</strong> of {formatRupees(c.goal)}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>{c.donors} donors</span>
                    <span>{left === null ? "Open-ended" : left === 0 ? `Ended ${formatDate(c.endsAt)}` : `${left} days left`}</span>
                  </div>

                  <div className="mt-auto flex items-center gap-1 pt-3 border-t" style={{ borderColor: "#E8D5BC" }}>
                    <Link href={`/admin/community_campaign/${c.slug}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F0E6D3]" style={{ color: "#1B4332" }}>
                      <Pencil size={14} /> Edit
                    </Link>
                    {c.status !== "active" && (
                      <button onClick={() => changeStatus(c.slug, "active")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F0E6D3]" style={{ color: "#1B4332" }}>
                        <PlayCircle size={14} /> Reopen
                      </button>
                    )}
                    {c.status === "active" && (
                      <>
                        <button onClick={() => changeStatus(c.slug, "completed")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F0E6D3]" style={{ color: "#8B5E3C" }}>
                          <CheckCircle2 size={14} /> Complete
                        </button>
                        <button onClick={() => changeStatus(c.slug, "closed")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-[#F0E6D3]">
                          <XCircle size={14} /> Close
                        </button>
                      </>
                    )}
                    <button onClick={() => remove(c)} className="ml-auto p-2 rounded-lg text-red-600 hover:bg-red-50" title="Delete" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
