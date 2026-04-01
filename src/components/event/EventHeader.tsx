import React, { useMemo } from "react";
import type { EventRecord } from "@/src/lib/useEvent";

type EventHeaderProps = {
  event: EventRecord | null;
  counts: { going: number; maybe: number; no: number; total: number };
  recentJoinCount: number;
  presenceCount: number;
  loading: boolean;
  energy: number;
};

export function EventHeader({
  event,
  counts,
  recentJoinCount,
  presenceCount,
  loading,
  energy,
}: EventHeaderProps) {
  const socialOthersCount = Math.max(1, presenceCount - 1);

  const energyLabel = useMemo(() => {
    const activePeople = Math.max(counts.going, counts.total);

    if (activePeople <= 0) return "😐 Waiting for people";
    if (activePeople <= 2) return "👀 Someone's in";
    if (activePeople <= 5) return "⚡ Picking up";
    return "🔥 Scene getting lit";
  }, [counts.going, counts.total, energy]);

  if (loading) {
    return <p className="font-bold">Loading scene...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <section className="relative mt-20 mb-12">
      {/* Decorative Blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px] -z-10 animate-float-blob" />
      <div
        className="absolute top-20 -right-10 w-60 h-60 bg-primary-container/10 rounded-full blur-[80px] -z-10 animate-float-blob"
        style={{ animationDelay: "2s" }}
      />

      <div className="flex flex-col gap-2">
        <span className="text-primary font-bold tracking-widest uppercase text-[10px] px-1">
          Hosted by {event.host_name}
        </span>
        <h2 className="text-6xl font-black font-headline tracking-tighter leading-[0.9] text-glow italic asymmetric-left break-words">
          {event.title}
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* Venue Chip */}
          {event.location && (
            <div className="bg-surface-container-high rounded-full px-5 py-3 flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
              <span className="font-semibold text-sm">{event.location}</span>
            </div>
          )}
          {/* Time Chip */}
          {event.time && (
            <div className="bg-surface-container-high rounded-full px-5 py-3 flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-tertiary">
                schedule
              </span>
              <span className="font-semibold text-sm">{event.time}</span>
            </div>
          )}
        </div>

        {/* Existing Counters migrated into Chips */}
        <div className="flex flex-wrap gap-2 text-sm font-bold opacity-90 mt-4">
          {counts.going > 0 && (
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
              {counts.going} Going
            </span>
          )}
          {counts.maybe > 0 && (
            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">
              {counts.maybe} Maybe
            </span>
          )}
          {counts.no > 0 && (
            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full">
              {counts.no} Can't
            </span>
          )}
        </div>
      </div>

      {/* Presence & Energy Indicators */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="glass-panel self-start rounded-full px-4 py-2 flex items-center gap-2 shadow-xl asymmetric-right">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface">
            👀 You + {socialOthersCount} others here
          </span>
        </div>
        <div className="bg-secondary-container self-start rounded-full px-4 py-2 flex items-center gap-2 shadow-lg shadow-secondary/10 hover:scale-105 transition-transform">
          <span
            className="material-symbols-outlined text-tertiary text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            {energyLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {counts.going > 0 && (
          <p className="text-sm font-black text-primary border border-primary/30 bg-primary/12 block w-max px-3 py-1 rounded-lg">
            🔥 {counts.going} {counts.going === 1 ? "person" : "people"} already
            going
          </p>
        )}
        {recentJoinCount > 0 && (
          <p className="text-sm font-medium text-primary italic">
            {recentJoinCount} people joined exactly after you 👀
          </p>
        )}
      </div>
    </section>
  );
}
