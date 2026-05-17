// src/components/shared/navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, LayoutDashboard, ShieldAlert, BookOpen } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Don't show standard navigation if they are inside the secure Admin SOC dashboard
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo area */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight">PUGAZHMANI<span className="text-emerald-500">.SYS</span></span>
        </div>

        {/* Navigation Toggles */}
        <nav className="flex items-center gap-4">
          <Link 
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">GUI Mode</span>
          </Link>

          <Link 
            href="/cli"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/cli" ? "bg-neutral-800 text-emerald-400" : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/50"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">CLI Mode</span>
          </Link>

          <Link 
            href="/sandbox"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/sandbox" ? "bg-neutral-800 text-emerald-400" : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/50"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Sandbox</span>
          </Link>

          <Link 
            href="/blogs"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/blogs" ? "bg-neutral-800 text-emerald-400" : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Research Logs</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}