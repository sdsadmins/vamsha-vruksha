"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TreePine, LayoutDashboard, Heart, Users, Shield,
  LogOut, Bell, ChevronRight, Settings, Menu, X, User
} from "lucide-react";
import { getUser, clearUser, type VVUser } from "@/lib/auth";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TreePine,        label: "Family Tree",   href: "/family-tree" },
  { icon: Heart,           label: "Matrimonial",   href: "/matrimonial" },
  { icon: Users,           label: "Welfare",       href: "/welfare" },
  { icon: Shield,          label: "Elder Portal",  href: "/elder" },
];

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function SidebarLayout({ children, title }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<VVUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  const Sidebar = () => (
    <aside className="sidebar-bg w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-hidden">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{background: "linear-gradient(135deg, #D4AF7A, #A67C52)"}}>
            <TreePine size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{fontFamily: "'Playfair Display', serif"}}>Vamsha Vruksha</p>
            <p className="text-green-400 text-xs">Daivadnya Samaj</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{backgroundColor: "rgba(255,255,255,0.06)"}}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                 style={{background: "linear-gradient(135deg, #A67C52, #D4AF7A)"}}>
              {user.avatar}
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
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative"
              style={active
                ? { background: "rgba(212,175,122,0.18)", color: "#D4AF7A" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{backgroundColor: "#D4AF7A"}} />}
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" style={{color: "#D4AF7A"}} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/profile/6" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{color: "rgba(255,255,255,0.5)"}}>
          <User size={18} /><span className="text-sm">My Profile</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-400/10">
          <LogOut size={18} /><span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen" style={{backgroundColor: "#FAF7F2"}}>
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
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b"
          style={{backgroundColor: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)", borderColor: "#E8D5BC"}}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            {title && (
              <div>
                <h1 className="text-xl font-bold" style={{fontFamily: "'Playfair Display', serif", color: "#1B4332"}}>{title}</h1>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-forest-800/5 transition-colors">
              <Bell size={20} style={{color: "#2D6A4F"}} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{backgroundColor: "#A67C52"}} />
            </button>
            {user && (
              <Link href="/profile/6" className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     style={{background: "linear-gradient(135deg, #1B4332, #2D6A4F)"}}>
                  {user.avatar}
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
