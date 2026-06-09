"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full h-16 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
            ResumeSync
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname === "/" ? "text-white" : "text-zinc-400"
            )}
          >
            Tracker
          </Link>
          <Link 
            href="/optimize" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname === "/optimize" ? "text-white" : "text-zinc-400"
            )}
          >
            Fix My CV
          </Link>
        </div>
      </div>
    </nav>
  );
}
