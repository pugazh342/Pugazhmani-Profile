// src/components/shared/footer.jsx
import { Code2, Briefcase, FileText, Cpu, TerminalSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black py-8 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <TerminalSquare className="w-5 h-5 text-emerald-500" />
            PUGAZHMANI.SYS
          </div>
          <p className="text-neutral-500 text-xs font-mono">
            © {new Date().getFullYear()} CyberWolf Architect. All operational systems normal.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="/Pugazhmani_Resume.pdf" target="_blank" className="text-neutral-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-sm font-mono">
            <FileText className="w-4 h-4" /> RESUME
          </a>
          <a href="https://github.com/pugazh342" target="_blank" className="text-neutral-500 hover:text-white transition-colors">
            <Code2 className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/your-linkedin" target="_blank" className="text-neutral-500 hover:text-[#0a66c2] transition-colors">
            {/* Swapped Linkedin for Briefcase to bypass the Lucide brand restriction */}
            <Briefcase className="w-5 h-5" />
          </a>
          <a href="https://huggingface.co/your-huggingface" target="_blank" className="text-neutral-500 hover:text-[#ffd21e] transition-colors flex items-center gap-1 text-sm font-mono">
            <Cpu className="w-5 h-5" /> HF_MODELS
          </a>
        </div>

      </div>
    </footer>
  );
}