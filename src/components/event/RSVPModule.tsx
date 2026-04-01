import React, { useEffect, useRef, useState } from "react";
import type { EventRecord } from "@/src/lib/useEvent";

type RSVPModuleProps = {
  eventId: string;
  event: EventRecord | null;
  userStatus: string | null;
  submittingStatus: string | null;
  createdNow?: boolean;
  onSelect: (status: string) => void;
};

export function RSVPModule({
  eventId,
  event,
  userStatus,
  submittingStatus,
  onSelect,
  createdNow,
}: RSVPModuleProps) {
  const [highlightRsvp, setHighlightRsvp] = useState(false);
  const rsvpSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!createdNow || !rsvpSectionRef.current) return;

    rsvpSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setHighlightRsvp(true);
    const timeout = setTimeout(() => setHighlightRsvp(false), 2400);

    return () => clearTimeout(timeout);
  }, [createdNow]);

  if (!event) return null;

  return (
    <section className="mt-8 mb-4">
      {createdNow && (
        <div className="mb-6 border border-white/15 bg-primary/10 rounded-2xl p-4 max-w-md shadow-sm">
          <p className="font-black text-lg mb-1 italic text-primary">
            You're live. First RSVP sets the vibe 🔥
          </p>
          <p className="opacity-90 font-medium text-sm">
            Tap your response, then invite your squad.
          </p>
        </div>
      )}

      <div
        ref={rsvpSectionRef}
        className={`bg-surface-container rounded-3xl p-6 relative overflow-hidden transition-colors duration-300 ${
          highlightRsvp ? "ring-2 ring-primary/50" : ""
        }`}
      >
        <div className="flex flex-col gap-6 relative z-10">
          <h3 className="font-headline text-xl tracking-tight italic opacity-90">
            Are you pulling up?
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => onSelect("going")}
              disabled={submittingStatus !== null}
              className={`w-full rounded-full p-[2px] transition-transform duration-200 ${
                submittingStatus === "going" || userStatus === "going"
                  ? "scale-[1.03] animate-rsvp-pulse"
                  : "active:scale-95"
              }`}
              style={{
                background:
                  userStatus === "going"
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))"
                    : "rgba(69, 50, 78, 0.4)",
                boxShadow:
                  userStatus === "going"
                    ? "0 0 30px rgba(255,171,243,0.45)"
                    : "none",
              }}
            >
              <div
                className={`rounded-full py-4 flex justify-center items-center gap-3 transition-colors ${
                  userStatus === "going"
                    ? "bg-transparent text-white"
                    : "bg-transparent hover:bg-surface-bright text-on-surface"
                }`}
              >
                <span className="font-black text-xl tracking-tight italic">
                  {submittingStatus === "going" ? "Saving..." : "Going"}
                </span>
                {userStatus === "going" && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onSelect("maybe")}
                disabled={submittingStatus !== null}
                className="rounded-full py-4 flex justify-center items-center gap-2 transition-transform duration-200 active:scale-95"
                style={{
                  background:
                    userStatus === "maybe"
                      ? "var(--color-secondary-container)"
                      : "var(--color-surface-container-highest)",
                  color:
                    userStatus === "maybe" ? "#fff" : "var(--color-on-surface)",
                }}
              >
                <span className="font-bold">
                  {submittingStatus === "maybe" ? "Saving..." : "Maybe"}
                </span>
              </button>

              <button
                onClick={() => onSelect("no")}
                disabled={submittingStatus !== null}
                className="rounded-full py-4 flex justify-center items-center gap-2 transition-transform duration-200 active:scale-95"
                style={{
                  background:
                    userStatus === "no"
                      ? "var(--color-tertiary-container)"
                      : "var(--color-surface-container-high)",
                  color:
                    userStatus === "no"
                      ? "#fff"
                      : "var(--color-on-surface-variant)",
                  opacity: userStatus === "no" ? 1 : 0.6,
                }}
              >
                <span className="font-medium">
                  {submittingStatus === "no" ? "Saving..." : "No"}
                </span>
              </button>
            </div>
          </div>

          {userStatus === "going" && (
            <p className="font-black text-2xl italic text-primary drop-shadow-[0_0_12px_rgba(255,171,243,0.45)]">
              You're in 🔥
            </p>
          )}
        </div>
      </div>

      {userStatus && userStatus !== "going" && (
        <p className="mt-4 font-bold text-sm bg-surface-bright/30 inline-block px-3 py-1 rounded-lg">
          You are <span className="uppercase text-primary">{userStatus}</span>
        </p>
      )}
    </section>
  );
}
