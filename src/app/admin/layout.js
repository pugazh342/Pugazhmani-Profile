// src/app/admin/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, LogOut, LayoutDashboard, Database } from "lucide-react";
import Link from "next/link";

// ADDED 'async' HERE 👇
export default async function AdminLayout({ children }) {
  
  // ADDED 'await' HERE 👇 (Required for Next.js 15+)
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  // 2. If no valid hardware-bound session exists, kick them back to login instantly
  if (!sessionCookie) {
    redirect("/login");
  }

  // 3. If authenticated, render the secure Command Center shell
  return (
    <div className="min-h-screen bg-black flex text-neutral-200">
      {/* ... the rest of your layout code stays exactly the same ... */}
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10 text-white">
          <ShieldCheck className="text-emerald-500 w-6 h-6" />
          <span className="font-bold tracking-tight">SOC COMMAND</span>
        </div>

        <nav className="flex-1 space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Telemetry Dashboard
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors">
            <Database className="w-4 h-4" /> Portfolio CMS
          </Link>
        </nav>

        {/* Note: Real logout logic would require an API call to clear the cookie */}
        <div className="mt-auto pt-6 border-t border-neutral-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left text-neutral-500 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-neutral-800 bg-neutral-950/50 flex items-center px-8">
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800/50">
            Encrypted Admin Channel
          </span>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>

    </div>
  );
}