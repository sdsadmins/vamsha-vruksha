"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, User, Shield, ArrowRight, CheckCircle, Users, Heart, Star, Phone } from "lucide-react";
import { saveUser } from "@/lib/auth";
import type { VVUser } from "@/lib/auth";

const DEMO_PROFILES: {
  user: VVUser; label: string; description: string; subDesc: string;
  badge: string; color: string; accent: string; features: string[]; photo: string;
}[] = [
  {
    user: { name: "Priya Kamat", phone: "9876543210", role: "member", gotra: "Kashyap", native: "Bengaluru, Karnataka", avatar: "6" },
    label: "Member Login",
    description: "Priya Kamat",
    subDesc: "UX Designer · Bengaluru",
    badge: "Community Member",
    color: "#1B4332",
    accent: "#C4823A",
    photo: "https://images.pexels.com/photos/7485047/pexels-photo-7485047.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    features: ["Family Tree", "Matrimonial Hub", "Welfare Campaigns", "Member Directory"],
  },
  {
    user: { name: "Shri Narayanarao Shet", phone: "9999999999", role: "elder", gotra: "Bharadwaja", native: "Kumta, Uttara Kannada", avatar: "elder" },
    label: "Elder / Admin Login",
    description: "Shri Narayanarao Shet",
    subDesc: "Elder Committee · Kumta Branch",
    badge: "Elder & Administrator",
    color: "#6B4226",
    accent: "#C4823A",
    photo: "https://images.pexels.com/photos/17815020/pexels-photo-17815020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    features: ["Member Verification", "Lineage Management", "Community Oversight", "Full Admin Access"],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"demo" | "phone">("demo");
  const [demoLoading, setDemoLoading] = useState<number | null>(null);

  // Phone login state
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleDemoLogin = (idx: number) => {
    setDemoLoading(idx);
    const profile = DEMO_PROFILES[idx];
    setTimeout(() => {
      saveUser(profile.user);
      router.push(profile.user.role === "elder" ? "/elder" : "/dashboard");
    }, 600);
  };

  const handlePhoneNext = () => {
    if (phone.length < 10) { setError("Enter a valid 10-digit phone number"); return; }
    setError(""); setPhoneStep("otp");
  };

  const handleOtpVerify = async () => {
    if (otp !== "121212") { setError("Invalid OTP. Use 121212 for this demo."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "Phone number not registered"
          ? "This number isn't registered. Please create an account first."
          : (data.error || "Login failed."));
        setLoading(false);
        return;
      }
      saveUser(data.user);
      router.push(data.user.role === "elder" ? "/elder" : "/dashboard");
    } catch {
      setError("Network error. Please try again.");
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
            Connect with 1,428 families, trace your ancestral roots, and contribute to community welfare.
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
              Use demo profiles for a quick tour, or login with your registered number.
            </p>

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6"
              style={{ background: "#EDE8DF" }}>
              {[
                { key: "demo",  label: "Demo Profiles", icon: <User size={14} /> },
                { key: "phone", label: "My Account",    icon: <Phone size={14} /> },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => { setMode(key as "demo"|"phone"); setError(""); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={mode === key
                    ? { background: "white", color: "#0D2B1E", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                    : { color: "#6B7280" }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "demo" ? (
                <motion.div key="demo"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-4">
                    {DEMO_PROFILES.map((profile, idx) => (
                      <motion.button key={idx} onClick={() => handleDemoLogin(idx)}
                        disabled={demoLoading !== null}
                        whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
                        className="w-full text-left rounded-2xl overflow-hidden transition-all"
                        style={{
                          background: "white",
                          border: `2px solid ${idx === 0 ? "#D8F3DC" : "#F7EDDA"}`,
                          boxShadow: idx === 0 ? "0 4px 24px rgba(27,67,50,0.10)" : "0 4px 24px rgba(166,124,82,0.12)",
                        }}>
                        <div className="flex items-stretch">
                          <div className="w-2 shrink-0"
                            style={{ background: `linear-gradient(180deg, ${profile.color}, ${profile.accent})` }} />
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2"
                                  style={{ borderColor: profile.accent }}>
                                  {demoLoading === idx ? (
                                    <div className="w-full h-full flex items-center justify-center"
                                      style={{ background: profile.color }}>
                                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                  ) : (
                                    <img src={profile.photo} alt={profile.description} className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-base" style={{ color: "#0D2B1E" }}>{profile.label}</span>
                                    {idx === 1 && <Star size={12} style={{ color: "#8B5E3C" }} fill="#8B5E3C" />}
                                  </div>
                                  <p className="text-sm font-medium" style={{ color: profile.color }}>{profile.description}</p>
                                  <p className="text-xs text-gray-400">{profile.subDesc}</p>
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                    style={{
                                      background: idx === 0 ? "#D1FAE5" : "#FBF6EE",
                                      color:      idx === 0 ? "#065F46" : "#92400E",
                                    }}>
                                    {profile.badge}
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 mt-1">
                                {demoLoading === idx
                                  ? <CheckCircle size={20} style={{ color: profile.color }} />
                                  : <ArrowRight  size={20} style={{ color: profile.color }} />}
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {profile.features.map(f => (
                                <span key={f} className="text-xs px-2.5 py-1 rounded-full"
                                  style={{
                                    background: idx === 0 ? "#F0FBF4" : "#FBF6EE",
                                    color:      idx === 0 ? "#1B4332" : "#6B4226",
                                    border:     `1px solid ${idx === 0 ? "#B7E4C7" : "#F0DDBA"}`,
                                  }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="phone"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <AnimatePresence mode="wait">
                    {phoneStep === "phone" ? (
                      <motion.div key="ph"
                        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                        <div className="rounded-2xl border p-6"
                          style={{ background: "white", borderColor: "#DFC5A0" }}>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#1B4332" }}>
                            Registered Mobile Number
                          </label>
                          <input type="tel" placeholder="9876543210" value={phone}
                            onChange={e => { setPhone(e.target.value.replace(/\D/g,"")); setError(""); }}
                            maxLength={10}
                            className="w-full px-4 py-3 text-sm border rounded-xl outline-none mb-4"
                            style={{ borderColor: "#DFC5A0" }}
                            onFocus={e => e.target.style.borderColor = "#1B4332"}
                            onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                            onKeyDown={e => e.key === "Enter" && handlePhoneNext()}
                          />
                          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                          <button onClick={handlePhoneNext}
                            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                            Send OTP <ArrowRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="ot"
                        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                        <div className="rounded-2xl border p-6"
                          style={{ background: "white", borderColor: "#DFC5A0" }}>
                          <p className="text-sm text-gray-600 mb-1">
                            OTP sent to <strong>+91 {phone}</strong>
                          </p>
                          <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">
                            Demo OTP: <strong>121212</strong>
                          </p>
                          <input type="text" maxLength={6} placeholder="1 2 1 2 1 2" value={otp}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g,"")); setError(""); }}
                            className="w-full text-center text-2xl tracking-[0.4em] px-4 py-3 border rounded-xl outline-none font-bold mb-4"
                            style={{ borderColor: "#DFC5A0", color: "#0D2B1E" }}
                            onFocus={e => e.target.style.borderColor = "#1B4332"}
                            onBlur={e => e.target.style.borderColor = "#DFC5A0"}
                            autoFocus
                          />
                          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                          <button onClick={handleOtpVerify}
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                            {loading
                              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />&nbsp;Logging in…</>
                              : <><CheckCircle size={16} /> Login</>}
                          </button>
                          <button onClick={() => { setPhoneStep("phone"); setError(""); setOtp(""); }}
                            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">
                            ← Change number
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-gray-400 mt-6">
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
