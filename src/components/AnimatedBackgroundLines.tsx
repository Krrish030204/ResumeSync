"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackgroundLines() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-950">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{ maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)" }}
      />
      
      {/* Animated glowing orbs / gradient blobs */}
      <motion.div
        animate={{
          x: ["0%", "100%", "0%"],
          y: ["0%", "50%", "0%"],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: ["0%", "-100%", "0%"],
          y: ["0%", "-50%", "0%"],
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[60%] right-[0%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]"
      />

      {/* Sweeping light beam */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 1, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] -rotate-12"
      />
    </div>
  );
}
