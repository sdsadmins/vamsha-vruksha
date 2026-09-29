// Community (welfare) campaigns, managed from the admin panel.
//
// Only the admin may create, edit or delete campaigns; the server enforces
// this on /api/welfare/campaigns (see welfare.controller.ts), so the mobile app
// and member pages can only read and donate. The shape mirrors the server's
// campaign schema.

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

export const CAMPAIGN_STATUSES = ["active", "completed", "closed"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export type Campaign = {
  /** URL-safe unique id: lowercase letters, numbers, hyphens (3–60 chars). */
  slug: string;
  title: string;
  category: string;
  description: string;
  /** Target amount in rupees. */
  goal: number;
  /** Running total in rupees; the server increments it as donations land. */
  raised: number;
  /** ISO date (yyyy-mm-dd) or "" for open-ended. */
  endsAt: string;
  /** Emoji or cover image URL. */
  image: string;
  /** Tailwind gradient classes for the card, e.g. "from-green-800 to-green-600". */
  color: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  /** Number of donations so far (display only). */
  donors: number;
};

/** What the create/edit form collects; everything else is server-managed. */
export type CampaignInput = Pick<
  Campaign,
  "slug" | "title" | "category" | "description" | "goal" | "endsAt" | "image" | "color" | "status"
>;

/** Card gradients the web app already renders campaigns with. */
export const CAMPAIGN_COLORS: { value: string; label: string; css: string }[] = [
  { value: "from-green-800 to-green-600", label: "Forest", css: "linear-gradient(135deg, #1B4332, #2D6A4F)" },
  { value: "from-amber-700 to-amber-500", label: "Gold", css: "linear-gradient(135deg, #8B5E3C, #C4823A)" },
  { value: "from-rose-700 to-rose-500", label: "Rose", css: "linear-gradient(135deg, #9F1239, #E11D48)" },
  { value: "from-sky-800 to-sky-600", label: "Sky", css: "linear-gradient(135deg, #075985, #0284C7)" },
  { value: "from-violet-800 to-violet-600", label: "Violet", css: "linear-gradient(135deg, #5B21B6, #7C3AED)" },
  { value: "from-slate-800 to-slate-600", label: "Slate", css: "linear-gradient(135deg, #1E293B, #475569)" },
];

export function gradientCss(value: string): string {
  return CAMPAIGN_COLORS.find((c) => c.value === value)?.css ?? CAMPAIGN_COLORS[0].css;
}

export const SLUG_PATTERN = /^[a-z0-9-]{3,60}$/;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function daysLeft(endsAt: string): number | null {
  if (!endsAt) return null;
  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return null;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
}

export function formatRupees(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/* ─────────────────────────── API ───────────────────────────────────────── */

/** A campaign as GET /api/welfare/campaigns returns it (PublicCampaign). */
type ApiCampaign = {
  id: string;
  title: string;
  category: string;
  description: string;
  goal: number;
  raised: number;
  daysLeft: number | null;
  endsAt: string | null;
  backers: number;
  image: string;
  color: string;
  status: string;
};

const BASE = "/api/welfare/campaigns";

function fromApi(c: ApiCampaign): Campaign {
  const status = (CAMPAIGN_STATUSES as readonly string[]).includes(c.status)
    ? (c.status as CampaignStatus)
    : "active";
  return {
    slug: c.id,
    title: c.title,
    category: c.category,
    description: c.description,
    goal: c.goal,
    raised: c.raised,
    endsAt: c.endsAt ? c.endsAt.slice(0, 10) : "",
    image: c.image,
    color: c.color,
    status,
    donors: c.backers,
    createdAt: "",
    updatedAt: "",
  };
}

/** The create/update body: same fields as the server's DTOs. */
function toApi(input: CampaignInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    description: input.description,
    goal: input.goal,
    endsAt: input.endsAt || null,
    image: input.image,
    color: input.color,
    status: input.status,
  };
}

export async function loadCampaigns(): Promise<Campaign[]> {
  return (await apiGet<ApiCampaign[]>(BASE)).map(fromApi);
}

export async function getCampaign(slug: string): Promise<Campaign> {
  return fromApi(await apiGet<ApiCampaign>(`${BASE}/${slug}`));
}

export async function createCampaign(input: CampaignInput): Promise<Campaign> {
  // The server always creates as "active"; a different status is applied
  // with a follow-up edit so the create body matches CreateCampaignDto.
  const { status, ...rest } = toApi(input);
  const created = fromApi(await apiPost<ApiCampaign>(BASE, rest));
  if (status !== "active") {
    return fromApi(await apiPatch<ApiCampaign>(`${BASE}/${created.slug}`, { status }));
  }
  return created;
}

export async function updateCampaign(slug: string, input: CampaignInput): Promise<Campaign> {
  return fromApi(await apiPatch<ApiCampaign>(`${BASE}/${slug}`, toApi(input)));
}

export async function setCampaignStatus(slug: string, status: CampaignStatus): Promise<Campaign> {
  return fromApi(await apiPatch<ApiCampaign>(`${BASE}/${slug}`, { status }));
}

export async function deleteCampaign(slug: string): Promise<void> {
  await apiDelete<{ success: true }>(`${BASE}/${slug}`);
}
