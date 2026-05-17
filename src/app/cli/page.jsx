// src/app/cli/page.js
import Navbar from "@/components/shared/navbar";
import TerminalCore from "@/components/terminal/terminal-core";

export default function CliMode() {
  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        
        <div className="w-full max-w-4xl mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Developer Terminal</h1>
            <p className="text-neutral-500 text-sm">Direct console access to the unified architecture.</p>
          </div>
        </div>

        {/* Load the Interactive Terminal Component */}
        <TerminalCore />

      </main>
    </>
  );
}