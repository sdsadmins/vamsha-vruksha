"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Cloud, ListChecks, Lock } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText } from "../_components/AdminShell";
import { errorMessage, masterApi } from "../_lib/api";
import { DROPDOWN_FIELDS, SCREENS } from "../_lib/dropdowns";

type Count = { total: number; active: number };

/**
 * Every dropdown the mobile app shows, grouped by screen. Live lists show
 * counts from the server; fixed lists show the app's built-in count.
 */
export default function AdminDropdownsPage() {
  const [counts, setCounts] = useState<Record<string, Count>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const next: Record<string, Count> = {};
    for (const f of DROPDOWN_FIELDS) {
      if (f.fixed) next[f.key] = { total: f.fixed.length, active: f.fixed.length };
    }
    setCounts(next);

    Promise.all(
      DROPDOWN_FIELDS.filter((f) => f.api).map(async (f) => {
        const items = await masterApi(f.api!).listAll();
        return [f.key, { total: items.length, active: items.filter((i) => i.active).length }] as const;
      }),
    )
      .then((pairs) => {
        if (cancelled) return;
        setCounts((c) => ({ ...c, ...Object.fromEntries(pairs) }));
      })
      .catch((err) => { if (!cancelled) setError(errorMessage(err)); });

    return () => { cancelled = true; };
  }, []);

  return (
    <AdminShell title="Dropdown Options" subtitle="Master data for the mobile app's pick lists">
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6 px-1">
        <span className="flex items-center gap-1.5"><Cloud size={14} style={{ color: "#1B4332" }} /> Live: edits go to the server and reach the app on its next load.</span>
        <span className="flex items-center gap-1.5"><Lock size={14} /> Fixed: built into the app; shown for reference only.</span>
      </div>

      {SCREENS.map((screen) => {
        const fields = DROPDOWN_FIELDS.filter((f) => f.screen === screen);
        return (
          <section key={screen} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 px-1">{screen}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fields.map((f) => {
                const c = counts[f.key];
                const live = Boolean(f.api);
                return (
                  <Link key={f.key} href={`/admin/dropdowns/${f.key}`}>
                    <Card className={`p-5 h-full hover:shadow-premium transition-shadow flex flex-col ${live ? "" : "opacity-80"}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: live ? "#D8F3DC" : "#F3F4F6" }}>
                          {live ? <ListChecks size={18} style={{ color: "#1B4332" }} /> : <Lock size={18} className="text-gray-400" />}
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {live ? <Badge tone="green">Live</Badge> : <Badge tone="gray">Fixed</Badge>}
                          <Badge tone={f.kind === "enum" ? "gold" : "gray"}>{f.kind === "enum" ? "Enum" : "Text"}</Badge>
                          {f.multiSelect && <Badge tone="gray">Multi</Badge>}
                        </div>
                      </div>
                      <p className="font-bold" style={{ color: "#0D2B1E" }}>{f.name}</p>
                      <p className="text-sm text-gray-500 flex-1 mt-1">{f.description}</p>
                      <div className="flex items-center justify-between mt-4 text-sm">
                        <span className="text-gray-500">
                          {c ? <>{c.active} active{c.total !== c.active && <span className="text-gray-400"> · {c.total - c.active} hidden</span>}</> : "Loading…"}
                        </span>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: "#1B4332" }}>
                          {live ? "Manage" : "View"} <ChevronRight size={14} />
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </AdminShell>
  );
}
