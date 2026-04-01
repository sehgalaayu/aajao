"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarProps {
  activePage?: "explore" | "how-it-works" | "other";
}

export const Navbar = ({ activePage = "other" }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline uppercase">
          Aajao
        </Link>

        <div className="hidden md:flex items-center gap-12">
          <Link
            href="/"
            className={`${
              activePage === "explore"
                ? "text-primary font-bold italic border-b-2 border-primary pb-1"
                : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } text-sm tracking-wide transition-all`}
          >
            Explore
          </Link>
          <Link
            href="/how-it-works"
            className={`${
              activePage === "how-it-works"
                ? "text-primary font-bold italic border-b-2 border-primary pb-1"
                : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } text-sm tracking-wide transition-all`}
          >
            How it Works
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <button className="hidden md:block text-on-surface font-semibold hover:text-primary transition-colors text-sm">
            Login
          </button>
          <Link
            href="/create"
            className="bg-gradient-to-r from-primary to-primary-container text-background font-black px-8 py-3 rounded-full shadow-xl bounce-interaction text-sm uppercase tracking-wider hover:scale-105 transition-transform active:scale-95"
          >
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
};
