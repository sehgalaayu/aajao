import React from "react";
import { formatEventDateTime } from "@/src/lib/useEvent";

type InviteCardProps = {
  eventId: string | null;
  eventTitle: string | undefined;
  hostName: string | undefined;
  eventTime?: string;
  eventDate?: string;
  eventLocation?: string;
  goingCount: number;
  rewardMessage?: string | null;
  joinsAfterInvite?: number;
  inviterRef: string;
  onInvite: () => void;
};

export function InviteCard({
  eventId,
  eventTitle,
  hostName,
  eventTime,
  eventDate,
  eventLocation,
  goingCount,
  rewardMessage,
  joinsAfterInvite,
  inviterRef,
  onInvite,
}: InviteCardProps) {
  if (!eventId) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/event/${eventId}${inviterRef ? `?ref=${encodeURIComponent(inviterRef)}` : ""}`
      : "";
  const copyLink = async () => {
    if (!shareUrl || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      onInvite();
    } catch {
      // ignore clipboard errors
    }
  };

  const scheduleLabel = [
    formatEventDateTime(eventDate, eventTime),
    eventLocation,
  ]
    .filter(Boolean)
    .join(" • ");

  const shareMessage = `\u{1F525} Scene set hai!\n\n${eventTitle ?? "Event"}\n${scheduleLabel || "Time TBD"}\n\nAlready ${goingCount} people in \u{1F440}\n\nTu aa raha hai? \u{1F447}\n${shareUrl}`;

  const whatsappHref = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    : "https://wa.me";

  return (
    <section className="relative mt-12 mb-8">
      <div className="bg-surface-container-highest rounded-xl p-6 overflow-hidden relative group">
        {/* Confetti Blob */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl group-hover:bg-tertiary/20 transition-all"></div>

        <div className="flex flex-col gap-4 relative z-10">
          {rewardMessage && (
            <p className="text-sm font-black text-primary bg-primary/10 border border-primary/25 rounded-xl px-3 py-2 w-max">
              {rewardMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-tertiary-container/20 p-2 rounded-full">
              <span
                className="material-symbols-outlined text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                groups
              </span>
            </div>
            <h3 className="font-headline text-lg tracking-tight">
              You're in. Invite your squad 🔥
            </h3>
          </div>

          <p className="text-sm text-on-surface/70 pr-8">
            Call your group before it's full 😬
          </p>

          <p className="text-sm text-on-surface-variant">
            Already {goingCount} {goingCount === 1 ? "person" : "people"} in 👀
          </p>

          {joinsAfterInvite !== undefined && joinsAfterInvite > 0 && (
            <p className="text-sm font-semibold text-primary">
              {joinsAfterInvite}{" "}
              {joinsAfterInvite === 1 ? "person joined" : "people joined"} after
              you 👀
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="rounded-full py-3 px-5 border border-white/10 bg-surface-bright/40 hover:bg-surface-bright/55 transition-colors font-semibold text-sm"
            >
              Invite your squad
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={onInvite}
              className="bg-[#25D366] text-white rounded-full py-3 px-6 flex items-center justify-center gap-3 font-bold shadow-lg shadow-[#25D366]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-xl">share</span>
              Send to WhatsApp 🚀
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
