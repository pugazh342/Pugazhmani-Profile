// src/app/blogs/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "@/config/firebase";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ReactMarkdown from "react-markdown";
import { Calendar, ChevronLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogPost() {
  const params = useParams(); // Grabs the specific blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const rtdb = getDatabase(app);
        const blogRef = ref(rtdb, `portfolio_content/${params.id}`);
        const snapshot = await get(blogRef);
        
        if (snapshot.exists()) {
          setBlog(snapshot.val());
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-neutral-500 font-mono text-sm">Decrypting secure file...</p>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-mono">ERROR 404: File classified or deleted.</p>
          <Link href="/blogs" className="mt-4 text-emerald-500 hover:underline flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Return to Archives
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl animate-in fade-in duration-500">
        
        {/* Navigation & Header */}
        <Link href="/blogs" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 text-sm font-mono mb-8 w-fit transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Research Logs
        </Link>

        <article className="space-y-8">
          <header className="space-y-4 border-b border-neutral-800 pb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags?.map((tag, idx) => (
                <span key={idx} className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded border border-emerald-500/20 uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm font-mono text-neutral-500 pt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>AUTHOR: PUGAZHMANI K.</span>
            </div>
          </header>

          {/* Optional Cover Image */}
          {blog.imageUrl && (
            <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden border border-neutral-800">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          )}

          {/* Markdown Rendering Engine */}
          <div className="prose prose-invert prose-emerald max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-neutral-800 prose-img:rounded-xl">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-emerald-400 mt-10 mb-4 pb-2 border-b border-neutral-800" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4" {...props} />,
                p: ({node, ...props}) => <p className="text-neutral-300 leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-neutral-800/50 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
                    : <code className="block bg-black border border-neutral-800 rounded-lg p-4 font-mono text-sm text-neutral-300 overflow-x-auto my-6" {...props} />,
              }}
            >
              {blog.markdownBody || blog.description}
            </ReactMarkdown>
          </div>

        </article>
      </main>
      <Footer />
    </>
  );
}