// src/app/blogs/page.js
"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/config/firebase";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { BookOpen, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rtdb = getDatabase(app);
    const contentRef = ref(rtdb, "portfolio_content");

    const unsubscribe = onValue(contentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter ONLY for items marked as "BLOG" in the CMS
        const structuredData = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(item => item.type === "BLOG")
          .reverse();
        
        setBlogs(structuredData);
      } else {
        setBlogs([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12 space-y-8 max-w-5xl min-h-[70vh]">
        <div className="border-b border-neutral-800 pb-8 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="text-emerald-500 w-8 h-8" />
            Research & Write-ups
          </h1>
          <p className="text-neutral-400 mt-2">Deep dives into vulnerabilities, AI models, and architecture design.</p>
        </div>

        {loading ? (
          <div className="text-center font-mono text-sm text-neutral-500 animate-pulse">
            Decrypting research archives...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center p-12 bg-neutral-900/20 border border-neutral-800/50 rounded-xl text-neutral-500 font-mono text-sm">
            [SYSTEM] No research logs found. Publish a blog via the CMS.
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white pr-4">{blog.title}</h2>
                  
                  {/* Dynamic Route Link pointing to our specific Markdown reader */}
                  <Link 
                    href={`/blogs/${blog.id}`} 
                    className="shrink-0 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border border-emerald-500/20"
                  >
                    Decrypt File <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                
                <p className="text-neutral-300 leading-relaxed">{blog.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {blog.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-black text-neutral-400 font-mono text-xs px-2 py-1 rounded border border-neutral-800 uppercase shadow-inner">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      
      {/* Global Footer Rendered at the Bottom */}
      <Footer />
    </>
  );
}