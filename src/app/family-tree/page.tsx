"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Search, Users, Trash2, UserPlus, TreePine, Bell,
  Check, Clock, AlertTriangle, Mail,
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { apiDelete, apiGet, apiPost, errorMessage } from "@/lib/api";

/**
 * The Vamsha Vruksha, rendered from the relationship graph.
 *
 * The server does not return a laid-out tree: it returns the people reachable
 * from the viewer over accepted relationships (`nodes`), the relationships
 * between them (`edges`), and each person's generation relative to the viewer —
 * negative for ancestors, positive for descendants. Everything below turns that
 * into positions.
 */

const RELATIONS = [
  "father", "mother", "spouse", "brother", "sister", "son", "daughter",
] as const;
type Relation = (typeof RELATIONS)[number];

interface TreeNode {
  id: string;
  name: string;
  gender: string | null;
  status: string;
  photoUrl: string;
  isPlaceholder: boolean;
  deceased: boolean;
  linkedUserId: string | null;
  generation: number;
  relationToRoot: string;
  isSelf: boolean;
  dob: string | null;
  relationshipId: string | null;
}

interface TreeEdge { from: string; to: string; relation: Relation }

interface TreeResponse {
  rootId: string;
  nodes: TreeNode[];
  edges: TreeEdge[];
  /** True when the graph was larger than the server's traversal cap. */
  truncated: boolean;
}

interface UserPreview {
  _id: string;
  userName: string;
  name: string;
  profileUrl?: string;
  samajId?: string;
  gotra?: string;
  native?: string;
  phone?: string;
}

interface PendingRequest {
  _id: string;
  relation: Relation;
  message: string;
  requester?: { name?: string; photoUrl?: string };
}

interface Invite {
  relationshipId: string;
  relation: Relation;
  message: string;
  requester?: { name?: string; photoUrl?: string };
}

interface FamilyNotification {
  _id: string;
  type: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

// ── Layout ──────────────────────────────────────────────────────────────────
const NODE_R = 42;
const COL_GAP = 190;
const ROW_GAP = 170;
const PADDING = 70;

interface Placed extends TreeNode { x: number; y: number }

/**
 * One row per generation, people spread evenly across it. Not a genealogical
 * layout — no attempt to keep couples adjacent or to avoid crossing lines —
 * but it is stable, never overlaps, and reads correctly top-to-bottom as
 * oldest-to-youngest.
 */
function layout(nodes: TreeNode[]): { placed: Placed[]; width: number; height: number } {
  if (!nodes.length) return { placed: [], width: 600, height: 400 };

  const byGeneration = new Map<number, TreeNode[]>();
  for (const n of nodes) {
    const row = byGeneration.get(n.generation) ?? [];
    row.push(n);
    byGeneration.set(n.generation, row);
  }

  const generations = [...byGeneration.keys()].sort((a, b) => a - b);
  const widest = Math.max(...[...byGeneration.values()].map(r => r.length));
  const width = Math.max(widest * COL_GAP + PADDING * 2, 640);

  const placed: Placed[] = [];
  generations.forEach((gen, rowIndex) => {
    // Self first in its row, then alphabetical — so the viewer's own node has a
    // stable position instead of jumping as relatives are added.
    const row = (byGeneration.get(gen) ?? []).sort((a, b) =>
      a.isSelf === b.isSelf ? a.name.localeCompare(b.name) : a.isSelf ? -1 : 1);
    const rowWidth = row.length * COL_GAP;
    const startX = (width - rowWidth) / 2 + COL_GAP / 2;
    row.forEach((node, i) => {
      placed.push({ ...node, x: startX + i * COL_GAP, y: PADDING + rowIndex * ROW_GAP });
    });
  });

  return {
    placed,
    width,
    height: PADDING * 2 + Math.max(generations.length - 1, 0) * ROW_GAP,
  };
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ── Node ────────────────────────────────────────────────────────────────────
function TreeNodeCircle({ node, selected, onClick }: {
  node: Placed; selected: boolean; onClick: () => void;
}) {
  const ring = node.isSelf ? "#C4823A" : node.deceased ? "#9CA3AF" : "#2D6A4F";
  const fill = node.deceased ? "#4B5563" : node.isPlaceholder ? "#6B7280" : "#1B4332";

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {selected && (
        <circle cx={node.x} cy={node.y} r={NODE_R + 8} fill="none" stroke={ring}
          strokeWidth={2} strokeDasharray="4 4" opacity={0.8} />
      )}
      <circle cx={node.x} cy={node.y} r={NODE_R} fill={fill}
        stroke={ring} strokeWidth={node.isSelf ? 4 : 2}
        opacity={node.deceased ? 0.75 : 1} />
      {node.photoUrl ? (
        <>
          <clipPath id={`clip-${node.id}`}>
            <circle cx={node.x} cy={node.y} r={NODE_R - 3} />
          </clipPath>
          <image href={node.photoUrl} x={node.x - NODE_R + 3} y={node.y - NODE_R + 3}
            width={(NODE_R - 3) * 2} height={(NODE_R - 3) * 2}
            clipPath={`url(#clip-${node.id})`} preserveAspectRatio="xMidYMid slice" />
        </>
      ) : (
        <text x={node.x} y={node.y + 6} textAnchor="middle" fill="white"
          fontSize={18} fontWeight={700}>
          {initials(node.name)}
        </text>
      )}
      <text x={node.x} y={node.y + NODE_R + 18} textAnchor="middle"
        fill="#0D2B1E" fontSize={12} fontWeight={700}>
        {node.name.length > 20 ? `${node.name.slice(0, 19)}…` : node.name}
      </text>
      <text x={node.x} y={node.y + NODE_R + 33} textAnchor="middle"
        fill="#6B7280" fontSize={10}>
        {node.relationToRoot}
      </text>
      {node.isPlaceholder && !node.deceased && (
        <text x={node.x} y={node.y + NODE_R + 46} textAnchor="middle"
          fill="#D97706" fontSize={9} fontWeight={600}>
          Not joined yet
        </text>
      )}
    </g>
  );
}

export default function FamilyTreePage() {
  const [tree, setTree]       = useState<TreeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [requests, setRequests]           = useState<PendingRequest[]>([]);
  const [invites, setInvites]             = useState<Invite[]>([]);
  const [notifications, setNotifications] = useState<FamilyNotification[]>([]);
  const [showInbox, setShowInbox]         = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const loadTree = useCallback(async () => {
    try {
      // main serves the tree at /api/family/tree with a per-node `relation`,
      // `profileUrl` and `relationshipId`; map them to the shape this page renders.
      const raw = await apiGet<{
        rootId: string;
        nodes: Array<Record<string, unknown>>;
        edges: TreeEdge[];
        truncated: boolean;
      }>("/api/family/tree");
      const nodes: TreeNode[] = raw.nodes.map((n) => ({
        id: String(n.id ?? ""),
        name: String(n.name ?? ""),
        gender: (n.gender as string | null) ?? null,
        status: String(n.status ?? ""),
        photoUrl: String(n.profileUrl ?? n.photoUrl ?? ""),
        isPlaceholder: Boolean(n.isPlaceholder),
        deceased: Boolean(n.deceased),
        linkedUserId: (n.linkedUserId as string | null) ?? null,
        generation: Number(n.generation ?? 0),
        relationToRoot: String(n.relation ?? n.relationToRoot ?? ""),
        isSelf: Boolean(n.isSelf),
        dob: (n.dob as string | null) ?? null,
        relationshipId: (n.relationshipId as string | null) ?? null,
      }));
      setTree({ rootId: raw.rootId, nodes, edges: raw.edges, truncated: raw.truncated });
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Could not load your family tree."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInbox = useCallback(async () => {
    const [reqs, invs, notes] = await Promise.all([
      apiGet<PendingRequest[]>("/api/family/requests").catch(() => []),
      apiGet<Invite[]>("/api/family/invites").catch(() => []),
      apiGet<FamilyNotification[]>("/api/family/notifications").catch(() => []),
    ]);
    setRequests(reqs);
    setInvites(invs);
    setNotifications(notes);
  }, []);

  useEffect(() => {
    void loadTree();
    void loadInbox();
  }, [loadTree, loadInbox]);

  const { placed, width, height } = useMemo(
    () => layout(tree?.nodes ?? []), [tree],
  );
  const positionById = useMemo(
    () => new Map(placed.map(p => [p.id, p])), [placed],
  );
  const selected = selectedId ? positionById.get(selectedId) ?? null : null;

  const pendingCount = requests.length + invites.length;

  const respondToRequest = async (id: string, action: "accept" | "decline") => {
    try {
      await apiPost(`/api/family/requests/${id}/${action}`);
      setRequests(r => r.filter(x => x._id !== id));
      if (action === "accept") await loadTree();
    } catch (err) {
      setLoadError(errorMessage(err, "Could not respond to that request."));
    }
  };

  const respondToInvites = async (action: "accept" | "decline") => {
    try {
      await apiPost(`/api/family/invites/${action}`);
      setInvites([]);
      if (action === "accept") await loadTree();
    } catch (err) {
      setLoadError(errorMessage(err, "Could not respond to those invitations."));
    }
  };

  const removeMember = async (relationshipId: string | null) => {
    if (!relationshipId) {
      setLoadError("This relative can't be removed from here.");
      return;
    }
    try {
      await apiDelete(`/api/family/relationships/${relationshipId}`);
      setSelectedId(null);
      await loadTree();
    } catch (err) {
      setLoadError(errorMessage(err, "Could not remove that member."));
    }
  };

  return (
    <SidebarLayout title="Vamsha Vruksha">
      {loadError && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-sm flex items-start gap-2"
          style={{ background:"#FEE2E2", borderColor:"#FCA5A5", color:"#991B1B" }}>
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
            My Family Tree
          </h2>
          <p className="text-sm text-gray-500">
            {tree ? `${tree.nodes.length} ${tree.nodes.length === 1 ? "person" : "people"} connected` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowInbox(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold"
            style={{ borderColor:"#DFC5A0", color:"#1B4332", background:"white" }}>
            <Bell size={15} /> Requests
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                style={{ background:"#DC2626" }}>
                {pendingCount}
              </span>
            )}
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            <Plus size={15} /> Add Family Member
          </button>
        </div>
      </div>

      {invites.length > 0 && (
        <div className="mb-5 rounded-2xl border p-4 flex flex-wrap items-center gap-3"
          style={{ background:"#FBF6EE", borderColor:"#DFC5A0" }}>
          <Mail size={18} style={{ color:"#8B5E3C" }} />
          <p className="text-sm flex-1" style={{ color:"#6B4226" }}>
            {invites.length === 1
              ? invites[0].message
              : `${invites.length} relatives have added you to their family tree.`}
          </p>
          <button onClick={() => respondToInvites("accept")}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background:"#1B4332" }}>
            Accept &amp; join
          </button>
          <button onClick={() => respondToInvites("decline")}
            className="px-4 py-2 rounded-xl text-sm font-semibold border"
            style={{ borderColor:"#DFC5A0", color:"#6B4226" }}>
            Decline
          </button>
        </div>
      )}

      {tree?.truncated && (
        <p className="mb-4 text-xs px-3 py-2 rounded-lg"
          style={{ background:"#FEF3C7", color:"#92400E" }}>
          Your family graph is larger than one view — only the closest relatives are shown.
        </p>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Canvas */}
        <div className="lg:col-span-2 rounded-2xl border overflow-auto"
          style={{ background:"white", borderColor:"#DFC5A0" }}>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-8 h-8 border-3 rounded-full animate-spin"
                style={{ borderColor:"#DFC5A0", borderTopColor:"#1B4332" }} />
            </div>
          ) : !tree || tree.nodes.length <= 1 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center px-8">
              <TreePine size={40} style={{ color:"#B7E4C7" }} />
              <h3 className="font-bold text-lg mt-4 mb-1"
                style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                Your tree starts with you
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-5">
                Add a parent, sibling, spouse or child. If they already have an
                account they will be asked to confirm; if not, we will hold their
                place until they join.
              </p>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                <UserPlus size={15} /> Add your first relative
              </button>
            </div>
          ) : (
            <svg viewBox={`0 0 ${width} ${height}`} width="100%"
              style={{ minHeight: 420, background:"#FDFCFA" }}>
              {tree.edges.map((e, i) => {
                const a = positionById.get(e.from);
                const b = positionById.get(e.to);
                if (!a || !b) return null;
                const isSpouse = e.relation === "spouse";
                return (
                  <line key={`${e.from}-${e.to}-${i}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isSpouse ? "#C4823A" : "#95D5B2"}
                    strokeWidth={isSpouse ? 2 : 1.5}
                    strokeDasharray={isSpouse ? "5 4" : undefined} />
                );
              })}
              {placed.map(node => (
                <TreeNodeCircle key={node.id} node={node}
                  selected={node.id === selectedId}
                  onClick={() => setSelectedId(node.id === selectedId ? null : node.id)} />
              ))}
            </svg>
          )}
        </div>

        {/* Detail panel */}
        <div className="rounded-2xl border p-5 h-fit"
          style={{ background:"white", borderColor:"#DFC5A0" }}>
          {selected ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg"
                    style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                    {selected.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selected.relationToRoot}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={16} />
                </button>
              </div>

              <dl className="space-y-2 text-sm mb-5">
                {selected.dob && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Born</dt>
                    <dd className="font-medium" style={{ color:"#0D2B1E" }}>{selected.dob}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-400">Status</dt>
                  <dd className="font-medium" style={{ color:"#0D2B1E" }}>
                    {selected.deceased ? "In remembrance"
                      : selected.linkedUserId ? "Joined the Samaj"
                      : "Awaiting their account"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Generation</dt>
                  <dd className="font-medium" style={{ color:"#0D2B1E" }}>
                    {selected.generation === 0 ? "Yours"
                      : selected.generation < 0 ? `${Math.abs(selected.generation)} above`
                      : `${selected.generation} below`}
                  </dd>
                </div>
              </dl>

              {selected.linkedUserId && (
                <Link href={`/profile/${selected.linkedUserId}`}
                  className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white mb-2"
                  style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  View full profile
                </Link>
              )}

              {!selected.isSelf && !selected.linkedUserId && (
                <button onClick={() => removeMember(selected.relationshipId)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ borderColor:"#FCA5A5", color:"#DC2626" }}>
                  <Trash2 size={14} /> Remove from tree
                </button>
              )}
              {selected.linkedUserId && !selected.isSelf && (
                <p className="text-xs text-gray-400 text-center">
                  They have their own account, so only they can leave the tree.
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Users size={28} className="mx-auto mb-3" style={{ color:"#B7E4C7" }} />
              <p className="text-sm text-gray-500">Select anyone in the tree to see their details.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddMemberModal
            onClose={() => setShowAdd(false)}
            onAdded={async () => { await loadTree(); await loadInbox(); }}
          />
        )}
        {showInbox && (
          <InboxModal
            requests={requests}
            invites={invites}
            notifications={notifications}
            onClose={() => setShowInbox(false)}
            onRespond={respondToRequest}
            onRespondInvites={respondToInvites}
          />
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}

// ── Add member ──────────────────────────────────────────────────────────────

type AddMode = "search" | "invite" | "deceased";

function AddMemberModal({ onClose, onAdded }: {
  onClose: () => void;
  onAdded: () => Promise<void>;
}) {
  const [relation, setRelation] = useState<Relation>("father");
  const [mode, setMode] = useState<AddMode>("search");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string>("");

  // Search-an-account mode
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserPreview[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<UserPreview | null>(null);

  // Placeholder / deceased mode. dob is required by the server for both.
  const [form, setForm] = useState({
    name: "", gender: "M", phone: "", dob: "",
    dod: "", placeOfDeath: "", biography: "",
  });

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError("");
    try {
      // Digits are a phone number, everything else is treated as a name.
      const isPhone = /^\d{10}$/.test(q);
      const found = await apiGet<UserPreview[]>("/api/family/search", {
        query: isPhone ? { phone: q, limit: 10 } : { name: q, limit: 10 },
      });
      setResults(found);
      if (!found.length) setError("No account matches that. You can invite them instead.");
    } catch (err) {
      setError(errorMessage(err, "Search failed."));
    } finally {
      setSearching(false);
    }
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const body =
        mode === "search"
          ? { relation, targetUserId: picked?._id }
          : {
              relation,
              name: form.name.trim(),
              gender: form.gender,
              dob: form.dob,
              phone: form.phone || undefined,
              status: mode === "deceased" ? "deceased" : "alive",
              ...(mode === "deceased" ? {
                dod: form.dod || undefined,
                placeOfDeath: form.placeOfDeath || undefined,
                biography: form.biography || undefined,
              } : {}),
            };

      const res = await apiPost<{ mode: string }>("/api/family/members", body);
      await onAdded();

      // What happened next differs by mode, and saying so matters: a pending
      // request is NOT yet in the tree.
      setResult(
        res.mode === "request"
          ? "Request sent. They will appear in your tree once they accept."
          : res.mode === "invite"
          ? "Invitation created. They join your tree when they register with that phone number."
          : "Added to your tree.",
      );
    } catch (err) {
      setError(errorMessage(err, "Could not add that member."));
    } finally {
      setSaving(false);
    }
  };

  const canSubmit =
    mode === "search" ? Boolean(picked) : Boolean(form.name.trim() && form.dob);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.5)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.94, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.94, opacity:0 }}
        className="rounded-2xl p-7 w-full max-w-lg overflow-y-auto"
        style={{ background:"white", maxHeight:"90vh" }}
        onClick={e => e.stopPropagation()}>

        {result ? (
          <div className="text-center py-4">
            <Check size={44} className="mx-auto mb-4" style={{ color:"#1B4332" }} />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Done</h3>
            <p className="text-gray-500 text-sm mb-6">{result}</p>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background:"#1B4332" }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
                Add a Family Member
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
            </div>

            <label className="text-sm font-semibold block mb-2" style={{ color:"#1B4332" }}>
              They are my…
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {RELATIONS.map(r => (
                <button key={r} onClick={() => setRelation(r)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors"
                  style={relation === r
                    ? { background:"#1B4332", color:"white", borderColor:"#1B4332" }
                    : { borderColor:"#DFC5A0", color:"#374151" }}>
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background:"#EDE8DF" }}>
              {([
                { key:"search",   label:"Already a member" },
                { key:"invite",   label:"Not joined yet" },
                { key:"deceased", label:"In remembrance" },
              ] as const).map(({ key, label }) => (
                <button key={key} onClick={() => { setMode(key); setError(""); }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={mode === key
                    ? { background:"white", color:"#0D2B1E", boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }
                    : { color:"#6B7280" }}>
                  {label}
                </button>
              ))}
            </div>

            {mode === "search" ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  They will be asked to confirm the relationship before it appears in either tree.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && search()}
                      placeholder="Name or 10-digit phone number"
                      className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                  <button onClick={search} disabled={searching || !query.trim()}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background:"#1B4332" }}>
                    {searching ? "…" : "Search"}
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {results.map(u => (
                    <button key={u._id} onClick={() => setPicked(u)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors"
                      style={picked?._id === u._id
                        ? { borderColor:"#1B4332", background:"#F0FBF4" }
                        : { borderColor:"#DFC5A0", background:"white" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                        style={{ background:"linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
                        {initials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color:"#0D2B1E" }}>{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          @{u.userName}{u.native ? ` · ${u.native}` : ""}
                        </p>
                      </div>
                      {picked?._id === u._id && <Check size={16} className="ml-auto" style={{ color:"#1B4332" }} />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  {mode === "invite"
                    ? "We hold their place in your tree. When they register with this phone number, they are asked to confirm and their node becomes their account."
                    : "Added to your tree straight away — no confirmation needed."}
                </p>
                <div>
                  <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Full name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name:e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                    style={{ borderColor:"#DFC5A0" }} placeholder="e.g. Ramachandra Suvarna" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Gender</label>
                    <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender:e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Date of birth *</label>
                    <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob:e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} />
                  </div>
                </div>
                {mode === "invite" && (
                  <div>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>
                      Phone <span className="text-gray-400 font-normal">— how we match them when they join</span>
                    </label>
                    <input value={form.phone} inputMode="numeric"
                      onChange={e => setForm(p => ({ ...p, phone:e.target.value.replace(/\D/g,"").slice(0,10) }))}
                      className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                      style={{ borderColor:"#DFC5A0" }} placeholder="9876543210" />
                  </div>
                )}
                {mode === "deceased" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Date of passing</label>
                        <input type="date" value={form.dod} onChange={e => setForm(p => ({ ...p, dod:e.target.value }))}
                          className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                          style={{ borderColor:"#DFC5A0" }} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Place</label>
                        <input value={form.placeOfDeath} onChange={e => setForm(p => ({ ...p, placeOfDeath:e.target.value }))}
                          className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                          style={{ borderColor:"#DFC5A0" }} placeholder="e.g. Kumta" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color:"#1B4332" }}>Remembrance</label>
                      <textarea value={form.biography} rows={3}
                        onChange={e => setForm(p => ({ ...p, biography:e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none resize-none"
                        style={{ borderColor:"#DFC5A0" }}
                        placeholder="A few lines about their life" />
                    </div>
                  </>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

            <button onClick={submit} disabled={saving || !canSubmit}
              className="w-full mt-5 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background:"linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : mode === "search" ? "Send request"
                : mode === "invite" ? "Create invitation"
                : "Add to tree"}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Requests / invites / notifications ──────────────────────────────────────

function InboxModal({ requests, invites, notifications, onClose, onRespond, onRespondInvites }: {
  requests: PendingRequest[];
  invites: Invite[];
  notifications: FamilyNotification[];
  onClose: () => void;
  onRespond: (id: string, action: "accept" | "decline") => Promise<void>;
  onRespondInvites: (action: "accept" | "decline") => Promise<void>;
}) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.5)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.94, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.94, opacity:0 }}
        className="rounded-2xl p-7 w-full max-w-lg overflow-y-auto"
        style={{ background:"white", maxHeight:"85vh" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold" style={{ fontFamily:"'Playfair Display', serif", color:"#0D2B1E" }}>
            Family Requests
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        {invites.length > 0 && (
          <section className="mb-6">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-3">INVITATIONS TO YOU</h4>
            <div className="rounded-xl border p-4" style={{ background:"#FBF6EE", borderColor:"#DFC5A0" }}>
              {invites.map(inv => (
                <p key={inv.relationshipId} className="text-sm mb-2" style={{ color:"#6B4226" }}>
                  {inv.message}
                </p>
              ))}
              <div className="flex gap-2 mt-3">
                <button onClick={() => onRespondInvites("accept")}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:"#1B4332" }}>
                  Accept all
                </button>
                <button onClick={() => onRespondInvites("decline")}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border"
                  style={{ borderColor:"#DFC5A0", color:"#6B4226" }}>
                  Decline
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mb-6">
          <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-3">AWAITING YOUR APPROVAL</h4>
          {requests.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing waiting on you.</p>
          ) : (
            <div className="space-y-2">
              {requests.map(req => (
                <div key={req._id} className="rounded-xl border p-4" style={{ borderColor:"#DFC5A0" }}>
                  <p className="text-sm mb-3" style={{ color:"#0D2B1E" }}>{req.message}</p>
                  <div className="flex gap-2">
                    <button onClick={() => onRespond(req._id, "accept")}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:"#1B4332" }}>
                      Accept
                    </button>
                    <button onClick={() => onRespond(req._id, "decline")}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold border"
                      style={{ borderColor:"#DFC5A0", color:"#6B7280" }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-3">RECENT</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 10).map(n => (
                <div key={n._id} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Clock size={13} className="mt-1 shrink-0 text-gray-300" />
                  <span>{n.message}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </motion.div>
  );
}
