// Reports & moderation: typed calls for the admin panel.
//
// Same shape as ads.ts — the admin signs in through the ordinary /login (OTP)
// and these go through the shared client in src/lib/api.ts, which attaches the
// token. The server checks the role AND that the administrator's own account is
// active (AdminJwtGuard), so hiding a control in this UI is never the thing
// that keeps anyone out.

import { apiGet, apiPatch, apiPost } from "@/lib/api";

export { errorMessage } from "@/lib/api";

const P = "/api/admin/panel";

/* ─────────────────────────── Vocabularies ───────────────────────────────── */

export const REPORT_STATUSES = ["open", "reviewing", "actioned", "dismissed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_PRIORITIES = ["critical", "high", "normal"] as const;
export type ReportPriority = (typeof REPORT_PRIORITIES)[number];

export const REPORT_REASONS = [
  "csae",
  "nudity_sexual",
  "harassment_bullying",
  "hate_speech",
  "violence_threats",
  "self_harm",
  "spam_scam",
  "impersonation",
  "misinformation",
  "other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_TARGET_TYPES = ["post", "comment", "story", "message", "user"] as const;
export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

export const STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Pending",
  reviewing: "Under review",
  actioned: "Actioned",
  dismissed: "Dismissed",
};

export const STATUS_TONE: Record<ReportStatus, "green" | "gold" | "red" | "gray"> = {
  open: "red",
  reviewing: "gold",
  actioned: "green",
  dismissed: "gray",
};

export const PRIORITY_TONE: Record<ReportPriority, "green" | "gold" | "red" | "gray"> = {
  critical: "red",
  high: "gold",
  normal: "gray",
};

export const REASON_LABEL: Record<ReportReason, string> = {
  csae: "Child sexual abuse or exploitation",
  nudity_sexual: "Nudity or sexual content",
  harassment_bullying: "Harassment or bullying",
  hate_speech: "Hate speech",
  violence_threats: "Violence or threats",
  self_harm: "Self-harm or suicide",
  spam_scam: "Spam or scam",
  impersonation: "Impersonation",
  misinformation: "Misinformation",
  other: "Something else",
};

export const TARGET_LABEL: Record<ReportTargetType, string> = {
  post: "Post",
  comment: "Comment",
  story: "Story",
  message: "Message",
  user: "Account",
};

/** True for a report whose media must never be rendered in this dashboard. */
export const isChildSafety = (reason: string) => reason === "csae";

/* ─────────────────────────── Types ──────────────────────────────────────── */

/** The narrow view of a member a moderator is shown. No phone, no address. */
export type ReportParty = {
  id: string;
  userName?: string;
  name?: string;
  profileUrl?: string;
} | null;

export type AdminReport = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  priority: ReportPriority;
  status: ReportStatus;
  details: string;
  /**
   * True when the server has sealed the evidence. The media is NOT included in
   * this payload at all — `evidenceMetadata` carries a `sealed` flag and a few
   * non-identifying facts instead. There is deliberately nothing here that
   * could be rendered or downloaded.
   */
  evidenceLocked: boolean;
  evidenceMetadata: Record<string, unknown>;
  reporter: ReportParty;
  targetOwner: ReportParty;
  reviewedBy: ReportParty;
  reviewedAt: string | null;
  action: string | null;
  notes: string | null;
  createdAt: string | null;
};

export type ReportPage = {
  count: number;
  page: number;
  limit: number;
  reports: AdminReport[];
};

export type ReportSummary = {
  open: number;
  reviewing: number;
  actioned: number;
  dismissed: number;
  /** Criticals still open or under review. */
  critical: number;
  total: number;
};

export type ModerationHistoryEntry = {
  id: string;
  action: string;
  actor: ReportParty;
  reason: string | null;
  metadata: Record<string, unknown>;
  createdAt: string | null;
};

export type ReportDetail = {
  report: AdminReport;
  context: { reportsOnSameTarget: number; reportsOnSameOwner: number };
  history: ModerationHistoryEntry[];
};

export type StandingChange = {
  userId: string;
  previousStatus: string;
  status: string;
  suspendedUntil: string | null;
  reason: string | null;
};

export const ACTION_LABEL: Record<string, string> = {
  report_opened: "Report opened",
  report_status_changed: "Status changed",
  evidence_metadata_accessed: "Sealed evidence metadata accessed",
  content_removed: "Content removed",
  account_suspended: "Account suspended",
  account_banned: "Account banned",
  account_reinstated: "Account reinstated",
  report_escalated: "Escalated to an authority",
};

/* ─────────────────────────── Calls ──────────────────────────────────────── */

export const reportsApi = {
  summary: () => apiGet<ReportSummary>(`${P}/reports/summary`),

  list: (query: {
    status?: ReportStatus | "";
    reason?: ReportReason | "";
    priority?: ReportPriority | "";
    targetType?: ReportTargetType | "";
    sort?: "priority" | "newest" | "oldest";
    page?: number;
    limit?: number;
  }) => apiGet<ReportPage>(`${P}/reports`, { query }),

  get: (id: string) => apiGet<ReportDetail>(`${P}/reports/${id}`),

  update: (
    id: string,
    body: { status: "reviewing" | "actioned" | "dismissed"; notes?: string; action?: string },
  ) => apiPatch<{ id: string; status: ReportStatus; previousStatus: ReportStatus }>(
    `${P}/reports/${id}`,
    body,
  ),

  suspendMember: (userId: string, body: { durationDays?: number; reason: string }) =>
    apiPost<StandingChange>(`${P}/members/${userId}/suspend`, body),

  banMember: (userId: string, body: { reason: string }) =>
    apiPost<StandingChange>(`${P}/members/${userId}/ban`, body),

  reinstateMember: (userId: string, body: { reason?: string }) =>
    apiPost<StandingChange>(`${P}/members/${userId}/reinstate`, body),
};
