// src/app/admin/content/page.js
"use client";

import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { app } from "@/config/firebase";
import { Database, Plus, Loader2, CheckCircle2, Image as ImageIcon, FileText } from "lucide-react";

export default function PortfolioCMS() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Expanded state to hold our new blog parameters
  const [formData, setFormData] = useState({
    title: "",
    type: "PROJECT",
    description: "",
    techStack: "",
    githubLink: "",
    imageUrl: "",       // New: For Blog Cover Images
    markdownBody: "",   // New: For the actual Markdown post
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const rtdb = getDatabase(app);
      const contentRef = ref(rtdb, "portfolio_content");
      const newContentRef = push(contentRef);

      const tagsArray = formData.techStack.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

      // Dynamic payload based on content type
      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description, // Serves as the short abstract/summary for blogs
        tags: tagsArray,
        githubLink: formData.githubLink,
        createdAt: new Date().toISOString()
      };

      // Only attach blog-specific data if it's a blog
      if (formData.type === "BLOG") {
        payload.imageUrl = formData.imageUrl;
        payload.markdownBody = formData.markdownBody;
      }

      await set(newContentRef, payload);

      setSuccess(true);
      // Reset form
      setFormData({ title: "", type: "PROJECT", description: "", techStack: "", githubLink: "", imageUrl: "", markdownBody: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("RTDB Write Error: ", error);
      alert("Failed to save content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Database className="text-emerald-500" /> Portfolio CMS (RTDB Mode)
        </h1>
        <p className="text-neutral-400 mt-1">Manage your active operations and research write-ups dynamically.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" /> Deploy New Content
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <p>Content deployed successfully to Realtime Database instance.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Title / Codename</label>
              <input
                type="text" required value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g., Deepfake Analysis Report"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Content Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-black border border-emerald-900/50 rounded-lg p-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="PROJECT">Security Project</option>
                <option value="BLOG">Research Write-up (Blog)</option>
              </select>
            </div>
          </div>

          {/* Abstract / Short Description (Used for both) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              {formData.type === "BLOG" ? "Abstract / Short Summary" : "Architecture Description"}
            </label>
            <textarea
              required rows="3" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
              placeholder={formData.type === "BLOG" ? "A short abstract to display on the blog cards..." : "Describe the system architecture..."}
            />
          </div>

          {/* Tech Stack & Links (Used for both) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Tags / Tech Stack (Comma Separated)</label>
              <input
                type="text" required value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="Python, Malware Analysis, Research"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">GitHub / Paper Link (Optional)</label>
              <input
                type="url" value={formData.githubLink}
                onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {/* ================= CONDITIONAL BLOG SECTION ================= */}
          {formData.type === "BLOG" && (
            <div className="space-y-6 pt-6 mt-6 border-t border-neutral-800/80 animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Extended Blog Parameters
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Cover Image URL (Optional)
                </label>
                <input
                  type="url" value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-[10px] text-neutral-500 mt-1">Paste a direct image link. Leave blank for a default system aesthetic.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Markdown Content Body</label>
                <textarea
                  rows="15" required={formData.type === "BLOG"} value={formData.markdownBody}
                  onChange={(e) => setFormData({...formData, markdownBody: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-4 text-neutral-300 font-mono text-sm outline-none focus:border-emerald-500 transition-colors leading-relaxed"
                  placeholder="## Vulnerability Analysis&#10;&#10;Write your deep-dive here using standard Markdown format..."
                />
              </div>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Push to Database"}
          </button>
        </form>
      </div>
    </div>
  );
}