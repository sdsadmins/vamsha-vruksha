"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ShieldCheck, Check, AlertTriangle } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { apiGet, apiPatch, errorMessage } from "@/lib/api";

type Mode = "email" | "phone" | "both";

interface Settings {
  signupVerification: Mode;
  requiresEmail: boolean;
  requiresPhone: boolean;
}

const OPTIONS: {
  mode: Mode;
  label: string;
  detail: string;
  cost: string;
  icon: typeof Mail;
}[] = [
  {
    mode: "email",
    label: "Email only",
    detail: "A code to their inbox. New members give an email address.",
    cost: "Free to send",
    icon: Mail,
  },
  {
    mode: "phone",
    label: "Phone only",
    detail: "A code by SMS to the number they register with.",
    cost: "Billed per SMS · needs 2Factor credit",
    icon: Phone,
  },
  {
    mode: "both",
    label: "Email and phone",
    detail: "Both codes in one registration. Strictest, and slowest to complete.",
    cost: "Billed per SMS · needs 2Factor credit",
    icon: ShieldCheck,
  },
];

export default function ElderSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState<Mode | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<Settings>("/api/admin/settings")
      .then(setSettings)
      .catch((err) => setError(errorMessage(err, "Could not load settings.")));
  }, []);

  const choose = async (mode: Mode) => {
    if (mode === settings?.signupVerification) return;
    setSaving(mode);
    setError("");
    setSaved(false);
    try {
      const next = await apiPatch<Settings>("/api/admin/settings", {
        signupVerification: mode,
      });
      setSettings(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(errorMessage(err, "Could not save that change."));
    } finally {
      setSaving(null);
    }
  };

  return (
    <SidebarLayout title="Settings" requiredRole="elder">
      <div className="max-w-2xl">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
        >
          New member verification
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          What someone must prove before an account is created for them. This
          applies to the website and the mobile app together.
        </p>

        {error && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm flex items-start gap-2"
            style={{ background: "#FEE2E2", borderColor: "#FCA5A5", color: "#991B1B" }}
          >
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm flex items-center gap-2"
            style={{ background: "#D1FAE5", borderColor: "#6EE7B7", color: "#065F46" }}
          >
            <Check size={15} /> Saved. It takes effect on the next registration.
          </div>
        )}

        <div className="space-y-3">
          {OPTIONS.map(({ mode, label, detail, cost, icon: Icon }) => {
            const active = settings?.signupVerification === mode;
            const busy = saving === mode;
            return (
              <motion.button
                key={mode}
                onClick={() => choose(mode)}
                disabled={!settings || saving !== null}
                whileTap={{ scale: 0.995 }}
                className="w-full text-left rounded-2xl border p-5 transition-colors disabled:opacity-70"
                style={
                  active
                    ? { background: "#F0FBF4", borderColor: "#1B4332" }
                    : { background: "white", borderColor: "#DFC5A0" }
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: active ? "#1B4332" : "#F7F0E8",
                      color: active ? "white" : "#8B5E3C",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: "#0D2B1E" }}>
                        {label}
                      </p>
                      {active && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "#D1FAE5", color: "#065F46" }}
                        >
                          In use
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{detail}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{cost}</p>
                  </div>
                  {busy && (
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin shrink-0 mt-1"
                      style={{ borderColor: "#DFC5A0", borderTopColor: "#1B4332" }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          Changing this does not affect members who have already registered.
          Anyone part-way through signing up will need to start again, because
          the code they were sent was issued for the previous setting.
        </p>
      </div>
    </SidebarLayout>
  );
}
