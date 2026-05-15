"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TreePine, LayoutDashboard, Heart, Users, Shield,
  LogOut, Bell, ChevronRight, Menu, User, Lock
} from "lucide-react";
import { getUser, clearUser, type VVUser } from "@/lib/auth";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

const MEMBER_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard" },
  { icon: TreePine,        label: "Family Tree",  href: "/family-tree" },
  { icon: Heart,           label: "Matrimonial",  href: "/matrimonial" },
  { icon: Users,           label: "Welfare",      href: "/welfare" },
];

const ELDER_NAV = [
  { icon: LayoutDashboard, label: "Overview",       href: "/elder" },
  { icon: TreePine,        label: "Family Tree",    href: "/family-tree" },
  { icon: Shield,          label: "Verifications",  href: "/elder" },
  { icon: Heart,           label: "Matrimonial",    href: "/matrimonial" },
  { icon: Users,           label: "Welfare",        href: "/welfare" },
  { icon: LayoutDashboard, label: "Member Portal",  href: "/dashboard" },
];

interface Props {
  children: React.ReactNode;
  title?: string;
  /** If set, only this role can view the page — others are redirected */
  requiredRole?: "member" | "elder";
}

export default function SidebarLayout({ children, title, requiredRole }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<VVUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    // Role-gate: member trying to access elder-only pages
    if (requiredRole === "elder" && u.role !== "elder") {
      setUnauthorized(true);
      setUser(u);
      return;
    }
    setUser(u);
  }, [router, requiredRole]);

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  const navItems = user?.role === "elder" ? ELDER_NAV : MEMBER_NAV;
  const isElder = user?.role === "elder";

  const Sidebar = () => (
    <aside className="sidebar-bg w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-hidden">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <Link href={isElder ? "/elder" : "/dashboard"} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D4AF7A, #A67C52)" }}>
            <TreePine size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Vamsha Vruksha</p>
            <p className="text-green-400 text-xs">Daivadnya Samaj</p>
          </div>
        </Link>
      </div>

      {/* Role badge + User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-white/10 space-y-3">
          {/* Role badge */}
          <div className="flex items-center gap-2 px-3">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={isElder
                ? { background: "rgba(166,124,82,0.25)", color: "#D4AF7A" }
                : { background: "rgba(82,183,136,0.18)", color: "#52B788" }
              }
            >
              {isElder ? <Shield size={11} /> : <User size={11} />}
              {isElder ? "Elder & Admin" : "Community Member"}
            </span>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20">
              <img
                src={AVATAR_SVGS[user.avatar] ?? ""}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-green-400 text-xs truncate">{user.gotra} · {user.native.split(",")[0]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative"
              style={active
                ? { background: "rgba(212,175,122,0.18)", color: "#D4AF7A" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ backgroundColor: "#D4AF7A" }} />}
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" style={{ color: "#D4AF7A" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href={`/profile/${user?.avatar ?? "6"}`}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <User size={18} /><span className="text-sm">My Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={18} /><span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-64"><Sidebar /></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b"
          style={{ backgroundColor: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)", borderColor: "#E8D5BC" }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            {title && (
              <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-green-50 transition-colors">
              <Bell size={20} style={{ color: "#2D6A4F" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#A67C52" }} />
            </button>
            {user && (
              <Link href={`/profile/${user.avatar === "elder" ? "3" : user.avatar}`} className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2"
                  style={{ borderColor: isElder ? "#D4AF7A" : "#2D6A4F" }}>
                  <img src={AVATAR_SVGS[user.avatar] ?? ""} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold" style={{ color: "#1B4332" }}>{user.name}</p>
                  <p className="text-xs" style={{ color: isElder ? "#A67C52" : "#40916C" }}>
                    {isElder ? "Elder · Admin" : "Member"}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {unauthorized ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#FEF3C7" }}>
                <Lock size={36} style={{ color: "#A67C52" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1B4332" }}>
                  Elder Access Required
                </h2>
                <p className="text-gray-500 max-w-sm">
                  This section is restricted to verified Elders and Administrators. Please log in with an Elder account to continue.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { clearUser(); router.push("/login"); }}
                  className="px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #A67C52, #D4AF7A)" }}
                >
                  Switch to Elder Login
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: "#E8D5BC", color: "#1B4332" }}
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
}
