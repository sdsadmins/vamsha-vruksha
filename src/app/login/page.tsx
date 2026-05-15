"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TreePine, User, Shield, ArrowRight, CheckCircle, Users, Heart, Star } from "lucide-react";
import { saveUser } from "@/lib/auth";
import type { VVUser } from "@/lib/auth";

const DEMO_PROFILES: { user: VVUser; label: string; description: string; badge: string; color: string; accent: string; icon: React.ReactNode; features: string[] }[] = [
  {
    user: { name: "Aditi Rao", phone: "9876543210", role: "member", gotra: "Kashyap", native: "Udupi, Karnataka", avatar: "6" },
    label: "Member Login",
    description: "Aditi Rao",
    badge: "Community Member",
    color: "#1B4332",
    accent: "#D4AF7A",
    icon: <User size={28} />,
    features: ["Family Tree", "Matrimonial Hub", "Welfare Campaigns", "Member Directory"],
  },
  {
    user: { name: "Shri Raghavan", phone: "9999999999", role: "elder", gotra: "Bharadwaja", native: "Kundapura, Karnataka", avatar: "1" },
    label: "Elder / Admin Login",
    description: "Shri Raghavan",
    badge: "Elder & Administrator",
    color: "#6B4226",
    accent: "#D4AF7A",
    icon: <Shield size={28} />,
    features: ["Member Verification", "Lineage Management", "Community Oversight", "All Member Access"],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<number | null>(null);

  const handleLogin = (idx: number) => {
    setLoading(idx);
    const profile = DEMO_PROFILES[idx];
    setTimeout(() => {
      saveUser(profile.user);
      router.push(profile.user.role === "elder" ? "/elder" : "/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D2B1E" }}>
      {/* LEFT: Branding Panel */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #061410 0%, #0D2B1E 50%, #1B4332 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <line x1="200" y1="100" x2="120" y2="220" stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="200" className="tree-line" />
            <line x1="200" y1="100" x2="280" y2="220" stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="200" className="tree-line delay-200" />
            <line x1="120" y1="220" x2="80" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-400" />
            <line x1="120" y1="220" x2="160" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-500" />
            <line x1="280" y1="220" x2="240" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-600" />
            <line x1="280" y1="220" x2="320" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-700" />
            {[{ cx: 200, cy: 100, r: 20, fill: "#A67C52" }, { cx: 120, cy: 220, r: 16, fill: "#1B4332" }, { cx: 280, cy: 220, r: 16, fill: "#1B4332" }, { cx: 80, cy: 340, r: 12, fill: "#2D6A4F" }, { cx: 160, cy: 340, r: 12, fill: "#2D6A4F" }, { cx: 240, cy: 340, r: 12, fill: "#2D6A4F" }, { cx: 320, cy: 340, r: 12, fill: "#2D6A4F" }].map((n, i) => (
              <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} className={`tree-node delay-${(i + 1) * 200}`} />
            ))}
          </svg>
        </div>

        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A67C52, #D4AF7A)" }}>
              <TreePine size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Vamsha Vruksha</p>
              <p className="text-green-400 text-xs">Daivadnya Samaj Bangalore</p>
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
            Your lineage.<br />
            <span className="gold-shimmer">Your legacy.</span><br />
            One portal.
          </h2>
          <p className="text-green-200 text-base leading-relaxed">
            Connect with 1,428 families, trace your ancestral roots, and contribute to community welfare — all in one verified platform.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: Shield, text: "Aadhaar-verified identity for every member" },
            { icon: Users, text: "Peer-vouched lineage connections" },
            { icon: Heart, text: "Community welfare with full transparency" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,122,0.15)" }}>
                <Icon size={16} style={{ color: "#D4AF7A" }} />
              </div>
              <p className="text-green-300 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-green-600 text-xs">© 2024 Vamsha Vruksha. Preserving Legacies for Generations.</p>
      </div>

      {/* RIGHT: One-click Login */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="w-full max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
              <TreePine size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>Vamsha Vruksha</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Access the Portal
            </h1>
            <p className="text-gray-500 mb-8 text-sm">Select your profile to enter instantly — no credentials needed for this demo.</p>

            <div className="space-y-4">
              {DEMO_PROFILES.map((profile, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleLogin(idx)}
                  disabled={loading !== null}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: "white",
                    border: `2px solid ${idx === 0 ? "#D8F3DC" : "#F7EDDA"}`,
                    boxShadow: idx === 0
                      ? "0 4px 24px rgba(27,67,50,0.10)"
                      : "0 4px 24px rgba(166,124,82,0.12)",
                  }}
                >
                  <div className="flex items-stretch">
                    {/* Color stripe */}
                    <div
                      className="w-2 flex-shrink-0"
                      style={{ background: `linear-gradient(180deg, ${profile.color}, ${profile.accent})` }}
                    />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Icon circle */}
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                            style={{ background: `linear-gradient(135deg, ${profile.color}, ${profile.accent})` }}
                          >
                            {loading === idx ? (
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              profile.icon
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-base" style={{ color: "#0D2B1E" }}>{profile.label}</span>
                              {idx === 1 && <Star size={12} style={{ color: "#A67C52" }} fill="#A67C52" />}
                            </div>
                            <p className="text-sm font-medium" style={{ color: profile.color }}>{profile.description}</p>
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                background: idx === 0 ? "#D1FAE5" : "#FBF6EE",
                                color: idx === 0 ? "#065F46" : "#92400E",
                              }}
                            >
                              {profile.badge}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 mt-1">
                          {loading === idx ? (
                            <CheckCircle size={20} style={{ color: profile.color }} />
                          ) : (
                            <ArrowRight size={20} style={{ color: profile.color }} />
                          )}
                        </div>
                      </div>

                      {/* Feature list */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profile.features.map(f => (
                          <span
                            key={f}
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{
                              background: idx === 0 ? "#F0FBF4" : "#FBF6EE",
                              color: idx === 0 ? "#1B4332" : "#6B4226",
                              border: `1px solid ${idx === 0 ? "#B7E4C7" : "#F0DDBA"}`,
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

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
