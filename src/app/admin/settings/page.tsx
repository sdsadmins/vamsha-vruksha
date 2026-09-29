"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import AdminShell, { Card, ErrorText, PrimaryButton, Spinner } from "../_components/AdminShell";
import { adminApi, errorMessage, type AppSettings, type SignupVerification } from "../_lib/api";

const MODES: { value: SignupVerification; label: string; hint: string; icon: typeof Mail }[] = [
  { value: "email", label: "Email", hint: "A code to the inbox. Free.", icon: Mail },
  { value: "phone", label: "Phone (SMS)", hint: "An OTP by SMS. Billed per message via 2Factor.", icon: Phone },
  { value: "both", label: "Both", hint: "Email and phone must both be verified.", icon: ShieldCheck },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [mode, setMode] = useState<SignupVerification>("email");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminApi.settings()
      .then((s) => { if (!cancelled) { setSettings(s); setMode(s.signupVerification); } })
      .catch((err) => { if (!cancelled) setError(errorMessage(err)); });
    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const s = await adminApi.updateSettings(mode);
      setSettings(s);
      setNotice("Settings saved.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Settings" subtitle="Server-wide configuration">
      {error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}

      {!settings ? (
        !error && <Spinner />
      ) : (
        <Card className="p-6 max-w-2xl">
          <h2 className="font-bold mb-1" style={{ color: "#0D2B1E" }}>New member verification</h2>
          <p className="text-sm text-gray-500 mb-5">How a new account proves its contact details at registration.</p>

          <div className="space-y-3 mb-6">
            {MODES.map(({ value, label, hint, icon: Icon }) => {
              const active = mode === value;
              return (
                <label
                  key={value}
                  className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                  style={active ? { borderColor: "#1B4332", background: "#F0FBF4" } : { borderColor: "#E8D5BC" }}
                >
                  <input type="radio" name="mode" value={value} checked={active} onChange={() => setMode(value)} className="accent-[#1B4332]" />
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#D8F3DC" }}>
                    <Icon size={16} style={{ color: "#1B4332" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0D2B1E" }}>{label}</p>
                    <p className="text-xs text-gray-500">{hint}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <PrimaryButton onClick={save} loading={saving} disabled={mode === settings.signupVerification}>
            Save changes
          </PrimaryButton>
        </Card>
      )}
    </AdminShell>
  );
}
