"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tags, XCircle } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, PrimaryButton, Spinner, inputClass, inputStyle } from "../_components/AdminShell";
import { errorMessage, formatDate } from "../_lib/api";
import {
  AD_CAMPAIGN_STATUSES,
  STATUS_LABEL,
  STATUS_TONE,
  adsApi,
  formatRupees,
  postThumb,
  type AdCampaignPage,
  type AdCampaignStatus,
} from "../_lib/ads";

const LIMIT = 20;

/**
 * Every sponsored post a member has paid (or is paying) for, with its
 * numbers. Members create these from the app; the admin sets the prices
 * (see /admin/post_campaigns/plans) and can stop a campaign.
 */
export default function AdminPostCampaignsPage() {
  const [status, setStatus] = useState<AdCampaignStatus | "">("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdCampaignPage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await adsApi.campaigns({ status, page, limit: LIMIT }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => { void load(); }, [load]);

  const cancel = async (id: string, label: string) => {
    if (!window.confirm(`Stop the campaign for "${label}"? Delivery stops at once. No refund is issued automatically.`)) return;
    setBusy(id);
    setError("");
    try {
      await adsApi.cancelCampaign(id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const rows = data?.campaigns ?? [];
  const activeCount = rows.filter((c) => c.status === "active").length;
  const revenue = rows.filter((c) => c.paymentId).reduce((s, c) => s + c.amount, 0);
  const impressions = rows.reduce((s, c) => s + c.analytics.impressions, 0);
  const clicks = rows.reduce((s, c) => s + c.analytics.clicks, 0);

  return (
    <AdminShell
      title="Post Campaigns"
      subtitle={data ? `${data.total} sponsored posts` : "Sponsored posts members pay to promote"}
      actions={
        <Link href="/admin/post_campaigns/plans">
          <PrimaryButton><Tags size={16} /> Plans & pricing</PrimaryButton>
        </Link>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active on this page", value: String(activeCount) },
          { label: "Paid on this page", value: formatRupees(revenue) },
          { label: "Impressions", value: impressions.toLocaleString("en-IN") },
          { label: "Clicks", value: clicks.toLocaleString("en-IN") },
        ].map((t) => (
          <Card key={t.label} className="p-5">
            <p className="text-2xl font-bold" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>{t.value}</p>
            <p className="text-sm text-gray-500">{t.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as AdCampaignStatus | ""); setPage(1); }}
          className={`${inputClass} md:w-56`}
          style={inputStyle}
        >
          <option value="">All statuses</option>
          {AD_CAMPAIGN_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </Card>

      <Card>
        {loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <p className="px-5 py-12 text-sm text-gray-500 text-center">
            {status ? "No campaigns with this status." : "No sponsored posts yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b" style={{ borderColor: "#E8D5BC" }}>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Advertiser</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Runs</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Impr.</th>
                  <th className="px-5 py-3 text-right">Reach</th>
                  <th className="px-5 py-3 text-right">Clicks</th>
                  <th className="px-5 py-3 text-right">CTR</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#E8D5BC" }}>
                {rows.map((c) => {
                  const thumb = postThumb(c);
                  const caption = c.post?.caption?.trim() || "(no caption)";
                  const stoppable = c.status === "pending_payment" || c.status === "scheduled" || c.status === "active";
                  return (
                    <tr key={c.id} className={`hover:bg-[#FAF7F2] ${busy === c.id ? "opacity-60 pointer-events-none" : ""}`}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/post_campaigns/${c.id}`} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-lg" style={{ background: "#F0E6D3" }}>
                            {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : "🎬"}
                          </div>
                          <p className="font-semibold truncate max-w-[220px]" style={{ color: "#0D2B1E" }} title={caption}>{caption}</p>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-600">@{c.advertiser?.userName ?? "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{c.plan.name} <span className="text-gray-400">· {c.plan.durationDays}d</span></td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.startDate)} → {formatDate(c.endDate)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">{formatRupees(c.amount)}</td>
                      <td className="px-5 py-3"><Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge></td>
                      <td className="px-5 py-3 text-right">{c.analytics.impressions.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-right">{c.analytics.reach.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-right">{c.analytics.clicks.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-right">{c.analytics.ctr}%</td>
                      <td className="px-5 py-3 text-right">
                        {stoppable && (
                          <button onClick={() => cancel(c.id, caption)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" title="Stop campaign" aria-label="Stop campaign">
                            <XCircle size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > LIMIT && (
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
