"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Check, Eye, EyeOff, ImagePlus, Lock, Pencil, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import AdminShell, { Badge, Card, ErrorText, PrimaryButton, Spinner, inputClass, inputStyle } from "../../_components/AdminShell";
import { errorMessage, masterApi, type MasterItem } from "../../_lib/api";
import { fixedOptions, getField, type DropdownOption } from "../../_lib/dropdowns";

const toOption = (m: MasterItem): DropdownOption => ({
  id: m.id,
  value: m.value,
  label: m.name,
  image: m.image || undefined,
  active: m.active,
});

/**
 * Manage one dropdown's options. Live fields talk to /api/master/<route> and
 * every action is saved immediately; fixed fields are shown read-only.
 */
export default function AdminDropdownDetailPage() {
  const { key } = useParams<{ key: string }>();
  const field = useMemo(() => getField(key), [key]);
  const api = useMemo(() => (field?.api ? masterApi(field.api) : null), [field]);
  const isEnum = field?.kind === "enum";

  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);

  // Add form
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState("");

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editImage, setEditImage] = useState("");

  const load = useCallback(async () => {
    if (!field) return;
    if (!api) {
      setOptions(fixedOptions(key));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setOptions((await api.listAll()).map(toOption));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [api, field, key]);

  useEffect(() => { void load(); }, [load]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2000);
  };

  /** Run one server action, then refresh the list from the server. */
  const run = async (action: () => Promise<unknown>, done: string) => {
    if (!api) return;
    setBusy(true);
    setError("");
    try {
      await action();
      setOptions((await api.listAll()).map(toOption));
      flash(done);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Upload a picture file to the server (S3) and hand back its URL. The URL
   * then goes into the image field, and is saved with the entry like a typed
   * URL would be.
   */
  const uploadImage = async (file: File, onUrl: (url: string) => void) => {
    if (!api) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller");
      return;
    }
    setUploading(true);
    setError("");
    try {
      onUrl(await api.uploadImage(file));
      flash("Image uploaded. Save the entry to keep it.");
    } catch (err) {
      setError(errorMessage(err, "Image upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!api) return;
    const label = (isEnum ? newLabel : newValue).trim();
    const value = isEnum ? newValue.trim().toUpperCase().replace(/\s+/g, "_") : label;
    if (!value || !label) {
      setError(isEnum ? "Enter both a key and a label" : "Enter a value");
      return;
    }
    void run(
      () => api.create({ name: label, value, image: newImage.trim() || undefined }),
      "Added.",
    ).then(() => { setNewValue(""); setNewLabel(""); setNewImage(""); });
  };

  const startEdit = (o: DropdownOption) => {
    setEditingId(o.id);
    setEditValue(o.value);
    setEditLabel(o.label);
    setEditImage(o.image ?? "");
    setError("");
  };

  const commitEdit = () => {
    if (!api || !editingId) return;
    const label = editLabel.trim();
    const value = isEnum ? editValue.trim() : label;
    if (!value || !label) {
      setError("Value cannot be empty");
      return;
    }
    const id = editingId;
    void run(() => api.update(id, { name: label, value, image: editImage.trim() }), "Saved.")
      .then(() => setEditingId(null));
  };

  const move = (index: number, dir: -1 | 1) => {
    if (!api) return;
    const target = index + dir;
    if (target < 0 || target >= options.length) return;
    const ids = options.map((o) => o.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(() => api.reorder(ids), "Reordered.");
  };

  const toggle = (o: DropdownOption) =>
    api && void run(() => api.update(o.id, { active: !o.active }), o.active ? "Hidden from app." : "Visible in app.");

  const remove = (o: DropdownOption) => {
    if (!api) return;
    if (!window.confirm(`Delete "${o.label}"? Members who already picked it keep their saved value.`)) return;
    void run(() => api.remove(o.id), "Deleted.");
  };

  const visible = filter
    ? options.filter((o) => `${o.value} ${o.label}`.toLowerCase().includes(filter.toLowerCase()))
    : options;

  if (!field) {
    return (
      <AdminShell title="Dropdown not found">
        <ErrorText>No dropdown field named &quot;{key}&quot;.</ErrorText>
        <Link href="/admin/dropdowns" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: "#1B4332" }}>
          <ArrowLeft size={16} /> All dropdowns
        </Link>
      </AdminShell>
    );
  }

  const readOnly = !api;

  return (
    <AdminShell
      title={field.name}
      subtitle={`${field.screen} · ${options.filter((o) => o.active).length} active options`}
      actions={
        <>
          <Link href="/admin/dropdowns" className="hidden sm:flex items-center gap-1 text-sm font-semibold mr-2" style={{ color: "#1B4332" }}>
            <ArrowLeft size={16} /> Back
          </Link>
          {api && (
            <button onClick={load} disabled={busy} className="p-2.5 rounded-xl border text-gray-600 hover:bg-white disabled:opacity-50" style={{ borderColor: "#DFC5A0" }} title="Refresh">
              <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
            </button>
          )}
        </>
      }
    >
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}
      {readOnly && (
        <div className="flex gap-3 rounded-2xl border px-4 py-3 mb-6 text-sm" style={{ background: "#F3F4F6", borderColor: "#E5E7EB", color: "#4B5563" }}>
          <Lock size={18} className="shrink-0 mt-0.5" />
          <p>This list is built into the app{isEnum ? " and tied to a server enum" : ""}. It is shown for reference and cannot be edited here yet.</p>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 ${readOnly ? "lg:grid-cols-3" : "lg:grid-cols-3"}`}>
        {/* Options list */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#E8D5BC" }}>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{field.description}</p>
              <div className="flex gap-1.5 mt-2">
                {field.multiSelect && <Badge tone="gray">Multi-select</Badge>}
                {field.allowsImage && <Badge tone="gray">With image</Badge>}
              </div>
            </div>
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter…" className={`${inputClass} sm:w-48`} style={inputStyle} />
          </div>

          {loading ? (
            <Spinner />
          ) : visible.length === 0 ? (
            <p className="px-5 py-12 text-sm text-gray-500 text-center">
              {filter ? "No options match." : api ? "No options yet. Add the first one, or run npm run seed:master on the server." : "No options."}
            </p>
          ) : (
            <ul className={`divide-y ${busy ? "opacity-60 pointer-events-none" : ""}`} style={{ borderColor: "#E8D5BC" }}>
              {visible.map((o) => {
                const index = options.indexOf(o);
                const editing = editingId === o.id;
                const img = editing ? editImage : o.image;
                return (
                  <li key={o.id} className={`px-5 py-3 flex items-center gap-3 ${o.active ? "" : "opacity-50"}`}>
                    <span className="w-6 text-xs text-gray-400 text-right shrink-0">{index + 1}</span>

                    {field.allowsImage && (
                      <span className="w-9 h-9 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 text-lg" style={{ borderColor: "#E8D5BC", background: "#FAF7F2" }}>
                        {img ? (/^https?:\/\//.test(img) ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span>{img}</span>) : <span className="text-gray-300 text-xs">—</span>}
                      </span>
                    )}

                    {editing ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {isEnum && <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className={`${inputClass} font-mono text-xs`} style={inputStyle} placeholder="KEY" />}
                        <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className={inputClass} style={inputStyle} placeholder="Label" autoFocus onKeyDown={(e) => e.key === "Enter" && commitEdit()} />
                        {field.allowsImage && (
                          <div className="sm:col-span-2">
                            <ImageField
                              value={editImage}
                              onChange={setEditImage}
                              canUpload={Boolean(field.imageUpload)}
                              uploading={uploading}
                              onFile={(f) => uploadImage(f, setEditImage)}
                              compact
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: "#0D2B1E" }}>{o.label}</p>
                        {isEnum && <p className="text-xs font-mono text-gray-400 truncate">{o.value}</p>}
                      </div>
                    )}

                    {!o.active && !editing && <Badge tone="gray">Hidden</Badge>}

                    {!readOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        {editing ? (
                          <>
                            <IconBtn title="Save" onClick={commitEdit}><Check size={15} /></IconBtn>
                            <IconBtn title="Cancel" onClick={() => setEditingId(null)}><X size={15} /></IconBtn>
                          </>
                        ) : (
                          <>
                            <IconBtn title="Move up" disabled={index === 0 || Boolean(filter)} onClick={() => move(index, -1)}><ArrowUp size={15} /></IconBtn>
                            <IconBtn title="Move down" disabled={index === options.length - 1 || Boolean(filter)} onClick={() => move(index, 1)}><ArrowDown size={15} /></IconBtn>
                            <IconBtn title={o.active ? "Hide from app" : "Show in app"} onClick={() => toggle(o)}>{o.active ? <Eye size={15} /> : <EyeOff size={15} />}</IconBtn>
                            <IconBtn title="Edit" onClick={() => startEdit(o)}><Pencil size={15} /></IconBtn>
                            <IconBtn title="Delete" danger onClick={() => remove(o)}><Trash2 size={15} /></IconBtn>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Add form + preview */}
        <div className="space-y-6">
          {!readOnly && (
            <Card className="p-5">
              <h2 className="font-bold mb-1" style={{ color: "#0D2B1E" }}>Add option</h2>
              <p className="text-xs text-gray-500 mb-4">
                {isEnum
                  ? "The key is what the server stores (UPPER_SNAKE_CASE). The label is what members see."
                  : "The text is saved exactly as typed."}
              </p>
              <form onSubmit={add} className="space-y-3">
                {isEnum ? (
                  <>
                    <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Key, e.g. WIDOWED" className={`${inputClass} font-mono text-xs`} style={inputStyle} />
                    <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label, e.g. Widowed" className={inputClass} style={inputStyle} />
                  </>
                ) : (
                  <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder={`New ${field.name.toLowerCase()}`} className={inputClass} style={inputStyle} />
                )}
                {field.allowsImage && (
                  <ImageField
                    value={newImage}
                    onChange={setNewImage}
                    canUpload={Boolean(field.imageUpload)}
                    uploading={uploading}
                    onFile={(f) => uploadImage(f, setNewImage)}
                  />
                )}
                <PrimaryButton type="submit" className="w-full" loading={busy} disabled={uploading}><Plus size={16} /> Add to list</PrimaryButton>
              </form>
              {isEnum && (
                <p className="text-xs mt-3 rounded-lg px-3 py-2" style={{ background: "#FBF6EE", color: "#8B5E3C" }}>
                  A new key also has to be added to the server enum before the app can save it.
                </p>
              )}
            </Card>
          )}

          <Card className="p-5">
            <h2 className="font-bold mb-3" style={{ color: "#0D2B1E" }}>Preview in app</h2>
            <div className="rounded-2xl border p-4" style={{ borderColor: "#E8D5BC", background: "#FAF7F2" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#1B4332" }}>{field.name}</p>
              <div className="rounded-xl border bg-white px-3 py-2.5 text-sm flex items-center justify-between" style={{ borderColor: "#DFC5A0" }}>
                <span className="text-gray-400">Select {field.name.toLowerCase()}</span>
                <span className="text-gray-400">▾</span>
              </div>
              <ul className="mt-2 rounded-xl border bg-white overflow-hidden max-h-56 overflow-y-auto" style={{ borderColor: "#DFC5A0" }}>
                {options.filter((o) => o.active).map((o) => (
                  <li key={o.id} className="px-3 py-2 text-sm flex items-center gap-2 border-b last:border-b-0" style={{ borderColor: "#F0E6D3", color: "#0D2B1E" }}>
                    {field.allowsImage && o.image && (/^https?:\/\//.test(o.image) ? <img src={o.image} alt="" className="w-5 h-5 rounded object-cover" /> : <span>{o.image}</span>)}
                    {o.label}
                  </li>
                ))}
                {!loading && options.filter((o) => o.active).length === 0 && (
                  <li className="px-3 py-3 text-xs text-gray-400 text-center">Nothing to show</li>
                )}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

/**
 * Image for an option.
 *
 * Lists with upload support (Kuladevata) accept a picture ONLY through the
 * Upload button: the file goes to the server, which stores it in S3 and hands
 * back the URL that gets saved. There is deliberately no box to paste a URL,
 * and the server refuses URLs it did not issue. Other lists keep the plain
 * text box for an emoji or URL.
 */
function ImageField({ value, onChange, canUpload, uploading, onFile, compact }: {
  value: string;
  onChange: (v: string) => void;
  canUpload: boolean;
  uploading: boolean;
  onFile: (file: File) => void;
  compact?: boolean;
}) {
  const inputId = useMemo(() => `img-${Math.random().toString(36).slice(2, 8)}`, []);
  const isUrl = /^https?:///.test(value);

  if (!canUpload) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or emoji (optional)"
        className={inputClass}
        style={inputStyle}
      />
    );
  }

  const size = compact ? "w-10 h-10" : "w-16 h-16";
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`${size} rounded-xl border flex items-center justify-center overflow-hidden shrink-0`} style={{ borderColor: "#E8D5BC", background: "#FAF7F2" }}>
          {isUrl ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={compact ? 16 : 22} className="text-gray-300" />}
        </span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <label
          htmlFor={inputId}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer hover:bg-white ${uploading ? "opacity-60 pointer-events-none" : ""}`}
          style={{ borderColor: "#DFC5A0", color: "#1B4332" }}
        >
          {uploading ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#DFC5A0", borderTopColor: "#1B4332" }} /> : <Upload size={15} />}
          <span>{uploading ? "Uploading…" : isUrl ? "Replace picture" : "Upload picture"}</span>
        </label>
        {isUrl && (
          <button type="button" onClick={() => onChange("")} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50" title="Remove picture" aria-label="Remove picture">
            <X size={15} />
          </button>
        )}
      </div>
      {!compact && <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP, up to 10 MB. Pictures can only be uploaded, not linked.</p>}
    </div>
  );
}

function IconBtn({ children, title, onClick, disabled, danger }: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-500 hover:bg-[#F0E6D3] hover:text-[#1B4332]"}`}
    >
      {children}
    </button>
  );
}
