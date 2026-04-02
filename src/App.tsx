"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Navbar } from "@/src/components/common/Navbar";

const HomeBelowFold = dynamic(
  () => import("@/src/components/home/HomeBelowFold"),
  {
    loading: () => (
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto">
        <div className="h-40 sm:h-56 rounded-[2rem] border border-white/10 bg-surface/35 animate-pulse" />
      </section>
    ),
  },
);

const Hero = () => (
  <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 md:pt-56 pb-20 sm:pb-28 md:pb-48 max-w-7xl mx-auto overflow-visible">
    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/8 blur-[120px] rounded-full -z-10" />

    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 relative"
      >
        <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 mb-6 sm:mb-10 rounded-full bg-tertiary text-background text-[10px] sm:text-[11px] font-black tracking-[0.18em] sm:tracking-[0.2em] uppercase rotate-[-2deg] shadow-md">
          🇮🇳 India's Party Engine
        </div>
        <h1 className="font-headline text-5xl sm:text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-6 sm:mb-10 italic">
          Plan anything. <span className="block">Without the</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary-container drop-shadow-2xl">
            WhatsApp chaos.
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant leading-relaxed mb-8 sm:mb-14 max-w-lg font-medium opacity-90">
          Built for private friend groups to plan one clean scene. Create a
          link, share it, and instantly see who is actually coming.
        </p>
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <Link
            href="/create"
            className="inline-block bg-gradient-to-br from-primary to-primary-container text-background text-lg sm:text-2xl font-black px-7 sm:px-12 py-4 sm:py-7 rounded-2xl shadow-[8px_8px_0_rgba(255,0,255,0.16)] bounce-interaction hover:shadow-[4px_4px_0_rgba(255,0,255,0.16)]"
          >
            🔥 Aajao, scene banate hain
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative min-h-[420px] sm:min-h-[500px]">
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [2, 3, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative md:absolute top-0 right-0 md:right-10 w-full max-w-[20rem] mx-auto md:mx-0 p-6 sm:p-7 glass-card rounded-[2rem] sm:rounded-[2.5rem] shadow-lg z-10 border border-white/12"
        >
          <div className="flex justify-between items-start mb-5 sm:mb-6">
            <span className="text-5xl">🏏</span>
            <span className="bg-tertiary text-background text-[10px] px-4 py-2 rounded-full font-black tracking-widest">
              FULL SCENE
            </span>
          </div>
          <h3 className="font-headline font-black text-2xl sm:text-3xl leading-tight mb-2">
            Sunday Cricket
          </h3>
          <p className="text-sm font-bold text-on-surface-variant opacity-80">
            Shivaji Park • 7:00 AM
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-surface shadow-lg"
                  src={`https://picsum.photos/seed/hero${i}/100/100`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <span className="text-sm font-black text-primary italic">
              Rahul +12 going
            </span>
          </div>
        </motion.div>

        <div className="relative md:absolute mt-6 md:mt-0 md:bottom-20 left-0 md:left-[-40px] w-full max-w-64 p-5 sm:p-6 glass-card rounded-[2rem] shadow-lg z-20 border border-white/10 rotate-[-2deg]">
          <h3 className="font-headline font-black text-2xl mb-2">
            House Party 🍻
          </h3>
          <p className="text-xs font-bold text-on-surface-variant mb-5 opacity-70">
            Rohan's place, Bandra
          </p>
          <div className="flex items-center gap-3 text-primary font-black text-sm uppercase italic tracking-wider">
            <PartyPopper size={20} />
            Aajao Yaar!
          </div>
        </div>

        <div className="hidden md:block absolute top-[10%] left-[20%] text-7xl opacity-35 -z-10 rotate-[12deg]">
          🍕
        </div>
      </div>
    </div>
  </section>
);

export default function App() {
  const [loadBelowFold, setLoadBelowFold] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target || loadBelowFold) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setLoadBelowFold(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadBelowFold]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-background relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(255,0,255,0.14),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(241,193,0,0.12),transparent_35%)]" />
      <Navbar activePage="explore" />
      <Hero />
      <div ref={triggerRef} className="h-px" />
      {loadBelowFold ? (
        <HomeBelowFold />
      ) : (
        <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto">
          <div className="h-40 sm:h-56 rounded-[2rem] border border-white/10 bg-surface/35 animate-pulse" />
        </section>
      )}
    </div>
  );
}
