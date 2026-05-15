"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TreePine, Heart, Users, Shield, CheckCircle, ArrowRight, Star } from "lucide-react";

// Floating particle component for background
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; r: number; dx: number; dy: number; alpha: number }> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,122,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />;
}

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

type StatDef = {
  value: number;
  label: string;
  prefix?: string;
  suffix: string;
  format?: (n: number) => string;
};

const STATS: StatDef[] = [
  { value: 1428, label: "Registered Members", suffix: "+" },
  { value: 86, label: "Family Trees", suffix: "" },
  {
    value: 4250000,
    label: "Welfare Raised",
    prefix: "₹",
    suffix: "",
    format: (n: number) => (n >= 100000 ? (n / 100000).toFixed(1) + "L" : n.toString()),
  },
  { value: 64, label: "Match Success Rate", suffix: "%" },
];

// Extracted component so hooks are called at top level, not inside map()
function StatCard({ stat, visible, delay }: { stat: StatDef; visible: boolean; delay: number }) {
  const count = useCounter(stat.value, 2000, visible);
  const display = stat.format ? stat.format(count) : count.toLocaleString("en-IN");
  return (
    <div
      className="text-center"
      style={{ animation: visible ? `fadeUp 0.6s ${delay}s ease-out both` : "none" }}
    >
      <p
        className="text-3xl lg:text-4xl font-bold mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "#D4AF7A" }}
      >
        {stat.prefix ?? ""}
        {display}
        {stat.suffix}
      </p>
      <p className="text-green-300 text-sm">{stat.label}</p>
    </div>
  );
}

const PILLARS = [
  {
    icon: TreePine,
    title: "Vamsha Vruksha",
    desc: "Document your family lineage across generations. Interactive tree visualization with photo archives, life stories, and ancestral connections dating back centuries.",
    href: "/family-tree",
  },
  {
    icon: Heart,
    title: "Community Welfare",
    desc: "Transparent crowdfunding for Samaj development. Every rupee accounted for — community center construction, scholarships, emergency support.",
    href: "/welfare",
  },
  {
    icon: Users,
    title: "Matrimonial Hub",
    desc: "Elder-mediated matrimonial connections that honour lineage and cultural alignment. Verified profiles with complete family background and heritage data.",
    href: "/matrimonial",
  },
  {
    icon: Shield,
    title: "Elder Governance",
    desc: "Community-driven decisions guided by our respected elders. Resolve lineage conflicts, verify new members, and govern with generational wisdom.",
    href: "/elder",
  },
];

const TRUST_ITEMS = [
  {
    icon: CheckCircle,
    title: "Aadhaar Verification",
    desc: "Every member submits a government-issued ID. Aadhaar-matched and digitally registered.",
  },
  {
    icon: Users,
    title: "Peer Vouching",
    desc: "New members are vouched by 3 existing verified family members within the Samaj network.",
  },
  {
    icon: Shield,
    title: "Elder Approval",
    desc: "Elder sub-committee reviews and approves all lineage connections and matrimonial requests.",
  },
];

export default function LandingPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      {/* ─── Navbar ─── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(250,247,242,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "#E8D5BC",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
            >
              <TreePine size={18} className="text-white" />
            </div>
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}
            >
              Vamsha Vruksha
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Family Tree", href: "/family-tree" },
              { label: "Welfare", href: "/welfare" },
              { label: "Matrimonial", href: "/matrimonial" },
              { label: "Governance", href: "/elder" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-green-800"
                style={{ color: "#4B5563" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:bg-green-50"
              style={{ borderColor: "#1B4332", color: "#1B4332" }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                boxShadow: "0 2px 12px rgba(27,67,50,0.3)",
              }}
            >
              Join Samaj →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "88vh",
          background: "linear-gradient(160deg, #FAF7F2 0%, #F0E6D3 40%, #E8D5BC 100%)",
        }}
      >
        <Particles />
        {/* Decorative circles */}
        <div
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #1B4332, transparent)" }}
        />
        <div
          className="absolute bottom-20 left-20 w-64 h-64 rounded-full animate-float delay-300"
          style={{ background: "radial-gradient(circle, #A67C52, transparent)", opacity: 0.08 }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div style={{ animation: "fadeUp 0.8s ease-out forwards" }}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
                style={{
                  backgroundColor: "rgba(27,67,50,0.06)",
                  borderColor: "rgba(27,67,50,0.2)",
                  color: "#1B4332",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#1B4332" }}
                />
                Daivadnya Samaj Bangalore — Est. 2024
              </div>
              <h1
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
              >
                Preserving
                <br />
                <span className="gold-shimmer">our Roots,</span>
                <br />
                Nurturing
                <br />
                our Future
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                The official digital sanctuary for the Daivagnya Samaj — connecting generations, preserving heritage,
                and building community welfare through a living family tree.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-forest flex items-center gap-2 text-sm">
                  Begin Your Journey <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-white"
                  style={{ borderColor: "#1B4332", color: "#1B4332" }}
                >
                  Access Portal
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {["AR", "RK", "MB", "SK", "VB"].map((init, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${145 + i * 15},50%,${28 + i * 4}%), hsl(${155 + i * 15},50%,${38 + i * 4}%))`,
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">1,428+</strong> families already connected
                </p>
              </div>
            </div>

            {/* Right: feature visual */}
            <div className="relative" style={{ animation: "fadeUp 0.8s 0.2s ease-out both" }}>
              {/* Floating tree preview card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #0D2B1E, #1B4332)",
                  padding: "2px",
                  boxShadow: "0 25px 60px rgba(13,43,30,0.4)",
                }}
              >
                <div
                  className="rounded-3xl p-8"
                  style={{ background: "linear-gradient(160deg, #0D2B1E, #1B4332)" }}
                >
                  {/* Mini tree diagram */}
                  <p className="text-green-400 text-xs font-semibold mb-6 flex items-center gap-2">
                    <TreePine size={12} /> FAMILY LINEAGE PREVIEW
                  </p>
                  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto">
                    {/* Lines */}
                    <line
                      x1="140" y1="40" x2="80" y2="100"
                      stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line"
                    />
                    <line
                      x1="140" y1="40" x2="200" y2="100"
                      stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line delay-200"
                    />
                    <line
                      x1="80" y1="100" x2="50" y2="165"
                      stroke="#52B788" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line delay-400"
                    />
                    <line
                      x1="80" y1="100" x2="115" y2="165"
                      stroke="#52B788" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line delay-500"
                    />
                    <line
                      x1="200" y1="100" x2="175" y2="165"
                      stroke="#52B788" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line delay-600"
                    />
                    <line
                      x1="200" y1="100" x2="230" y2="165"
                      stroke="#52B788" strokeWidth="1.5" strokeDasharray="100"
                      className="tree-line delay-700"
                    />
                    {/* Root node */}
                    <circle cx="140" cy="40" r="22" fill="#A67C52" className="tree-node" />
                    <text x="140" y="44" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                      RCB
                    </text>
                    {/* Gen 2 */}
                    <circle
                      cx="80" cy="100" r="18"
                      fill="#1B4332" stroke="#52B788" strokeWidth="1.5"
                      className="tree-node delay-300"
                    />
                    <text x="80" y="104" textAnchor="middle" fill="white" fontSize="8">
                      VKB
                    </text>
                    <circle
                      cx="200" cy="100" r="18"
                      fill="#1B4332" stroke="#52B788" strokeWidth="1.5"
                      className="tree-node delay-400"
                    />
                    <text x="200" y="104" textAnchor="middle" fill="white" fontSize="8">
                      SKB
                    </text>
                    {/* Gen 3 */}
                    {[50, 115, 175, 230].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy="165"
                        r="15"
                        fill="#0D2B1E"
                        stroke="#D4AF7A"
                        strokeWidth="1.5"
                        className={`tree-node delay-${600 + i * 200}`}
                      />
                    ))}
                    <text x="50" y="169" textAnchor="middle" fill="#D4AF7A" fontSize="7">RKS</text>
                    <text x="115" y="169" textAnchor="middle" fill="#D4AF7A" fontSize="7">MKS</text>
                    <text x="175" y="169" textAnchor="middle" fill="#D4AF7A" fontSize="7">AJH</text>
                    <text x="230" y="169" textAnchor="middle" fill="#D4AF7A" fontSize="7">SBH</text>
                  </svg>
                  <div className="flex justify-center gap-4 mt-6">
                    {[
                      { label: "4 Generations", color: "#D4AF7A" },
                      { label: "6 Members", color: "#52B788" },
                      { label: "Udupi Branch", color: "#95D5B2" },
                    ].map((b) => (
                      <span
                        key={b.label}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: b.color + "22", color: b.color }}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4"
                style={{
                  border: "1px solid rgba(212,175,122,0.3)",
                  boxShadow: "0 8px 32px rgba(27,67,50,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #A67C52, #D4AF7A)" }}
                  >
                    <Star size={18} className="text-white" fill="white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1B4332" }}>
                      Identity Verified
                    </p>
                    <p className="text-xs text-gray-500">Aadhaar · Peer · Elder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section
        ref={statsRef}
        className="py-16"
        style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} visible={statsVisible} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pillars ─── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "#A67C52", letterSpacing: "0.1em" }}
          >
            THE PILLARS OF OUR SAMAJ
          </p>
          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
          >
            Everything our community needs
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Four interconnected pillars that preserve heritage, build welfare, and connect generations.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          {PILLARS.map(({ icon: Icon, title, desc, href }, i) => (
            <Link
              key={title}
              href={href}
              className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              style={{
                background: "white",
                border: "1px solid #E8D5BC",
                animationDelay: `${i * 0.1}s`,
                boxShadow: "0 2px 8px rgba(27,67,50,0.06)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #F0FBF4, #FAF7F2)" }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div
                  className="flex items-center gap-1 mt-4 font-semibold text-sm transition-colors"
                  style={{ color: "#A67C52" }}
                >
                  Explore{" "}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Trust Section ─── */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #F0E6D3, #E8D5BC)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "#A67C52", letterSpacing: "0.1em" }}
              >
                A CIRCLE OF ABSOLUTE TRUST
              </p>
              <h2
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
              >
                Every member,
                <br />
                every connection —<br />
                verified.
              </h2>
              <div className="space-y-6">
                {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: "#0D2B1E" }}>
                        {title}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-3xl p-8 text-white"
              style={{
                background: "linear-gradient(160deg, #0D2B1E, #1B4332)",
                boxShadow: "0 25px 60px rgba(13,43,30,0.3)",
              }}
            >
              <p className="text-6xl mb-6">🌳</p>
              <blockquote
                className="text-xl font-medium leading-relaxed mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#D4AF7A" }}
              >
                "A tree is only as strong as its roots. Verification ensures the legacy you build is authentic and
                lasting."
              </blockquote>
              <p className="text-green-400 text-sm">— Samaj Heritage Council</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2
          className="text-5xl font-bold mb-6"
          style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
        >
          Join <span className="gold-shimmer">1,428 families</span>
          <br />
          already connected
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
          Start your lineage journey today. Connect with your ancestors, verify your heritage, and contribute to
          community welfare.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="btn-forest flex items-center gap-2">
            Begin Your Journey <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn-gold flex items-center gap-2">
            Access Portal
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: "linear-gradient(180deg, #0D2B1E, #061410)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #D4AF7A, #A67C52)" }}
              >
                <TreePine size={18} className="text-white" />
              </div>
              <div>
                <p
                  className="text-white font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Vamsha Vruksha
                </p>
                <p className="text-green-400 text-xs">Daivagnya Community Samaj Portal</p>
              </div>
            </Link>
            <div className="flex gap-6 flex-wrap justify-center">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Heritage Guidelines",
                "Contact Admin",
                "Community Governance",
              ].map((l) => (
                <Link key={l} href="#" className="text-green-400 text-sm hover:text-white transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-center text-green-600 text-xs">
            © 2024 Vamsha Vruksha — Daivagnya Community Samaj Portal. Preserving Legacies for Generations.
          </p>
        </div>
      </footer>
    </div>
  );
}
