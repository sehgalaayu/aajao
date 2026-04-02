"use client";

import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  activePage?: "explore" | "how-it-works" | "other";
}

export const Navbar = ({ activePage = "other" }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex justify-between items-center gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5">
          <span className="relative rounded-full bg-primary/8 ring-1 ring-primary/25 p-1 shadow-[0_0_26px_rgba(255,0,255,0.3)]">
            <Image
              src="/brand/aajao-ball-icon.png"
              alt="Aajao logo"
              width={56}
              height={56}
              className="h-9 w-9 sm:h-12 sm:w-12 rounded-full object-cover"
              priority
            />
          </span>
          <span className="text-xl sm:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline uppercase">
            Aajao
          </span>
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

        <div className="flex items-center gap-2 sm:gap-8">
          <Link
            href="/how-it-works"
            className="md:hidden text-on-surface-variant font-semibold hover:text-primary transition-colors text-[11px] uppercase tracking-wider"
          >
            How it works
          </Link>
          <Link
            href="/host"
            className="md:hidden text-on-surface font-semibold hover:text-primary transition-colors text-[11px] uppercase tracking-wider"
          >
            Host
          </Link>
          <Link
            href="/host"
            className="hidden md:block text-on-surface font-semibold hover:text-primary transition-colors text-sm"
          >
            Login
          </Link>
          <Link
            href="/create"
            className="bg-gradient-to-r from-primary to-primary-container text-background font-black px-3.5 sm:px-8 py-2 sm:py-3 rounded-full shadow-xl bounce-interaction text-[11px] sm:text-sm uppercase tracking-wider hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
          >
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
};
