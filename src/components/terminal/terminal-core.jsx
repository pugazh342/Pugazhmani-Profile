// src/components/terminal/terminal-core.jsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function TerminalCore() {
  const [history, setHistory] = useState([
    { type: "system", text: "PUGAZHMANI.SYS Terminal Environment [Version 2.0.1]" },
    { type: "system", text: "Copyright (c) Pugazhmani Security Corporation. All rights reserved." },
    { type: "system", text: " " },
    { type: "system", text: "Type 'help' to see a list of available commands." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom whenever a new command is entered
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let newHistory = [...history, { type: "input", text: `visitor@pugazhmani.sys:~$ ${input}` }];

      switch (cmd) {
        case "":
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "help":
          newHistory.push(
            { type: "output", text: "Available commands:" },
            { type: "output", text: "  help       - Show this message" },
            { type: "output", text: "  about      - Display system administrator profile" },
            { type: "output", text: "  projects   - List classified security operations" },
            { type: "output", text: "  run-audit  - Initialize custom firewall diagnostic scan" },
            { type: "output", text: "  clear      - Clear terminal output" }
          );
          break;
        case "about":
          newHistory.push(
            { type: "output", text: "INITIALIZING BIO-METRIC SCAN... OK." },
            { type: "output", text: "> Name: Pugazhmani" },
            { type: "output", text: "> Role: Security Engineer & AI Architect" },
            { type: "output", text: "> Objective: Building unbreakable systems and unified security platforms." }
          );
          break;
        case "projects":
          newHistory.push(
            { type: "output", text: "[1] WOLFGUARD 360  - Enterprise XDR Platform" },
            { type: "output", text: "[2] CYPROLIB       - Custom Layer 7 WAF Engine" },
            { type: "output", text: "[3] CURACORE       - Healthcare AI Pipeline" },
            { type: "system", text: "Tip: Switch to GUI Mode to view visual architecture diagrams." }
          );
          break;
        case "run-audit":
          newHistory.push(
            { type: "output", text: "Starting diagnostic scan..." },
            { type: "output", text: "Scanning ingress ports... [OK]" },
            { type: "output", text: "Checking cyprolib middleware... [ACTIVE]" },
            { type: "system", text: "[PASS] System is actively defended against Layer 7 attacks." }
          );
          break;
        default:
          newHistory.push({ type: "error", text: `bash: ${cmd}: command not found` });
      }

      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto h-[600px] bg-black border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono text-sm"
      onClick={() => document.getElementById("terminal-input")?.focus()}
    >
      {/* Terminal Header Bar */}
      <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-neutral-500 text-xs font-semibold">root@pugazhmani-sys:~</span>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {history.map((line, idx) => (
          <div 
            key={idx} 
            className={`mb-1 ${
              line.type === "input" ? "text-neutral-300" :
              line.type === "system" ? "text-emerald-500 font-bold" :
              line.type === "error" ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {line.text}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-emerald-500 font-bold mr-2">visitor@pugazhmani.sys:~$</span>
          <input
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent text-neutral-300 outline-none caret-white"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}