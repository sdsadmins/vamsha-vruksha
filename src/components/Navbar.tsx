import Link from "next/link";
import { TreePine } from "lucide-react";

export default function Navbar() {
  return (
    <nav style={{backgroundColor: "#FAF7F2", borderBottom: "1px solid #E5DDD0"}} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div style={{backgroundColor: "#1B4332"}} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <TreePine size={18} className="text-white" />
            </div>
            <span style={{color: "#1B4332", fontFamily: "'Playfair Display', serif"}} className="text-lg font-semibold hidden sm:block">
              Daivajna Samaja
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {["Lineage", "Welfare", "Connections", "Governance", "Verification"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{color: "#4A5568"}}
                className="text-sm hover:text-green-800 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/login"
            style={{backgroundColor: "#1B4332"}}
            className="px-4 py-2 text-white text-sm rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Access Portal
          </Link>
        </div>
      </div>
    </nav>
  );
}
