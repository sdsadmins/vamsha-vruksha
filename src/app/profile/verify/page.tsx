"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Phone, MapPin, User, Shield, Edit3,
  RefreshCw, Clock, AlertCircle, ChevronRight
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { getUser } from "@/lib/auth";

const FIELDS = [
  { id: "mobile",   label: "Mobile Number",    icon: Phone,  current: "+91 98765 43210", hint: "Used for OTP and community alerts" },
  { id: "address",  label: "Home Address",     icon: MapPin, current: "204 Kamath Niwas, Rajajinagar, Bengaluru 560010", hint: "Visible only to your direct family tree members" },
  { id: "gotra",    label: "Gotra",            icon: User,   current: "Bharadwaja", hint: "Contact Elder committee to correct lineage-level errors" },
  { id: "native",   label: "Native Place",     icon: MapPin, current: "Kundapura, Udupi, Karnataka", hint: "Village or town of ancestral origin" },
];

type Step = "overview" | "otp" | "edit" | "done";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("overview");
  const [editField, setEditField] = useState<typeof FIELDS[0] | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.id, f.current]))
  );
  const [name, setName] = useState("Member");

  useEffect(() => {
    const u = getUser();
    if (u) setName(u.name);
  }, []);

  const sendOtp = () => {
    setOtpSent(true);
    setOtpError(false);
    setOtpValue("");
  };

  const verifyOtp = () => {
    if (otpValue === "121212") {
      setStep("edit");
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const startEdit = (field: typeof FIELDS[0]) => {
    if (field.id === "gotra") return; // gotra is locked
    setEditField(field);
    setStep("otp");
    setOtpSent(false);
    setOtpValue("");
    setOtpError(false);
  };

  const saveEdit = (newVal: string) => {
    if (editField) {
      setValues(prev => ({ ...prev, [editField.id]: newVal }));
    }
    setStep("done");
  };

  if (step === "done") return (
    <SidebarLayout title="Verify & Update">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #D1FAE5, #B7E4C7)" }}>
          <CheckCircle size={44} style={{ color: "#1B4332" }} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Details Updated
          </h2>
          <p className="text-gray-500 max-w-sm">
            Your <strong>{editField?.label}</strong> has been updated successfully.
            Changes are reflected across your family profile immediately.
          </p>
          <p className="text-xs text-gray-400 mt-2">Your Elder committee has been notified of the update.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setStep("overview"); setEditField(null); }}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
            Back to Profile
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl font-semibold border"
            style={{ borderColor: "#E8D5BC", color: "#1B4332" }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout title="Verify & Update Info">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="rounded-2xl border p-5 mb-6 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)", borderColor: "#2D6A4F" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold">Annual Verification — 2024–25</p>
            <p className="text-green-300 text-sm">
              Hello {name}, please confirm or update your contact details below.
            </p>
          </div>
          <div className="ml-auto shrink-0 text-right">
            <p className="text-xs text-green-400 font-semibold">Last verified</p>
            <p className="text-white text-sm font-bold">Apr 2024</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="rounded-2xl border divide-y mb-5" style={{ background: "white", borderColor: "#E8D5BC" }}>
                {FIELDS.map(f => {
                  const Icon = f.icon;
                  const locked = f.id === "gotra";
                  return (
                    <div key={f.id} className="flex items-center gap-4 p-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "#F0FBF4" }}>
                        <Icon size={16} style={{ color: "#1B4332" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                        <p className="text-sm font-semibold truncate" style={{ color: "#0D2B1E" }}>
                          {values[f.id]}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{f.hint}</p>
                      </div>
                      <button
                        onClick={() => startEdit(f)}
                        disabled={locked}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        style={locked
                          ? { borderColor: "#E8D5BC", color: "#9CA3AF" }
                          : { borderColor: "#1B4332", color: "#1B4332" }
                        }>
                        {locked ? <><Shield size={11} /> Locked</> : <><Edit3 size={11} /> Update</>}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Confirm or snooze */}
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setStep("done")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.25)" }}>
                  <CheckCircle size={16} /> Confirm — All Details Correct
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-gray-50"
                  style={{ borderColor: "#E8D5BC", color: "#374151" }}>
                  <Clock size={16} /> Remind Me in 30 Days
                </button>
              </div>
            </motion.div>
          )}

          {step === "otp" && editField && (
            <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="rounded-2xl border p-6 text-center" style={{ background: "white", borderColor: "#E8D5BC" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#F0FBF4" }}>
                  <Phone size={26} style={{ color: "#1B4332" }} />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                  Verify your identity
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  We&apos;ll send a one-time code to <strong>{values["mobile"]}</strong> before letting you update <strong>{editField.label}</strong>.
                </p>

                {!otpSent ? (
                  <button onClick={sendOtp}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                      OTP sent! Use <strong>121212</strong> for this demo.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otpValue}
                      onChange={e => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(false); }}
                      className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border rounded-xl outline-none font-bold"
                      style={{ borderColor: otpError ? "#EF4444" : "#E8D5BC", color: "#0D2B1E" }}
                    />
                    {otpError && (
                      <p className="text-xs text-red-500 flex items-center justify-center gap-1">
                        <AlertCircle size={12} /> Incorrect OTP. Try 121212.
                      </p>
                    )}
                    <button onClick={verifyOtp} disabled={otpValue.length !== 6}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                      Verify & Continue <ChevronRight size={15} className="inline" />
                    </button>
                    <button onClick={sendOtp}
                      className="text-xs text-gray-400 flex items-center justify-center gap-1 mx-auto hover:text-gray-600">
                      <RefreshCw size={11} /> Resend OTP
                    </button>
                  </div>
                )}

                <button onClick={() => setStep("overview")} className="mt-3 text-sm text-gray-400 hover:underline">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {step === "edit" && editField && (
            <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <EditForm
                field={editField}
                currentValue={values[editField.id]}
                onSave={saveEdit}
                onCancel={() => setStep("overview")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarLayout>
  );
}

function EditForm({
  field, currentValue, onSave, onCancel
}: {
  field: typeof FIELDS[0]; currentValue: string;
  onSave: (v: string) => void; onCancel: () => void;
}) {
  const [val, setVal] = useState(currentValue);
  const Icon = field.icon;

  return (
    <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#E8D5BC" }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#F0FBF4" }}>
          <Icon size={18} style={{ color: "#1B4332" }} />
        </div>
        <div>
          <p className="font-bold" style={{ color: "#0D2B1E" }}>Update {field.label}</p>
          <p className="text-xs text-gray-400">{field.hint}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 mb-1.5">CURRENT VALUE</p>
      <div className="px-4 py-3 rounded-xl mb-4 text-sm line-through text-gray-400"
        style={{ background: "#F9F5F0" }}>
        {currentValue}
      </div>

      <p className="text-xs font-semibold text-gray-500 mb-1.5">NEW VALUE</p>
      {field.id === "address" ? (
        <textarea
          rows={3}
          value={val}
          onChange={e => setVal(e.target.value)}
          className="w-full px-4 py-3 text-sm border rounded-xl outline-none resize-none mb-5"
          style={{ borderColor: "#1B4332" }}
        />
      ) : (
        <input
          type={field.id === "mobile" ? "tel" : "text"}
          value={val}
          onChange={e => setVal(e.target.value)}
          className="w-full px-4 py-3 text-sm border rounded-xl outline-none mb-5"
          style={{ borderColor: "#1B4332" }}
        />
      )}

      <div className="flex gap-3">
        <button onClick={() => onSave(val)}
          disabled={!val.trim() || val === currentValue}
          className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
          Save Changes
        </button>
        <button onClick={onCancel}
          className="px-5 py-3.5 rounded-xl font-semibold text-sm border"
          style={{ borderColor: "#E8D5BC", color: "#374151" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
