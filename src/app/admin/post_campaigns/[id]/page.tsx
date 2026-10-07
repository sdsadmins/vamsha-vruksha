"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, PrimaryButton, Spinner, inputClass, inputStyle } from "../../_components/AdminShell";
import { errorMessage } from "../../_lib/api";
import { STATUS_LABEL, STATUS_TONE, adsApi, formatDateTime, formatRupees, postThumb, type AdCampaign } from "../../_lib/ads";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm border-b last:border-0" style={{ borderColor: "#F0E6D3" }}>
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right" style={{ color: "#0D2B1E" }}>{value}</span>
    </div>
  );
}

export default function AdminPostCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [c, setC] = useState<AdCampaign | null>(null);
  const [cap, setCap] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adsApi.campaign(id)
      .then((data) => { if (!cancelled) { setC(data); setCap(String(data.frequencyCapPerUserPerDay)); } })
      .catch((err) => { if (!cancelled) setError(errorMessage(err)); });
    return () => { cancelled = true; };
  }, [id]);

  const run = async (action: () => Promise<AdCampaign>, done: string) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const next = await action();
      setC(next);
      setCap(String(next.frequencyCapPerUserPerDay));
      setNotice(done);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveCap = () => {
    const n = Number(cap);
    if (!Number.isInteger(n) || n < 1 || n > 50) { setError("Frequency cap must be a whole number from 1 to 50."); return; }
    void run(() => adsApi.setFrequencyCap(id, n), "Frequency cap saved.");
  };

  const stop = () => {
    if (!window.confirm("Stop this campaign? Delivery stops at once. No refund is issued automatically.")) return;
    void run(() => adsApi.cancelCampaign(id), "Campaign stopped.");
  };

  const stoppable = c && (c.status === "pending_payment" || c.status === "scheduled" || c.status === "active");
  const thumb = c ? postThumb(c) : "";
  const a = c?.analytics;
  const t = c?.targeting;
  const targetingBits = t
    ? [
        t.gender && `Gender: ${t.gender}`,
        (t.ageMin != null || t.ageMax != null) && `Age: ${t.ageMin ?? "any"}–${t.ageMax ?? "any"}`,
        t.cities.length > 0 && `Cities: ${t.cities.join(", ")}`,
        t.states.length > 0 && `States: ${t.states.join(", ")}`,
      ].filter(Boolean)
    : [];

  return (
    <AdminShell
      title="Sponsored post"
      subtitle={c ? `${c.plan.name} · ${formatRupees(c.amount)}` : undefined}
      actions={
        <div className="flex items-center gap-3">
          <Link href="/admin/post_campaigns" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#1B4332" }}>
            <ArrowLeft size={16} /> All campaigns
          </Link>
          {stoppable && (
            <button onClick={stop} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">
              <XCircle size={16} /> Stop campaign
            </button>
          )}
        </div>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}

      {!c || !a ? (
        !error && <Spinner />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card className="p-5 xl:col-span-2">
            <div className="flex gap-4 mb-5">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-3xl" style={{ background: "#F0E6D3" }}>
                {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : "🎬"}
              </div>
              <div className="min-w-0">
                <div className="mb-2"><Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge></div>
                <p className="font-semibold leading-snug" style={{ color: "#0D2B1E" }}>{c.post?.caption?.trim() || "(no caption)"}</p>
                <p className="text-sm text-gray-500 mt-1">
                  by{" "}
                  {c.advertiser ? (
                    <Link href={`/admin/members/${c.advertiser._id}`} className="hover:underline" style={{ color: "#1B4332" }}>@{c.advertiser.userName}</Link>
                  ) : "—"}
                </p>
                {c.post?.isDeleted && <p className="text-xs text-red-600 mt-1">The post has been deleted — nothing is delivered.</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              {[
                { label: "Impressions", value: a.impressions.toLocaleString("en-IN") },
                { label: "Unique reach", value: a.reach.toLocaleString("en-IN") },
                { label: "Clicks", value: a.clicks.toLocaleString("en-IN") },
                { label: "CTR", value: `${a.ctr}%` },
                { label: "Frequency", value: a.frequency.toFixed(2) },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: "#FAF7F2" }}>
                  <p className="text-xl font-bold" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <Row label="Plan" value={`${c.plan.name} · ${c.plan.durationDays} days`} />
            <Row label="Amount" value={formatRupees(c.amount)} />
            <Row label="Payment" value={c.paymentId ? `Paid ${formatDateTime(c.paidAt)}` : "Not paid"} />
            <Row label="Starts" value={formatDateTime(c.startDate)} />
            <Row label="Ends" value={formatDateTime(c.endDate)} />
            <Row label="Remaining" value={a.remainingDays > 0 ? `${a.remainingDays} days` : "—"} />
            <Row
              label="Link"
              value={
                c.linkUrl ? (
                  <a href={c.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all" style={{ color: "#1B4332" }}>
                    {c.linkLabel ? `${c.linkLabel} — ` : ""}{c.linkUrl}
                  </a>
                ) : "None"
              }
            />
            <Row label="Targeting" value={targetingBits.length ? targetingBits.join(" · ") : "Everyone"} />
            <Row label="Created" value={formatDateTime(c.createdAt)} />
            {c.cancelledAt && <Row label="Cancelled" value={`${formatDateTime(c.cancelledAt)} (${c.cancelReason ?? "—"})`} />}
          </Card>

          <Card className="p-5 h-fit">
            <h2 className="font-bold mb-1" style={{ color: "#0D2B1E" }}>Frequency cap</h2>
            <p className="text-sm text-gray-500 mb-4">
              How many times one member may be shown this post per day. The system default applies unless changed here.
            </p>
            <div className="flex gap-2">
              <input value={cap} onChange={(e) => setCap(e.target.value)} type="number" min={1} max={50} className={inputClass} style={inputStyle} />
              <PrimaryButton onClick={saveCap} loading={saving} disabled={cap === String(c.frequencyCapPerUserPerDay)}>Save</PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </AdminShell>
  );
}
