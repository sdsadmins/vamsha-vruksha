"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { clearSession, getUser, type VVUser } from "@/lib/auth";

export const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Members", href: "/admin/members" },
  { icon: HeartHandshake, label: "Community Campaigns", href: "/admin/community_campaign" },
  { icon: ListChecks, label: "Dropdown Options", href: "/admin/dropdowns" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Right-hand slot in the page header (buttons, counters). */
  actions?: React.ReactNode;
}

/**
 * Frame for every admin page: sidebar, header, and the role gate. The admin
 * signs in through the ordinary /login; anyone arriving here without a session
 * is sent there, and a signed-in member or elder is sent to their own home.
 */
export default function AdminShell({ children, title, subtitle, actions }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<VVUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.role !== "admin") {
      router.replace(u.role === "elder" ? "/elder" : "/dashboard");
      return;
    }
    setAdmin(u);
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  if (!admin) return null;

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {ADMIN_NAV.map(({ icon: Icon, label, href }) => {
        const active =
          pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative"
            style={
              active
                ? { background: "rgba(212,175,122,0.18)", color: "#C4823A" }
                : { color: "rgba(255,255,255,0.65)" }
            }
          >
            {active && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                style={{ backgroundColor: "#C4823A" }}
              />
            )}
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebar = (
    <aside className="sidebar-bg w-64 h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C4823A, #8B5E3C)" }}
          >
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p
              className="text-white font-bold text-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Daivajna Samaja
            </p>
            <p className="text-green-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #C4823A, #8B5E3C)" }}
          >
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{admin.name}</p>
            <p className="text-green-400 text-xs truncate">@{admin.userName}</p>
          </div>
        </div>
      </div>

      {nav}

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed left-0 top-0 bottom-0 z-40">{sidebar}</div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full">{sidebar}</div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header
          className="sticky top-0 z-30 border-b px-4 lg:px-8 py-4 flex items-center gap-4"
          style={{ backgroundColor: "rgba(250,247,242,0.92)", borderColor: "#E8D5BC", backdropFilter: "blur(8px)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#1B4332" }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <h1
              className="text-xl lg:text-2xl font-bold truncate"
              style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}
            >
              {title}
            </h1>
            {subtitle && <p className="text-xs lg:text-sm text-gray-500 truncate">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/* ───────────── Small shared bits every admin page uses ───────────── */

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border bg-white ${className}`}
      style={{ borderColor: "#E8D5BC" }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean },
) {
  const { loading, children, className = "", disabled, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`px-4 py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
      style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function Badge({ tone, children }: { tone: "green" | "gold" | "red" | "gray"; children: React.ReactNode }) {
  const styles: Record<typeof tone, React.CSSProperties> = {
    green: { background: "#D8F3DC", color: "#1B4332" },
    gold: { background: "#F7EDDA", color: "#8B5E3C" },
    red: { background: "#FEE2E2", color: "#991B1B" },
    gray: { background: "#F3F4F6", color: "#4B5563" },
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={styles[tone]}>
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  if (role === "admin") return <Badge tone="red">Admin</Badge>;
  if (role === "elder") return <Badge tone="gold">Elder</Badge>;
  return <Badge tone="gray">Member</Badge>;
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="text-sm rounded-xl px-4 py-3" style={{ background: "#FEE2E2", color: "#991B1B" }}>
      {children}
    </p>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <span className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "#DFC5A0", borderTopColor: "#1B4332" }} />
    </div>
  );
}

export const inputClass =
  "w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white focus:border-[#1B4332]";
export const inputStyle = { borderColor: "#DFC5A0" };
