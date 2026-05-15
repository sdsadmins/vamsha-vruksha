import Link from "next/link";
import { TreePine } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{backgroundColor: "#1B4332"}} className="mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TreePine size={20} className="text-green-300" />
            <div>
              <p style={{fontFamily: "'Playfair Display', serif"}} className="text-white font-semibold">Vamsha Vruksha</p>
              <p className="text-green-300 text-xs">Daivagnya Community Samaj Portal. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {["Privacy Policy", "Terms of Service", "Heritage Guidelines", "Contact Admin"].map((link) => (
              <Link key={link} href="#" className="text-green-300 text-sm hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
