"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";
import AdminShell, {
  Badge,
  Card,
  ErrorText,
  PrimaryButton,
  Spinner,
  inputClass,
  inputStyle,
} from "../../_components/AdminShell";
import { formatDate } from "../../_lib/api";
import {
  ACTION_LABEL,
  PRIORITY_TONE,
  REASON_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  TARGET_LABEL,
  errorMessage,
  reportsApi,
  type ReportDetail,
} from "../../_lib/reports";

const MIN_NOTES = 10;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2 py-2 text-sm">
      <span className="w-44 shrink-0 text-gray-500">{label}</span>
      <span className="font-medium" style={{ color: "#1B4332" }}>
        {children}
      </span>
    </div>
  );
}

/**
 * One report, and the enforcement that can follow from it.
 *
 * For a child-safety report the server sends no media and no media URL at all —
 * only a sealed marker and a couple of non-identifying facts. This page
 * therefore has nothing to render even if someone tried: there is no image
 * element, no link out and no download anywhere in it. Confirming the material
 * itself is a matter for law enforcement, not for this dashboard.
 */
export default function AdminReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [data, setData] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  const [notes, setNotes] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [standingReason, setStandingReason] = useState("");
  const [durationDays, setDurationDays] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      setData(await reportsApi.get(id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (label: string, fn: () => Promise<unknown>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(`${label} — done.`);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy("");
    }
  };

  const report = data?.report;
  const owner = report?.targetOwner;
  const sealed = report?.evidenceLocked === true;
  const notesTooShort = notes.trim().length < MIN_NOTES;
  const standingReasonTooShort = standingReason.trim().length < MIN_NOTES;

  if (loading) {
    return (
      <AdminShell title="Report" subtitle="Loading…">
        <Card>
          <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
            <Spinner /> Loading report…
          </div>
        </Card>
      </AdminShell>
    );
  }

  if (!report) {
    return (
      <AdminShell title="Report" subtitle="Not available">
        <Card>
          <div className="py-14 text-center">
            <ShieldAlert size={28} className="mx-auto mb-3 text-gray-400" />
            <p className="font-semibold" style={{ color: "#1B4332" }}>
              This report could not be loaded
            </p>
            {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
            <Link
              href="/admin/reports"
              className="mt-4 inline-block text-sm font-semibold hover:underline"
              style={{ color: "#2D6A4F" }}
            >
              Back to the queue
            </Link>
          </div>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Report"
      subtitle={`${REASON_LABEL[report.reason] ?? report.reason} · ${TARGET_LABEL[report.targetType] ?? report.targetType}`}
      actions={
        <Link href="/admin/reports">
          <PrimaryButton>
            <ArrowLeft size={16} /> Back to queue
          </PrimaryButton>
        </Link>
      }
    >
      {error && <ErrorText>{error}</ErrorText>}
      {notice && (
        <div
          className="mb-4 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: "#DFC5A0", background: "#F0E6D3", color: "#1B4332" }}
        >
          {notice}
        </div>
      )}

      {sealed && (
        <Card className="mb-6">
          <div className="flex gap-3">
            <Lock size={18} className="mt-0.5 shrink-0" style={{ color: "#B42318" }} />
            <div>
              <p className="font-semibold" style={{ color: "#B42318" }}>
                Evidence sealed — child safety
              </p>
              <p className="mt-1 text-sm text-gray-600">
                The reported media is deliberately not retrieved, rendered or linked
                anywhere in this dashboard. Act on the metadata below and the reporter&apos;s
                description. Confirming the material is a matter for law enforcement; your
                access to this page has been recorded.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 font-serif text-lg font-semibold" style={{ color: "#1B4332" }}>
              The report
            </h2>
            <Row label="Priority">
              <Badge tone={PRIORITY_TONE[report.priority]}>{report.priority}</Badge>
            </Row>
            <Row label="Status">
              <Badge tone={STATUS_TONE[report.status]}>{STATUS_LABEL[report.status]}</Badge>
            </Row>
            <Row label="Reason">{REASON_LABEL[report.reason] ?? report.reason}</Row>
            <Row label="What was reported">
              {TARGET_LABEL[report.targetType] ?? report.targetType}
            </Row>
            <Row label="Filed">{formatDate(report.createdAt)}</Row>
            <Row label="Reported by">
              {report.reporter?.userName ? `@${report.reporter.userName}` : "—"}
            </Row>
            <Row label="Against">{owner?.userName ? `@${owner.userName}` : "—"}</Row>
            {report.reviewedBy && (
              <Row label="Last reviewed by">
                {report.reviewedBy.userName ? `@${report.reviewedBy.userName}` : "—"} ·{" "}
                {formatDate(report.reviewedAt)}
              </Row>
            )}

            <div className="mt-4 border-t pt-4" style={{ borderColor: "#F0E6D3" }}>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Reporter&apos;s description
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {report.details?.trim() || "The reporter did not add a description."}
              </p>
            </div>

            <div className="mt-4 border-t pt-4" style={{ borderColor: "#F0E6D3" }}>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {sealed ? "Sealed metadata" : "Content metadata"}
              </p>
              <dl className="mt-2 space-y-1 text-sm text-gray-700">
                {Object.entries(report.evidenceMetadata ?? {}).length === 0 ? (
                  <p className="text-gray-500">No metadata was captured.</p>
                ) : (
                  Object.entries(report.evidenceMetadata).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="w-44 shrink-0 text-gray-500">{k}</dt>
                      <dd className="font-medium">{String(v)}</dd>
                    </div>
                  ))
                )}
              </dl>
            </div>

            {report.notes && (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "#F0E6D3" }}>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Reviewer notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{report.notes}</p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold" style={{ color: "#1B4332" }}>
              Resolve this report
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Notes are required to action or dismiss — a closed report with no reasoning
              cannot be reviewed later. The report itself is never deleted.
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What you found and what you did about it…"
              className={inputClass}
              style={inputStyle}
            />
            <input
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder='Short label, e.g. "content removed"'
              className={`${inputClass} mt-2`}
              style={inputStyle}
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                disabled={busy !== "" || report.status === "reviewing"}
                onClick={() =>
                  run("Marked under review", () =>
                    reportsApi.update(report.id, { status: "reviewing" }),
                  )
                }
                className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                style={{ borderColor: "#DFC5A0", color: "#8B5E3C" }}
              >
                {busy === "Marked under review" ? "Working…" : "Mark under review"}
              </button>

              <button
                disabled={busy !== "" || notesTooShort}
                title={notesTooShort ? `Add at least ${MIN_NOTES} characters of notes` : undefined}
                onClick={() =>
                  run(
                    "Report actioned",
                    () =>
                      reportsApi.update(report.id, {
                        status: "actioned",
                        notes: notes.trim(),
                        action: actionLabel.trim() || undefined,
                      }),
                    "Mark this report as actioned? This records your notes against it.",
                  )
                }
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: "#2D6A4F" }}
              >
                {busy === "Report actioned" ? "Working…" : "Action"}
              </button>

              <button
                disabled={busy !== "" || notesTooShort}
                title={notesTooShort ? `Add at least ${MIN_NOTES} characters of notes` : undefined}
                onClick={() =>
                  run(
                    "Report dismissed",
                    () =>
                      reportsApi.update(report.id, {
                        status: "dismissed",
                        notes: notes.trim(),
                      }),
                    "Dismiss this report as not breaching the standards?",
                  )
                }
                className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                style={{ borderColor: "#DFC5A0", color: "#6B6258" }}
              >
                {busy === "Report dismissed" ? "Working…" : "Dismiss"}
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 font-serif text-lg font-semibold" style={{ color: "#1B4332" }}>
              Pattern
            </h2>
            <Row label="Reports on this item">{data?.context.reportsOnSameTarget ?? 0}</Row>
            <Row label="Reports on this member">{data?.context.reportsOnSameOwner ?? 0}</Row>
          </Card>

          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold" style={{ color: "#1B4332" }}>
              Member standing
            </h2>
            {!owner?.id ? (
              <p className="text-sm text-gray-500">
                This report is not attributed to an account, so no enforcement can be applied
                from here.
              </p>
            ) : (
              <>
                <p className="mb-3 text-sm text-gray-600">
                  Applies to {owner.userName ? `@${owner.userName}` : "this member"}. Content,
                  reports, evidence and blocks are never deleted by these actions.
                </p>
                <textarea
                  value={standingReason}
                  onChange={(e) => setStandingReason(e.target.value)}
                  rows={3}
                  placeholder="Reason — shown to the member and written to the audit trail…"
                  className={inputClass}
                  style={inputStyle}
                />
                <input
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  placeholder="Days (leave blank = indefinite)"
                  className={`${inputClass} mt-2`}
                  style={inputStyle}
                />

                <div className="mt-3 space-y-2">
                  <button
                    disabled={busy !== "" || standingReasonTooShort}
                    title={
                      standingReasonTooShort
                        ? `Add at least ${MIN_NOTES} characters explaining why`
                        : undefined
                    }
                    onClick={() =>
                      run(
                        "Member suspended",
                        () =>
                          reportsApi.suspendMember(owner.id, {
                            reason: standingReason.trim(),
                            ...(durationDays
                              ? { durationDays: Number(durationDays) }
                              : {}),
                          }),
                        durationDays
                          ? `Suspend this member for ${durationDays} day(s)?`
                          : "Suspend this member indefinitely? It stays in force until someone reinstates them.",
                      )
                    }
                    className="w-full rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                    style={{ borderColor: "#DFC5A0", color: "#8B5E3C" }}
                  >
                    {busy === "Member suspended" ? "Working…" : "Suspend"}
                  </button>

                  <button
                    disabled={busy !== "" || standingReasonTooShort}
                    title={
                      standingReasonTooShort
                        ? `Add at least ${MIN_NOTES} characters explaining why`
                        : undefined
                    }
                    onClick={() =>
                      run(
                        "Member banned",
                        () => reportsApi.banMember(owner.id, { reason: standingReason.trim() }),
                        "Ban this member? There is no expiry — only a reinstatement lifts it.",
                      )
                    }
                    className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    style={{ background: "#B42318" }}
                  >
                    {busy === "Member banned" ? "Working…" : "Ban"}
                  </button>

                  <button
                    disabled={busy !== ""}
                    onClick={() =>
                      run(
                        "Member reinstated",
                        () =>
                          reportsApi.reinstateMember(owner.id, {
                            ...(standingReason.trim()
                              ? { reason: standingReason.trim() }
                              : {}),
                          }),
                        "Reinstate this member and clear the restriction?",
                      )
                    }
                    className="w-full rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                    style={{ borderColor: "#DFC5A0", color: "#2D6A4F" }}
                  >
                    {busy === "Member reinstated" ? "Working…" : "Reinstate"}
                  </button>
                </div>
              </>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-serif text-lg font-semibold" style={{ color: "#1B4332" }}>
              Moderation history
            </h2>
            {(data?.history.length ?? 0) === 0 ? (
              <p className="text-sm text-gray-500">
                Nothing recorded against this report yet.
              </p>
            ) : (
              <ol className="space-y-3">
                {data!.history.map((h) => (
                  <li key={h.id} className="border-l-2 pl-3" style={{ borderColor: "#DFC5A0" }}>
                    <p className="text-sm font-semibold" style={{ color: "#1B4332" }}>
                      {ACTION_LABEL[h.action] ?? h.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {h.actor?.userName ? `@${h.actor.userName}` : "—"} ·{" "}
                      {formatDate(h.createdAt)}
                    </p>
                    {h.reason && (
                      <p className="mt-1 whitespace-pre-wrap text-xs text-gray-600">
                        {h.reason}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
