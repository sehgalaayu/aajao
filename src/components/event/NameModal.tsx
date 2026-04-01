import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type NameModalProps = {
  open: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

export function NameModal({ open, onSubmit, onClose }: NameModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // Pre-fill from localStorage if available
      const saved = localStorage.getItem("aajao_name");
      if (saved) {
        setName(saved);
      }
      // Focus the input after animation
      const timeout = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timeout);
    }
    // Reset when closed
    setError(null);
  }, [open]);

  const handleSubmit = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Name can't be empty");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length < 2) {
      setError("At least 2 characters");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > 25) {
      setError("Max 25 characters");
      inputRef.current?.focus();
      return;
    }

    // Block pure numeric or special-character-only names
    if (!/[a-zA-Z\u0900-\u097F\u0980-\u09FF]/.test(trimmed)) {
      setError("Enter a real name");
      inputRef.current?.focus();
      return;
    }

    localStorage.setItem("aajao_name", trimmed);
    setError(null);
    onSubmit(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 backdrop-blur-xl bg-surface/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: 40, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-sm bg-surface-container-lowest border border-white/10 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,0,255,0.12)] relative overflow-hidden"
          >
            {/* Decoration blob */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-headline font-black text-2xl tracking-tight mb-1">
                What's your name? 👋
              </h3>
              <p className="text-on-surface-variant text-sm mb-6">
                So everyone knows who pulled up
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="Rahul"
                    maxLength={25}
                    autoComplete="given-name"
                    className="w-full bg-surface-container-high text-on-surface py-4 px-5 rounded-xl border border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)] transition-all text-lg font-semibold outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant/50 tracking-wider">
                    {name.trim().length}/25
                  </span>
                </div>

                {error && (
                  <p className="text-error text-sm font-bold bg-error/10 px-3 py-1.5 rounded-lg">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-[2] py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-black text-base active:scale-95 transition-transform shadow-[0_4px_16px_rgba(255,0,255,0.2)]"
                >
                  Let's go 🔥
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
