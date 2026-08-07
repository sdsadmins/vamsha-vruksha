"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, Shield, ArrowRight, CheckCircle, Users, Heart, Phone } from "lucide-react";
import { apiPost, errorMessage } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import type { VVUser } from "@/lib/auth";

type SendOtpResponse = {
  success: true;
  channel: "sms" | "email";
  destination: string;
  expiresInSeconds: number;
  resendAfterSeconds: number;
};

type LoginResponse = { success: true; user: VVUser; token: string };

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedTo, setMaskedTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Countdown for the resend link. The server enforces the same cooldown and
  // answers 429 — this only stops the member from burning an attempt to find
  // that out.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<SendOtpResponse>(
        "/api/otp/send",
        { channel: "sms", destination: phone, purpose: "login" },
        { anonymous: true },
      );
      setMaskedTo(res.destination);
      setResendIn(res.resendAfterSeconds);
      setStep("otp");
    } catch (err) {
      setError(errorMessage(err, "Could not send the code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<LoginResponse>(
        "/api/user/login",
        { phone, otp },
        { anonymous: true },
      );
      saveSession(data.user, data.token);
      router.push(data.user.role === "elder" ? "/elder" : "/dashboard");
    } catch (err) {
      setError(
        errorMessage(err).includes("not registered")
          ? "This number isn't registered. Please create an account first."
          : errorMessage(err, "Login failed."),
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D2B1E" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #061410 0%, #0D2B1E 50%, #1B4332 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <line x1="200" y1="100" x2="120" y2="220" stroke="#C4823A" strokeWidth="1.5" />
            <line x1="200" y1="100" x2="280" y2="220" stroke="#C4823A" strokeWidth="1.5" />
            <line x1="120" y1="220" x2="80"  y2="340" stroke="#52B788" strokeWidth="1" />
            <line x1="120" y1="220" x2="160" y2="340" stroke="#52B788" strokeWidth="1" />
            <line x1="280" y1="220" x2="240" y2="340" stroke="#52B788" strokeWidth="1" />
            <line x1="280" y1="220" x2="320" y2="340" stroke="#52B788" strokeWidth="1" />
            {[{ cx:200,cy:100,r:20,fill:"#8B5E3C" },{cx:120,cy:220,r:16,fill:"#1B4332"},{cx:280,cy:220,r:16,fill:"#1B4332"},{cx:80,cy:340,r:12,fill:"#2D6A4F"},{cx:160,cy:340,r:12,fill:"#2D6A4F"},{cx:240,cy:340,r:12,fill:"#2D6A4F"},{cx:320,cy:340,r:12,fill:"#2D6A4F"}].map((n,i)=>(
              <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
            ))}
          </svg>
        </div>
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
            Your lineage.<br /><span className="gold-shimmer">Your legacy.</span><br />One portal.
          </h2>
          <p className="text-green-200 text-base leading-relaxed">
            Connect with your families, trace your ancestral roots, and contribute to community welfare.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: Shield, text: "Verified identity for every member" },
            { icon: Users,  text: "Peer-vouched lineage connections" },
            { icon: Heart,  text: "Community welfare with full transparency" },
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16"
        style={{ backgroundColor: "#FAF7F2" }}>
        <div className="w-full max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
              <TreePine size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>
              Daivajna Samaja
            </span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Access the Portal
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
              We&apos;ll text a one-time code to your registered number.
            </p>

            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div key="ph"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <div className="rounded-2xl border p-6"
                    style={{ background: "white", borderColor: "#DFC5A0" }}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#1B4332" }}>
                      Registered Mobile Number
                    </label>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-3 text-sm rounded-xl border shrink-0"
                        style={{ borderColor: "#DFC5A0", background: "#FAF7F2", color: "#6B7280" }}>
                        +91
                      </span>
                      <input type="tel" inputMode="numeric" placeholder="9876543210" value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setError(""); }}
                        maxLength={10}
                        className="flex-1 px-4 py-3 text-sm border rounded-xl outline-none"
                        style={{ borderColor: "#DFC5A0" }}
                        onFocus={e => e.target.style.borderColor = "#1B4332"}
                        onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                        onKeyDown={e => e.key === "Enter" && sendOtp()}
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <button onClick={sendOtp} disabled={loading || phone.length !== 10}
                      className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Sending…</>
                        : <>Send OTP <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="ot"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <div className="rounded-2xl border p-6"
                    style={{ background: "white", borderColor: "#DFC5A0" }}>
                    <p className="text-sm text-gray-600 mb-4">
                      Code sent to <strong>{maskedTo || `+91 ${phone}`}</strong>
                    </p>
                    <input type="text" inputMode="numeric" maxLength={6} placeholder="- - - - - -" value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\D/g,"").slice(0,6)); setError(""); }}
                      className="w-full text-center text-2xl tracking-[0.4em] px-4 py-3 border rounded-xl outline-none font-bold mb-4"
                      style={{ borderColor: "#DFC5A0", color: "#0D2B1E" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                      onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                      onKeyDown={e => e.key === "Enter" && verifyOtp()}
                      autoFocus
                    />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <button onClick={verifyOtp}
                      disabled={loading || otp.length < 4}
                      className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Logging in…</>
                        : <><CheckCircle size={16} /> Login</>}
                    </button>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <button onClick={() => { setStep("phone"); setError(""); setOtp(""); }}
                        className="text-gray-500 hover:text-gray-700">
                        ← Change number
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

            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-5">
              <Phone size={12} /> Standard SMS rates may apply.
            </p>

            <p className="text-center text-sm text-gray-400 mt-4">
              New member?{" "}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: "#1B4332" }}>
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
