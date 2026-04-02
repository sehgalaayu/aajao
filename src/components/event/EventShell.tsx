import Link from "next/link";
import React from "react";

export function EventShell({
  children,
  toast,
  error,
  hideCreateLink,
}: {
  children: React.ReactNode;
  toast?: string | null;
  error?: string | null;
  hideCreateLink?: boolean;
}) {
  return (
    <main className="px-4 sm:px-6 py-6 sm:py-8 mx-auto w-full max-w-xl relative">
      <div className="fixed top-[8%] left-[-8%] w-64 h-64 bg-primary/8 blur-[120px] rounded-full -z-20 pointer-events-none" />
      <div className="fixed bottom-[5%] right-[-10%] w-72 h-72 bg-secondary-container/15 blur-[120px] rounded-full -z-20 pointer-events-none" />

      {toast ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 bg-primary text-[#14021f] px-3.5 py-2.5 rounded-xl font-bold z-[1000] shadow-[0_8px_24px_rgba(0,0,0,0.2)] text-sm w-[calc(100%-2rem)] sm:w-auto text-center">
          {toast}
        </div>
      ) : null}

      {!hideCreateLink && (
        <p className="mb-6 opacity-70 hover:opacity-100 transition-opacity">
          <Link href="/create">← Create another event</Link>
        </p>
      )}

      {error ? (
        <p className="bg-red-500/20 text-red-500 font-bold p-3 rounded-xl mb-4 text-sm">
          {error}
        </p>
      ) : null}

      {children}
    </main>
  );
}
