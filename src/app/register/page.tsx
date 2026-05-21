"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, ArrowRight, CheckCircle, Users, Shield, Heart, ChevronDown } from "lucide-react";
import { saveUser } from "@/lib/auth";
import TestCredentialHint from "@/components/TestCredentialHint";

const GOTRAS = ["Kashyap", "Bharadwaja", "Vasishtha", "Atreya", "Kaundinya", "Vishwamitra", "Gautama"];
const AVATAR_NUMS = ["1","2","3","4","5","6","7","8"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [gotra, setGotra]     = useState("Kashyap");
  const [native, setNative]   = useState("");
  const [gender, setGender]   = useState<"M" | "F">("M");
  const [otp, setOtp]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!name.trim()) { setError("Please enter your full name"); return; }
    if (phone.length < 10) { setError("Please enter a valid 10-digit phone number"); return; }
    setError(""); setStep("otp");
  };

  const handleVerify = async () => {
    if (otp !== "121212") { setError("Invalid OTP. Use 121212 for this demo."); return; }
    setLoading(true);
    setError("");

    const avatar = AVATAR_NUMS[Math.floor(Math.random() * AVATAR_NUMS.length)];

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          gotra,
          native: native.trim() || "Karnataka",
          role: "member",
          avatar,
          gender,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      saveUser(data.user);
      router.push("/onboarding/identity");
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

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
            Join 1,428 families who have documented their heritage and connected with their ancestral roots.
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
                <TestCredentialHint hints={["Name: Aditi Rao  |  Phone: 9876543210  |  OTP: 121212"]} />

                <div className="space-y-4 mt-4">
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Full Name</label>
                    <input type="text" placeholder="e.g. Aditi Shanbhag Rao" value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                      style={{ borderColor: "#DFC5A0" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                      onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Mobile Number</label>
                    <input type="tel" placeholder="9876543210" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                      className="w-full px-4 py-3 text-sm border rounded-xl outline-none bg-white"
                      style={{ borderColor: "#DFC5A0" }}
                      onFocus={e => e.target.style.borderColor = "#1B4332"}
                      onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4332" }}>Gender</label>
                    <div className="flex gap-3">
                      {(["M","F"] as const).map(g => (
                        <button key={g} onClick={() => setGender(g)}
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

                  <button onClick={handleNext}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow: "0 4px 16px rgba(27,67,50,0.3)" }}>
                    Continue <ArrowRight size={18} />
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
                <p className="text-gray-500 mb-6 text-sm">OTP sent to <strong>+91 {phone}</strong></p>
                <TestCredentialHint hints={["Enter OTP: 121212"]} />
                <div className="space-y-4 mt-4">
                  <input type="text" maxLength={6} placeholder="1 2 1 2 1 2" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-6 py-4 text-center text-3xl font-bold border rounded-xl outline-none bg-white"
                    style={{ borderColor: "#DFC5A0", color: "#1B4332", letterSpacing: "0.3em" }}
                    onFocus={e => e.target.style.borderColor = "#1B4332"}
                    onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleVerify} disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Creating account…</>
                      : <><CheckCircle size={18} /> Create Account &amp; Continue</>}
                  </button>
                  <button onClick={() => { setStep("details"); setError(""); }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700">
                    ← Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
