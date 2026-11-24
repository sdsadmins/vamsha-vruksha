"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import AdminShell, {
  Badge,
  Card,
  ErrorText,
  Spinner,
  inputClass,
  inputStyle,
} from "../_components/AdminShell";
import { formatDate } from "../_lib/api";
import {
  PRIORITY_TONE,
  REASON_LABEL,
  REPORT_PRIORITIES,
  REPORT_REASONS,
  REPORT_STATUSES,
  REPORT_TARGET_TYPES,
  STATUS_LABEL,
  STATUS_TONE,
  TARGET_LABEL,
  errorMessage,
  isChildSafety,
  reportsApi,
  type ReportPage,
  type ReportPriority,
  type ReportReason,
  type ReportStatus,
  type ReportSummary,
  type ReportTargetType,
} from "../_lib/reports";

const LIMIT = 25;

/** One dashboard counter. */
function Tile({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: number | null;
  tone?: "red" | "gold";
  hint?: string;
}) {
  const color = tone === "red" ? "#B42318" : tone === "gold" ? "#8B5E3C" : "#1B4332";
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold" style={{ color }}>
        {value === null ? "—" : value}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </Card>
  );
}

/**
 * The moderation queue.
 *
 * Child-safety reports are listed and can be acted on, but their media is
 * never part of what the server sends — the row carries a sealed flag instead.
 * There is deliberately no thumbnail column.
 */
export default function AdminReportsPage() {
  const [status, setStatus] = useState<ReportStatus | "">("");
  const [reason, setReason] = useState<ReportReason | "">("");
  const [priority, setPriority] = useState<ReportPriority | "">("");
  const [targetType, setTargetType] = useState<ReportTargetType | "">("");
  const [sort, setSort] = useState<"priority" | "newest" | "oldest">("priority");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<ReportPage | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listed, counts] = await Promise.all([
        reportsApi.list({ status, reason, priority, targetType, sort, page, limit: LIMIT }),
        reportsApi.summary(),
      ]);
      setData(listed);
      setSummary(counts);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, reason, priority, targetType, sort, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.count / data.limit)) : 1;
  const rows = data?.reports ?? [];

  const resetTo = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <AdminShell
      title="Reports & Moderation"
      subtitle={
        summary
          ? `${summary.open} pending · ${summary.reviewing} under review · ${summary.critical} critical awaiting action`
          : "Member reports and enforcement"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <Tile label="Pending" value={summary?.open ?? null} tone="red" />
        <Tile label="Under review" value={summary?.reviewing ?? null} tone="gold" />
        <Tile label="Actioned" value={summary?.actioned ?? null} />
        <Tile label="Dismissed" value={summary?.dismissed ?? null} />
        <Tile
          label="Critical"
          value={summary?.critical ?? null}
          tone="red"
          hint="Child safety, not yet resolved"
        />
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => resetTo(setStatus)(e.target.value as ReportStatus | "")}
            className={`${inputClass} md:w-44`}
            style={inputStyle}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => resetTo(setPriority)(e.target.value as ReportPriority | "")}
            className={`${inputClass} md:w-40`}
            style={inputStyle}
            aria-label="Filter by priority"
          >
            <option value="">All priorities</option>
            {REPORT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={reason}
            onChange={(e) => resetTo(setReason)(e.target.value as ReportReason | "")}
            className={`${inputClass} md:w-64`}
            style={inputStyle}
            aria-label="Filter by reason"
          >
            <option value="">All reasons</option>
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {REASON_LABEL[r]}
              </option>
            ))}
          </select>

          <select
            value={targetType}
            onChange={(e) => resetTo(setTargetType)(e.target.value as ReportTargetType | "")}
            className={`${inputClass} md:w-40`}
            style={inputStyle}
            aria-label="Filter by what was reported"
          >
            <option value="">Anything reported</option>
            {REPORT_TARGET_TYPES.map((t) => (
              <option key={t} value={t}>
                {TARGET_LABEL[t]}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              resetTo(setSort)(e.target.value as "priority" | "newest" | "oldest")
            }
            className={`${inputClass} md:w-48`}
            style={inputStyle}
            aria-label="Sort order"
          >
            <option value="priority">Most urgent first</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </Card>

      {error && <ErrorText>{error}</ErrorText>}

      {loading ? (
        <Card>
          <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
            <Spinner /> Loading reports…
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <div className="py-14 text-center">
            <ShieldAlert size={28} className="mx-auto mb-3 text-gray-400" />
            <p className="font-semibold" style={{ color: "#1B4332" }}>
              Nothing to review
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {status || reason || priority || targetType
                ? "No reports match these filters."
                : "No member has reported anything yet."}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Reported</th>
                <th className="px-5 py-3">Against</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Filed</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: "#F0E6D3" }}>
                  <td className="px-5 py-3">
                    <Badge tone={PRIORITY_TONE[r.priority]}>{r.priority}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className={isChildSafety(r.reason) ? "font-semibold" : ""}>
                      {REASON_LABEL[r.reason] ?? r.reason}
                    </span>
                    {r.evidenceLocked && (
                      <span className="ml-2 text-xs text-gray-500">· sealed</span>
                    )}
                  </td>
                  <td className="px-5 py-3">{TARGET_LABEL[r.targetType] ?? r.targetType}</td>
                  <td className="px-5 py-3">
                    {r.targetOwner?.userName ? `@${r.targetOwner.userName}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(r.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/reports/${r.id}`}
                      className="text-sm font-semibold hover:underline"
                      style={{ color: "#2D6A4F" }}
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: "#F0E6D3" }}>
            <p className="text-xs text-gray-500">
              {data?.count ?? 0} report{(data?.count ?? 0) === 1 ? "" : "s"} · page {page} of{" "}
              {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border p-2 disabled:opacity-40"
                style={{ borderColor: "#DFC5A0" }}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border p-2 disabled:opacity-40"
                style={{ borderColor: "#DFC5A0" }}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
