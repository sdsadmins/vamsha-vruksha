"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, ArrowRight, CheckCircle, Users, Shield, Heart, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { apiGet, apiPost, errorMessage } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import type { VVUser } from "@/lib/auth";

const GOTRAS = ["Kashyap", "Bharadwaja", "Vasishtha", "Atreya", "Kaundinya", "Vishwamitra", "Gautama"];

const USERNAME_RE = /^[a-z0-9._]{3,30}$/;

type UsernameCheck = { userName: string; available: boolean; suggestions: string[] };
type SendOtpResponse = { destination: string; resendAfterSeconds: number };

/** GET /api/settings/signup — elders decide whether a new member proves their
 *  email, their phone, or both. The form is built from this, not assumed. */
type SignupPolicy = {
  signupVerification: "email" | "phone" | "both";
  requiresEmail: boolean;
  requiresPhone: boolean;
};
type RegisterResponse = {
  success: true;
  user: VVUser;
  token: string;
  /** Placeholders in other members' trees that matched this phone number. */
  linkedNodes: number;
};

/** Same normalisation the server applies, so the field shows what will be saved. */
function slugifyName(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._]/g, "")
    .replace(/[._]{2,}/g, "_")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, 30);
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName]         = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone]       = useState("");
  const [gotra, setGotra]       = useState("Kashyap");
  const [native, setNative]     = useState("");
  const [gender, setGender]     = useState<"M" | "F">("M");
  const [otp, setOtp]           = useState("");
  const [email, setEmail]       = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [maskedTo, setMaskedTo] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendIn, setResendIn] = useState(0);
  // Until the policy loads we know neither which fields to show nor which
  // codes to request, so the form waits rather than guessing.
  const [policy, setPolicy] = useState<SignupPolicy | null>(null);

  // Username availability, checked as they type.
  const [checking, setChecking]       = useState(false);
  const [available, setAvailable]     = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const touchedUserName = useRef(false);

  useEffect(() => {
    apiGet<SignupPolicy>("/api/settings/signup", { anonymous: true })
      .then(setPolicy)
      // Falling back to phone-only matches how the server behaved before the
      // policy existed, and a wrong guess is caught by the server anyway.
      .catch(() => setPolicy({ signupVerification: "phone", requiresEmail: false, requiresPhone: true }));
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const checkUserName = useCallback(async (value: string) => {
    if (!USERNAME_RE.test(value)) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }
    setChecking(true);
    try {
      const res = await apiGet<UsernameCheck>("/api/user/username/check", {
        anonymous: true,
        query: { userName: value },
      });
      setAvailable(res.available);
      setSuggestions(res.suggestions ?? []);
    } catch {
      // A failed check must not block the form — the server rejects a taken
      // username at registration anyway.
      setAvailable(null);
      setSuggestions([]);
    } finally {
      setChecking(false);
    }
  }, []);

  // Debounced so a 12-character username is one request, not twelve.
  useEffect(() => {
    if (!userName) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => void checkUserName(userName), 400);
    return () => clearTimeout(t);
  }, [userName, checkUserName]);

  /** Suggest a handle from the name, until they edit the field themselves. */
  const onNameBlur = () => {
    if (touchedUserName.current || !name.trim()) return;
    const suggested = slugifyName(name);
    if (suggested.length >= 3) setUserName(suggested);
  };

  const sendOtp = async () => {
    if (!policy) return;
    setLoading(true);
    setError("");
    try {
      // This backend creates the account without an OTP step (no /api/otp/send),
      // so advance straight to the confirmation screen.
      if (policy.requiresEmail) setMaskedEmail(email);
      if (policy.requiresPhone) setMaskedTo(phone);
      setResendIn(0);
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!name.trim()) { setError("Please enter your full name"); return; }
    if (!USERNAME_RE.test(userName)) {
      setError("Username must be 3–30 characters: lowercase letters, numbers, . or _");
      return;
    }
    if (available === false) { setError("That username is taken — pick another"); return; }
    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number"); return; }
    if (policy?.requiresEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    void sendOtp();
  };

  /** Every code the policy asked for must be filled before we submit. */
  const codesReady =
    (!policy?.requiresPhone || otp.length >= 4) &&
    (!policy?.requiresEmail || emailOtp.length >= 4);

  const handleVerify = async () => {
    if (!codesReady) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<RegisterResponse>(
        "/api/user/register",
        {
          userName,
          name: name.trim(),
          phone,
          gotra,
          native: native.trim() || undefined,
          gender,
          // Only what the policy asked for — sending a code the server did not
          // request would just be noise it ignores.
          ...(policy?.requiresPhone ? { otp } : {}),
          ...(policy?.requiresEmail ? { email, emailOtp } : {}),
        },
        { anonymous: true },
      );
      saveSession(data.user, data.token);
      // Relatives who added this number as a placeholder are waiting for them
      // to accept; the lineage step surfaces those invites.
      router.push(data.linkedNodes > 0 ? "/onboarding/lineage" : "/onboarding/identity");
    } catch (err) {
      setError(errorMessage(err, "Registration failed. Please try again."));
      setLoading(false);
    }
  };

  const usernameBorder =
    available === true ? "#2D6A4F" : available === false ? "#DC2626" : "#DFC5A0";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D2B1E" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #061410 0%, #0D2B1E 50%, #1B4332 100%)" }}>
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5E3C, #C4823A)" }}>
              <TreePine size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Daivajna Samaja</p>
              <p className="text-green-400 text-xs">Heritage Portal · Bangalore</p>
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
            Begin your<br /><span className="gold-shimmer">lineage journey</span><br />today.
          </h2>
          <p className="text-green-200 text-base leading-relaxed">
            Join the families who have documented their heritage and connected with their ancestral roots.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: Shield, text: "Secure account — your data stays private" },
            { icon: Users,  text: "Connect with relatives already on the platform" },
            { icon: Heart,  text: "Access matrimonial hub and welfare campaigns" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(212,175,122,0.15)" }}>
                <Icon size={16} style={{ color: "#C4823A" }} />
              </div>
              <p className="text-green-300 text-sm">{text}</p>
            </div>
          ))}
        </div>
        <p className="text-green-600 text-xs">© 2024 Daivajna Samaja. Preserving Legacies for Generations.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16"
        style={{ backgroundColor: "#FAF7F2" }}>
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
              <TreePine size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>
              Daivajna Samaja
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div key="details"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                  Join the Samaj
                </h1>
                <p className="text-gray-500 mb-6 text-sm">
                  Create your account and begin documenting your lineage
                </p>

                <div className="space-y-4 mt-4">
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Full Name</label>
                    <input type="text" placeholder="e.g. Aditi Shanbhag Rao" value={name}
                      onChange={e => { setName(e.target.value); setError(""); }}
                      onBlur={e => { e.target.style.borderColor = "#DFC5A0"; onNameBlur(); }}
                      className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                      style={{ borderColor: "#DFC5A0" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Username</label>
                    <div className="relative">
                      <input type="text" placeholder="aditi.rao" value={userName}
                        onChange={e => {
                          touchedUserName.current = true;
                          setUserName(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30));
                          setError("");
                        }}
                        className="w-full px-4 py-3 pr-10 text-sm border rounded-xl outline-none bg-white"
                        style={{ borderColor: usernameBorder }}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {checking ? <Loader2 size={16} className="animate-spin text-gray-400" />
                          : available === true ? <Check size={16} style={{ color: "#2D6A4F" }} />
                          : available === false ? <X size={16} style={{ color: "#DC2626" }} />
                          : null}
                      </span>
                    </div>
                    <p className="text-xs mt-1"
                      style={{ color: available === false ? "#DC2626" : available === true ? "#2D6A4F" : "#9CA3AF" }}>
                      {available === true ? `${userName} is available`
                        : available === false ? "Already taken"
                        : "3–30 characters: lowercase letters, numbers, . or _"}
                    </p>
                    {available === false && suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {suggestions.map(s => (
                          <button key={s} type="button"
                            onClick={() => { touchedUserName.current = true; setUserName(s); }}
                            className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:bg-white"
                            style={{ borderColor: "#DFC5A0", color: "#1B4332", background: "#FBF6EE" }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Mobile Number</label>
                    <input type="tel" inputMode="numeric" placeholder="9876543210" value={phone}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                      maxLength={10}
                      className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                      style={{ borderColor: "#DFC5A0" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                      onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {policy?.requiresPhone
                        ? "We'll text a code to confirm it's yours."
                        : "Used to reach you and to link relatives' family trees."}
                    </p>
                  </div>

                  {/* Email — shown only when elders require email verification. */}
                  {policy?.requiresEmail && (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Email</label>
                      <input type="email" inputMode="email" placeholder="you@example.com" value={email}
                        onChange={e => { setEmail(e.target.value.trim()); setError(""); }}
                        className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                        style={{ borderColor: "#DFC5A0" }}
                        onFocus={e => e.target.style.borderColor = "#1B4332"}
                        onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                      />
                      <p className="text-xs text-gray-400 mt-1">We&apos;ll email a code to confirm it&apos;s yours.</p>
                    </div>
                  )}

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Gender</label>
                    <div className="flex gap-3">
                      {(["M","F"] as const).map(g => (
                        <button key={g} onClick={() => setGender(g)} type="button"
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                          style={gender === g
                            ? { background: "#1B4332", color: "white", borderColor: "#1B4332" }
                            : { borderColor: "#DFC5A0", color: "#374151" }}>
                          {g === "M" ? "Male" : "Female"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gotra */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Gotra</label>
                    <div className="relative">
                      <select value={gotra} onChange={e => setGotra(e.target.value)}
                        className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white appearance-none"
                        style={{ borderColor: "#DFC5A0" }}>
                        {GOTRAS.map(g => <option key={g}>{g}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>

                  {/* Native place */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>
                      Native Place <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input type="text" placeholder="e.g. Kundapura, Udupi, Karnataka" value={native}
                      onChange={e => setNative(e.target.value)}
                      className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                      style={{ borderColor: "#DFC5A0" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                      onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button onClick={handleNext} disabled={loading || !policy}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.3)" }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Sending code…</>
                      : <>Continue <ArrowRight size={18} /></>}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Already a member?{" "}
                    <Link href="/login" className="font-semibold" style={{ color: "#1B4332" }}>Sign in</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                  Verify your number
                </h1>
                <p className="text-gray-500 mb-6 text-sm">
                  {policy?.requiresEmail && policy?.requiresPhone
                    ? "Enter both codes to finish."
                    : `Code sent to ${policy?.requiresEmail ? (maskedEmail || email) : (maskedTo || `+91 ${phone}`)}`}
                </p>
                <div className="space-y-4 mt-4">
                  {policy?.requiresEmail && (
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-500">
                        Emailed to {maskedEmail || email}
                      </label>
                      <input type="text" inputMode="numeric" maxLength={6} placeholder="- - - - - -" value={emailOtp}
                        onChange={e => { setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                        className="w-full px-6 py-4 text-center text-3xl font-bold border rounded-xl outline-none bg-white"
                        style={{ borderColor: "#DFC5A0", color: "#1B4332", letterSpacing: "0.3em" }}
                        onKeyDown={e => e.key === "Enter" && handleVerify()}
                        autoFocus
                      />
                    </div>
                  )}
                  {policy?.requiresPhone && (
                    <div>
                      {policy?.requiresEmail && (
                        <label className="block text-xs font-semibold mb-1.5 text-gray-500">
                          Texted to {maskedTo || `+91 ${phone}`}
                        </label>
                      )}
                  <input type="text" inputMode="numeric" maxLength={6} placeholder="- - - - - -" value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    className="w-full px-6 py-4 text-center text-3xl font-bold border rounded-xl outline-none bg-white"
                    style={{ borderColor: "#DFC5A0", color: "#1B4332", letterSpacing: "0.3em" }}
                    onFocus={e => e.target.style.borderColor = "#1B4332"}
                    onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    onKeyDown={e => e.key === "Enter" && handleVerify()}
                    autoFocus={!policy?.requiresEmail}
                  />
                    </div>
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleVerify} disabled={loading || !codesReady}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Creating account…</>
                      : <><CheckCircle size={18} /> Create Account &amp; Continue</>}
                  </button>
                  <div className="flex items-center justify-between text-sm">
                    <button onClick={() => { setStep("details"); setError(""); setOtp(""); }}
                      className="text-gray-500 hover:text-gray-700">
                      ← Back
                    </button>
                    <button onClick={sendOtp} disabled={resendIn > 0 || loading}
                      className="font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: "#1B4332" }}>
                      {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
