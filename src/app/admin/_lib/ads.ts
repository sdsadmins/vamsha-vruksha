// Sponsored posts ("post campaigns"), managed from the admin panel.
//
// A member promotes one of their own posts by paying for a plan (7 / 15 / 30
// days …). The admin sets those plans — duration and price — and can see and
// stop every campaign. All routes are under /api/admin/panel/ads and need the
// admin's session token, like the rest of the panel.

import { apiGet, apiPatch, apiPost } from "@/lib/api";

const P = "/api/admin/panel/ads";

/* ─────────────────────────── Plans ─────────────────────────────────────── */

export type AdPlan = {
  id: string;
  name: string;
  durationDays: number;
  /** Whole rupees. */
  price: number;
  currency: string;
  isActive: boolean;
};

export type AdPlanInput = {
  name: string;
  durationDays: number;
  price: number;
  isActive?: boolean;
};

/* ─────────────────────────── Campaigns ─────────────────────────────────── */

export const AD_CAMPAIGN_STATUSES = [
  "pending_payment",
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const;
export type AdCampaignStatus = (typeof AD_CAMPAIGN_STATUSES)[number];

export const STATUS_LABEL: Record<AdCampaignStatus, string> = {
  pending_payment: "Awaiting payment",
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<AdCampaignStatus, "green" | "gold" | "red" | "gray"> = {
  pending_payment: "gold",
  scheduled: "gold",
  active: "green",
  completed: "gray",
  cancelled: "red",
};

export type AdCampaign = {
  id: string;
  postId: string;
  /** Present on list/detail reads (populated by the server). */
  post?: { _id: string; mediaUrls?: string[]; postType?: string; caption?: string; isDeleted?: boolean };
  userId: string;
  advertiser?: { _id: string; userName?: string; profileUrl?: string };
  plan: { id: string; name: string; durationDays: number };
  amount: number;
  currency: string;
  /** What the clock says now — an expired campaign reads "completed" even
   * before the server's sync has run. */
  status: AdCampaignStatus;
  startDate: string;
  endDate: string;
  paymentId: string | null;
  paidAt: string | null;
  targeting: {
    gender: string | null;
    ageMin: number | null;
    ageMax: number | null;
    cities: string[];
    states: string[];
    interests: string[];
  };
  frequencyCapPerUserPerDay: number;
  /** The advertiser's product / company / page a tap opens; null = none. */
  linkUrl: string | null;
  linkLabel: string | null;
  analytics: {
    impressions: number;
    /** Unique viewers. */
    reach: number;
    clicks: number;
    /** Percent, e.g. 2.5. */
    ctr: number;
    /** impressions / reach. */
    frequency: number;
    remainingMs: number;
    remainingDays: number;
  };
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
};

export type AdCampaignPage = {
  total: number;
  page: number;
  limit: number;
  campaigns: AdCampaign[];
};

/* ─────────────────────────── Calls ─────────────────────────────────────── */

export const adsApi = {
  plans: () => apiGet<AdPlan[]>(`${P}/plans`),
  createPlan: (input: AdPlanInput) => apiPost<AdPlan>(`${P}/plans`, input),
  updatePlan: (id: string, input: Partial<AdPlanInput>) =>
    apiPatch<AdPlan>(`${P}/plans/${id}`, input),

  campaigns: (query: { status?: AdCampaignStatus | ""; page?: number; limit?: number }) =>
    apiGet<AdCampaignPage>(`${P}/campaigns`, { query }),
  campaign: (id: string) => apiGet<AdCampaign>(`${P}/campaigns/${id}`),
  setFrequencyCap: (id: string, frequencyCapPerUserPerDay: number | null) =>
    apiPatch<AdCampaign>(`${P}/campaigns/${id}`, { frequencyCapPerUserPerDay }),
  cancelCampaign: (id: string) => apiPost<AdCampaign>(`${P}/campaigns/${id}/cancel`),
};

export function formatRupees(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Thumbnail for a campaign's post; videos have no poster, so show nothing. */
export function postThumb(c: AdCampaign): string {
  if (c.post?.postType === "video") return "";
  return c.post?.mediaUrls?.[0] ?? "";
}
