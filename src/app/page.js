// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/config/firebase";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Shield, Server, Blocks, Globe } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize our real-time database connection instance
    const rtdb = getDatabase(app);
    const contentRef = ref(rtdb, "portfolio_content");

    // 2. Establish an active WebSocket subscription to our dataset node
    const unsubscribe = onValue(contentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map the NoSQL object keys cleanly into a structured array
        const structuredData = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse(); // Sort descending so your newest deployments hit the top first
        
        // Filter out blogs so only projects show on the homepage
        const onlyProjects = structuredData.filter(item => item.type === "PROJECT");
        setProjects(onlyProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("🔒 Realtime Database stream connection exception:", error);
      setLoading(false);
    });

    // 3. Gracefully dismantle the listener socket connection on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12 space-y-16">
        
        {/* ================= HERO RECONNAISSANCE LAYER ================= */}
        <section className="py-12 relative max-w-6xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Identity & Bio */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 tracking-wider uppercase mb-2 animate-pulse">
                🛡️ Identity Verified: Pugazhmani K.
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Security Engineering & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AI System Architecture</span>
              </h1>
              
              {/* The "About Me" Block */}
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-5 shadow-inner">
                <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                  Welcome to my Unified Security Platform. I am a cybersecurity specialist and full-stack developer focused on building intelligent, defensive, and completely hardened infrastructure stacks. I specialize in deploying Web Application Firewalls, engineering SOC telemetry pipelines, and training custom AI models for threat detection.
                </p>
              </div>

              {/* Action Buttons & Links */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="/Pugazhmani_Resume.pdf" target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  View Dossier (Resume)
                </a>
                <a href="https://github.com/pugazh342" target="_blank" className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm border border-neutral-700">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/your-linkedin" target="_blank" className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm border border-neutral-700">
                  LinkedIn
                </a>
                <a href="https://huggingface.co/your-huggingface" target="_blank" className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm border border-neutral-700">
                  HuggingFace
                </a>
              </div>
            </div>

            {/* Right Column: Profile Image targeting */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative group">
                {/* Image Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none rounded-2xl z-20"></div>
                {/* Glowing border box */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                
                <img 
                  src="/profile.jpg" 
                  alt="Pugazhmani - Security Engineer" 
                  className="relative w-64 h-64 md:w-72 md:h-72 object-cover rounded-2xl border-2 border-neutral-800 z-10 grayscale hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Tech HUD overlays */}
                <div className="absolute -bottom-3 -right-3 bg-black border border-emerald-500/30 text-emerald-500 font-mono text-[10px] px-2 py-1 rounded z-30">
                  STATUS: ONLINE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CORE DEPLOYMENTS GRID LAYER ================= */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Blocks className="text-emerald-500 w-5 h-5" /> Active Core Deployments
            </h2>
            <p className="text-sm text-neutral-500">Live operational frameworks synchronized dynamically via secure CMS nodes.</p>
          </div>

          {loading ? (
            <div className="text-center p-12 bg-neutral-900/10 border border-neutral-900 rounded-xl font-mono text-xs text-neutral-500 animate-pulse">
              [SYSTEM] Syncing live dataset pipelines from core nodes...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-12 bg-neutral-900/20 border border-neutral-800/50 rounded-xl text-neutral-500 font-mono text-sm">
              [SYSTEM] Zero dynamic core deployments discovered. Access the command console to inject asset nodes.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all duration-300 group flex flex-col justify-between min-h-[240px] shadow-xl relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Component Card Header Accent */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {project.type === "PROJECT" ? (
                          <Server className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Shield className="w-5 h-5 text-teal-400" />
                        )}
                        <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                          {project.title || "Classified Deployment Target"}
                        </h3>
                      </div>
                      
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-neutral-500 hover:text-white flex items-center gap-1.5 text-xs font-mono border border-neutral-800 bg-black/40 px-2 py-1 rounded hover:border-neutral-700 transition-all"
                        >
                          <Globe className="w-3.5 h-3.5" /> CODE_REPO
                        </a>
                      )}
                    </div>

                    {/* Architecture Abstract Text */}
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {project.description || "No documentation payload mapped for this operational matrix segment."}
                    </p>
                  </div>

                  {/* 🛡️ RESILIENT HARDENED LABELS MAP ARRAY CHECK */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-800/40 mt-4">
                    {Array.isArray(project.tags) && project.tags.length > 0 ? (
                      project.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="bg-black text-neutral-400 font-mono text-[11px] px-2.5 py-0.5 rounded border border-neutral-800 tracking-wide uppercase shadow-inner"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-black text-emerald-500/70 font-mono text-[11px] px-2.5 py-0.5 rounded border border-emerald-950 tracking-wide uppercase">
                        SEC_CORE_NODE
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Global Footer Rendered at the Bottom */}
      <Footer />
    </>
  );
}