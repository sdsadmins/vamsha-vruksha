"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar, IndianRupee, Save } from "lucide-react";
import { Card, ErrorText, PrimaryButton, inputClass, inputStyle } from "./AdminShell";
import {
  CAMPAIGN_COLORS,
  CAMPAIGN_STATUSES,
  SLUG_PATTERN,
  daysLeft,
  formatRupees,
  gradientCss,
  slugify,
  type Campaign,
  type CampaignInput,
} from "../_lib/campaigns";
import { fixedOptions } from "../_lib/dropdowns";

interface Props {
  /** Existing campaign when editing; omit to create. */
  initial?: Campaign;
  onSubmit: (input: CampaignInput) => void;
  submitLabel: string;
  saving?: boolean;
  error?: string;
}

const EMPTY: CampaignInput = {
  slug: "",
  title: "",
  category: "",
  description: "",
  goal: 0,
  endsAt: "",
  image: "",
  color: CAMPAIGN_COLORS[0].value,
  status: "active",
};

const EMOJIS = ["🏛️", "🪔", "🎓", "❤️", "🏥", "🌳", "📚", "🍲", "🛕", "💧", "🧑‍🤝‍🧑", "🎉"];

/**
 * Create / edit form for a community campaign, with a live card preview that
 * matches how the welfare page renders campaigns to members.
 */
export default function CampaignForm({ initial, onSubmit, submitLabel, saving, error }: Props) {
  const [form, setForm] = useState<CampaignInput>(
    initial
      ? {
          slug: initial.slug,
          title: initial.title,
          category: initial.category,
          description: initial.description,
          goal: initial.goal,
          endsAt: initial.endsAt,
          image: initial.image,
          color: initial.color || CAMPAIGN_COLORS[0].value,
          status: initial.status,
        }
      : EMPTY,
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [localError, setLocalError] = useState("");

  // Category choices come from the same master list the mobile app's welfare
  // screen uses, so the two never drift apart.
  const [categories, setCategories] = useState<{ value: string; label: string; image?: string }[]>([]);
  useEffect(() => {
    setCategories(fixedOptions("welfare-category").filter((o) => o.active));
  }, []);

  const set = <K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onTitle = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (form.title.trim().length < 3) return setLocalError("Title must be at least 3 characters");
    if (!SLUG_PATTERN.test(form.slug)) return setLocalError("Campaign id must be 3–60 characters: lowercase letters, numbers or hyphens");
    if (!form.category) return setLocalError("Pick a category");
    if (!Number.isInteger(form.goal) || form.goal < 1) return setLocalError("Goal must be a whole number of rupees, at least 1");
    if (form.description.length > 2000) return setLocalError("Story must be at most 2000 characters");
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim(), image: form.image.trim() });
  };

  const categoryLabel = useMemo(
    () => categories.find((c) => c.value === form.category)?.label ?? form.category,
    [categories, form.category],
  );
  const raised = initial?.raised ?? 0;
  const pct = form.goal > 0 ? Math.min(100, Math.round((raised / form.goal) * 100)) : 0;
  const left = daysLeft(form.endsAt);

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {(error || localError) && <ErrorText>{error || localError}</ErrorText>}

        <Card className="p-6 space-y-5">
          <h2 className="font-bold" style={{ color: "#0D2B1E" }}>Basics</h2>

          <Field label="Campaign title">
            <input value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Samaj Bhavan Renovation" className={inputClass} style={inputStyle} maxLength={120} autoFocus />
          </Field>

          <Field label="Campaign id (URL)" hint="Lowercase letters, numbers and hyphens. Used in donation links; avoid changing it once live.">
            <input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }}
              placeholder="samaj-bhavan"
              className={`${inputClass} font-mono text-xs`}
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.image ? `${c.image} ` : ""}{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value as CampaignInput["status"])} className={inputClass} style={inputStyle}>
                {CAMPAIGN_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Campaign story" hint={`${form.description.length}/2000`}>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              placeholder="Describe the need, what the funds will do, and the impact on the community…"
              className={`${inputClass} resize-y`}
              style={inputStyle}
              maxLength={2000}
            />
          </Field>
        </Card>

        <Card className="p-6 space-y-5">
          <h2 className="font-bold" style={{ color: "#0D2B1E" }}>Fundraising</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Goal (₹)">
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={form.goal || ""}
                  onChange={(e) => set("goal", Math.floor(Number(e.target.value) || 0))}
                  placeholder="500000"
                  className={`${inputClass} pl-9`}
                  style={inputStyle}
                />
              </div>
              {form.goal > 0 && <p className="text-xs text-gray-500 mt-1">{formatRupees(form.goal)}</p>}
            </Field>
            <Field label="End date" hint="Leave empty for an open-ended campaign.">
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} className={`${inputClass} pl-9`} style={inputStyle} />
              </div>
            </Field>
          </div>
          {initial && (
            <p className="text-xs text-gray-500 rounded-lg px-3 py-2" style={{ background: "#FAF7F2" }}>
              Raised so far: <strong>{formatRupees(initial.raised)}</strong> from {initial.donors} donors. This is updated by donations, not edited here.
            </p>
          )}
        </Card>

        <Card className="p-6 space-y-5">
          <h2 className="font-bold" style={{ color: "#0D2B1E" }}>Appearance</h2>
          <Field label="Cover" hint="Pick an emoji or paste an image URL.">
            <div className="flex flex-wrap gap-2 mb-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => set("image", e)}
                  className="w-10 h-10 rounded-xl border text-xl flex items-center justify-center transition-all"
                  style={form.image === e ? { borderColor: "#1B4332", background: "#D8F3DC" } : { borderColor: "#E8D5BC", background: "white" }}
                >
                  {e}
                </button>
              ))}
            </div>
            <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="🏛️ or https://…/banner.jpg" className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Card colour">
            <div className="flex flex-wrap gap-2">
              {CAMPAIGN_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => set("color", c.value)}
                  className="w-10 h-10 rounded-xl border-2 transition-all"
                  style={{ background: c.css, borderColor: form.color === c.value ? "#0D2B1E" : "transparent", outline: form.color === c.value ? "2px solid #C4823A" : "none" }}
                />
              ))}
            </div>
          </Field>
        </Card>

        <div className="flex justify-end">
          <PrimaryButton type="submit" loading={saving}><Save size={16} /> {submitLabel}</PrimaryButton>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 px-1">Preview</p>
          <div className="rounded-2xl overflow-hidden border shadow-premium bg-white" style={{ borderColor: "#E8D5BC" }}>
            <div className="h-36 flex items-center justify-center text-6xl relative" style={{ background: gradientCss(form.color) }}>
              {/^https?:\/\//.test(form.image) ? (
                <img src={form.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>{form.image || "🏛️"}</span>
              )}
              {form.status !== "active" && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90" style={{ color: "#0D2B1E" }}>
                  {form.status[0].toUpperCase() + form.status.slice(1)}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold mb-1" style={{ color: "#C4823A" }}>{categoryLabel || "Category"}</p>
              <h3 className="font-bold text-lg leading-snug mb-2" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>
                {form.title || "Campaign title"}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{form.description || "The campaign story will appear here."}</p>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#F0E6D3" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #2D6A4F, #52B788)" }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span><strong style={{ color: "#0D2B1E" }}>{formatRupees(raised)}</strong> raised</span>
                <span>of {form.goal > 0 ? formatRupees(form.goal) : "₹—"}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{pct}% funded</span>
                <span>{left === null ? "No end date" : left === 0 ? "Ended" : `${left} days left`}</span>
              </div>
              <button type="button" className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                Donate now
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
