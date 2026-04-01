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
    <main className="px-6 py-8 mx-auto w-full max-w-xl relative">
      <div className="fixed top-[8%] left-[-8%] w-64 h-64 bg-primary/8 blur-[120px] rounded-full -z-20 pointer-events-none" />
      <div className="fixed bottom-[5%] right-[-10%] w-72 h-72 bg-secondary-container/15 blur-[120px] rounded-full -z-20 pointer-events-none" />

      {toast ? (
        <div
          style={{
            position: "fixed",
            right: "24px",
            top: "24px",
            background: "#ffabf3",
            color: "#14021f",
            padding: "10px 14px",
            borderRadius: "12px",
            fontWeight: 700,
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
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
