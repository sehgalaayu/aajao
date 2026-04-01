import React from "react";

type InviteCardProps = {
  eventId: string | null;
  eventTitle: string | undefined;
  hostName: string | undefined;
};

export function InviteCard({ eventId, eventTitle, hostName }: InviteCardProps) {
  if (!eventId) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/event/${eventId}`
      : "";
  const copyLink = async () => {
    if (!shareUrl || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore clipboard errors
    }
  };

  const whatsappHref = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `🔥 Scene set hai!\n\n🏏 ${eventTitle ?? "Event"}\n👑 Hosted by ${hostName ?? "Host"}\n\nKaun aa raha hai? 👇\nLive list dekh 👀\n${shareUrl}`,
      )}`
    : "https://wa.me";

  return (
    <section className="relative mt-12 mb-8">
      <div className="bg-surface-container-highest rounded-xl p-6 overflow-hidden relative group">
        {/* Confetti Blob */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl group-hover:bg-tertiary/20 transition-all"></div>

        <div className="flex flex-col gap-4 relative z-10">
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
            Call your group before it's dead 😭
          </p>

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
