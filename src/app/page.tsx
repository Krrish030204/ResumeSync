"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const scrollToTracker = () => {
    document.getElementById("tracker")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Floating background orbs for extra graphics */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The Zero-Cost ATS Optimization Engine</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Beat the bots.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Land the interview.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            "Your resume is your only ticket past the ATS guard. ResumeSync instantly reverse-engineers the job description, identifies missing critical keywords, and tells you exactly how to weave them in."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <Link href="/optimize" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
                Optimize Resume Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              onClick={scrollToTracker}
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
            >
              Application Tracker <ChevronDown className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* TRACKER SECTION */}
      <section id="tracker" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10 bg-black/20 backdrop-blur-sm rounded-t-3xl mt-10">
        <KanbanBoard />
      </section>
    </div>
  );
}
