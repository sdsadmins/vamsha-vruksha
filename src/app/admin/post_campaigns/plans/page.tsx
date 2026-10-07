"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Pencil, Plus, X } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, PrimaryButton, Spinner, inputClass, inputStyle } from "../../_components/AdminShell";
import { errorMessage } from "../../_lib/api";
import { adsApi, formatRupees, type AdPlan, type AdPlanInput } from "../../_lib/ads";

type Draft = { name: string; durationDays: string; price: string };

const EMPTY: Draft = { name: "", durationDays: "", price: "" };

function parse(d: Draft): AdPlanInput | string {
  const name = d.name.trim();
  const durationDays = Number(d.durationDays);
  const price = Number(d.price);
  if (name.length < 2) return "Give the plan a name (e.g. 7 Days).";
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 365) return "Duration must be 1–365 days.";
  if (!Number.isInteger(price) || price < 1) return "Price must be a whole number of rupees, at least ₹1.";
  return { name, durationDays, price };
}

/**
 * The price list for sponsored posts: how many days a campaign runs and what
 * it costs. Members only ever pick a plan; the server charges its price.
 * Changing a plan affects new campaigns only — running ones keep what they
 * were quoted. There is no delete: disable a plan to hide it from members.
 */
export default function AdminAdPlansPage() {
  const [plans, setPlans] = useState<AdPlan[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>(EMPTY);

  const reload = async () => {
    try {
      setPlans(await adsApi.plans());
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => { void reload(); }, []);

  const run = async (action: () => Promise<unknown>, done: string) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await action();
      await reload();
      setNotice(done);
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const create = async () => {
    const input = parse(draft);
    if (typeof input === "string") { setError(input); return; }
    if (await run(() => adsApi.createPlan(input), "Plan created.")) {
      setDraft(EMPTY);
      setAdding(false);
    }
  };

  const startEdit = (p: AdPlan) => {
    setEditing(p.id);
    setEdit({ name: p.name, durationDays: String(p.durationDays), price: String(p.price) });
  };

  const saveEdit = async (id: string) => {
    const input = parse(edit);
    if (typeof input === "string") { setError(input); return; }
    if (await run(() => adsApi.updatePlan(id, input), "Plan updated. New campaigns use the new price.")) {
      setEditing(null);
    }
  };

  const toggle = (p: AdPlan) =>
    run(() => adsApi.updatePlan(p.id, { isActive: !p.isActive }), p.isActive ? "Plan disabled — members no longer see it." : "Plan enabled.");

  const fields = (d: Draft, set: (d: Draft) => void) => (
    <>
      <input value={d.name} onChange={(e) => set({ ...d, name: e.target.value })} placeholder="Name, e.g. 7 Days" className={inputClass} style={inputStyle} />
      <input value={d.durationDays} onChange={(e) => set({ ...d, durationDays: e.target.value })} placeholder="Days" type="number" min={1} max={365} className={inputClass} style={inputStyle} />
      <input value={d.price} onChange={(e) => set({ ...d, price: e.target.value })} placeholder="Price (₹)" type="number" min={1} className={inputClass} style={inputStyle} />
    </>
  );

  return (
    <AdminShell
      title="Sponsored post plans"
      subtitle="How long a campaign runs and what members pay for it"
      actions={
        <Link href="/admin/post_campaigns" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#1B4332" }}>
          <ArrowLeft size={16} /> Campaigns
        </Link>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}

      <Card className="p-6 max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="font-bold mb-1" style={{ color: "#0D2B1E" }}>Plans & pricing</h2>
            <p className="text-sm text-gray-500">
              A member picks one of these when promoting a post; the server charges exactly this price.
              Changes apply to new campaigns only. Disable a plan instead of deleting it.
            </p>
          </div>
          {!adding && (
            <PrimaryButton onClick={() => { setAdding(true); setError(""); }}><Plus size={16} /> New plan</PrimaryButton>
          )}
        </div>

        {adding && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_auto] gap-3 items-center p-4 rounded-xl mb-4" style={{ background: "#FAF7F2" }}>
            {fields(draft, setDraft)}
            <div className="flex gap-2">
              <PrimaryButton onClick={create} loading={saving}><Check size={16} /> Add</PrimaryButton>
              <button onClick={() => { setAdding(false); setDraft(EMPTY); }} className="p-2.5 rounded-xl border" style={{ borderColor: "#DFC5A0" }} aria-label="Cancel">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {!plans ? (
          !error && <Spinner />
        ) : plans.length === 0 && !adding ? (
          <p className="py-10 text-sm text-gray-500 text-center">
            No plans yet — members cannot sponsor a post until there is at least one active plan.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b" style={{ borderColor: "#E8D5BC" }}>
                <th className="py-3 pr-4">Plan</th>
                <th className="py-3 pr-4">Duration</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#E8D5BC" }}>
              {plans.map((p) =>
                editing === p.id ? (
                  <tr key={p.id}>
                    <td colSpan={5} className="py-3">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_auto] gap-3 items-center">
                        {fields(edit, setEdit)}
                        <div className="flex gap-2">
                          <PrimaryButton onClick={() => saveEdit(p.id)} loading={saving}><Check size={16} /> Save</PrimaryButton>
                          <button onClick={() => setEditing(null)} className="p-2.5 rounded-xl border" style={{ borderColor: "#DFC5A0" }} aria-label="Cancel">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id} className={saving ? "opacity-60" : ""}>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "#0D2B1E" }}>{p.name}</td>
                    <td className="py-3 pr-4">{p.durationDays} days</td>
                    <td className="py-3 pr-4 font-semibold">{formatRupees(p.price)}</td>
                    <td className="py-3 pr-4">{p.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="gray">Disabled</Badge>}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(p)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F0E6D3]" style={{ color: "#1B4332" }}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => toggle(p)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F0E6D3]" style={{ color: p.isActive ? "#991B1B" : "#1B4332" }}>
                        {p.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  );
}
