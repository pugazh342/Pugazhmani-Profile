// src/app/sandbox/page.js
"use client";

import { useState } from "react";
import Navbar from "@/components/shared/navbar";
import { ShieldAlert, TerminalSquare, Send, Activity } from "lucide-react";

export default function SandboxMode() {
  const [payload, setPayload] = useState("");
  const [responseLog, setResponseLog] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const firePayload = async () => {
    if (!payload.trim()) return;
    
    setIsScanning(true);
    setResponseLog(null);

    try {
      // We send a request to the server with the payload in the URL.
      // Your custom edge firewall (proxy.js) will intercept this BEFORE it ever reaches a real API!
      const res = await fetch(`/api/dummy-route?payload=${encodeURIComponent(payload)}`);
      const data = await res.json();

      setResponseLog({
        status: res.status,
        data: data
      });
    } catch (error) {
      setResponseLog({ status: 500, data: { error: "Network/Server Error" } });
    }

    setIsScanning(false);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col min-h-[80vh]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="text-emerald-500" />
            Live WAF Sandbox
          </h1>
          <p className="text-neutral-400 mt-2 max-w-2xl">
            This portfolio is protected by a custom Layer-7 Web Application Firewall. 
            Try bypassing it by sending malicious payloads (SQLi, XSS, Path Traversal) below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: The Attacker's Terminal */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold">
              <TerminalSquare size={20} />
              <span>Attack Vector Input</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-500 mb-2">Inject Malicious String:</label>
                <textarea 
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="e.g., ' OR 1=1 --   OR   <script>alert('xss')</script>"
                  className="w-full h-32 bg-black border border-neutral-700 rounded-lg p-3 text-neutral-300 font-mono text-sm outline-none focus:border-emerald-500 transition-colors"
                  spellCheck="false"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPayload("' OR '1'='1")} className="px-3 py-1 bg-neutral-800 text-xs rounded hover:bg-neutral-700 text-neutral-400 transition">Test SQLi</button>
                <button onClick={() => setPayload("<script>fetch('http://hacker.com')</script>")} className="px-3 py-1 bg-neutral-800 text-xs rounded hover:bg-neutral-700 text-neutral-400 transition">Test XSS</button>
                <button onClick={() => setPayload("../../../etc/passwd")} className="px-3 py-1 bg-neutral-800 text-xs rounded hover:bg-neutral-700 text-neutral-400 transition">Test Traversal</button>
                <button onClick={() => setPayload("nmap -sV -p-")} className="px-3 py-1 bg-neutral-800 text-xs rounded hover:bg-neutral-700 text-neutral-400 transition">Test Bot Signature</button>
              </div>

              <button 
                onClick={firePayload}
                disabled={isScanning || !payload}
                className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? "Analyzing Traffic..." : "Fire Payload"}
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: The Firewall Response Monitor */}
          <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-lg flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-neutral-400 font-semibold z-10">
              <ShieldAlert size={20} className={responseLog?.status === 403 ? "text-red-500" : "text-neutral-500"} />
              <span>Firewall Telemetry Output</span>
            </div>

            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-y-auto relative z-10">
              {!responseLog && !isScanning && (
                <div className="h-full flex items-center justify-center text-neutral-600">
                  Awaiting inbound traffic...
                </div>
              )}

              {isScanning && (
                <div className="text-emerald-500 animate-pulse">
                  [SYSTEM] Intercepting request at edge node...
                </div>
              )}

              {responseLog && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className={`mb-4 inline-block px-3 py-1 rounded text-xs font-bold ${responseLog.status === 403 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    HTTP STATUS: {responseLog.status} {responseLog.status === 403 ? "FORBIDDEN" : "OK"}
                  </div>
                  <pre className="text-neutral-300 whitespace-pre-wrap word-break">
                    {JSON.stringify(responseLog.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Background warning glow if attack detected */}
            {responseLog?.status === 403 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
            )}
          </div>

        </div>
      </main>
    </>
  );
}