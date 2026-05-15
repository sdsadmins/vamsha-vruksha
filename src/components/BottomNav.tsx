"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TreePine, Calendar, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Family Tree", icon: TreePine, href: "/family-tree" },
  { label: "Events", icon: Calendar, href: "/events" },
  { label: "Profile", icon: User, href: "/profile/6" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{backgroundColor: "#FAF7F2", borderTop: "1px solid #E5DDD0"}} className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center py-2 gap-1"
              style={{color: active ? "#1B4332" : "#9CA3AF"}}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
