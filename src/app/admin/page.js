// src/app/admin/page.js
"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/config/firebase";
import { ShieldAlert, Activity, ShieldBan, Terminal } from "lucide-react";

export default function CommandDashboard() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rtdb = getDatabase(app);
    const threatsRef = ref(rtdb, "threat_logs");

    const unsubscribe = onValue(threatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const structuredThreats = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setThreats(structuredThreats);
      } else {
        setThreats([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("🔒 SOC telemetry stream socket exception:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Activity className="text-emerald-500" /> Live Telemetry Stream
        </h1>
        <p className="text-neutral-400 mt-1">Real-time edge firewall monitoring and incident response parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <ShieldBan className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm font-semibold">Firewall Status</p>
            <p className="text-2xl font-bold text-white tracking-tight">ACTIVE</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm font-semibold">Total Blocked Attacks</p>
            <p className="text-2xl font-bold text-white tracking-tight">{threats.length}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Terminal className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm font-semibold">Active Blacklisted IPs</p>
            <p className="text-2xl font-bold text-white tracking-tight">Monitoring...</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Recent Intercepts
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Attacker IP</th>
                <th className="px-6 py-4">Rule Triggered</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center font-mono text-xs text-neutral-500 animate-pulse">Establishing secure telemetry socket connection...</td>
                </tr>
              ) : threats.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center font-mono text-sm text-neutral-500">No threats intercepted. Network perimeter is clear.</td>
                </tr>
              ) : (
                threats.map((threat) => (
                  <tr key={threat.id} className="border-b border-neutral-800 hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-400">{threat.timestamp ? new Date(threat.timestamp).toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 font-mono text-red-400 font-semibold">{threat.ip || "0.0.0.0"}</td>
                    <td className="px-6 py-4">
                      <span className="bg-black text-neutral-300 px-2.5 py-1 rounded text-xs border border-neutral-800 font-mono">{threat.rule_id || "WOLF-GENERIC-DROP"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono tracking-wide ${threat.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>{threat.severity || "HIGH"}</span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold font-mono text-xs tracking-wider">DROPPED</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}