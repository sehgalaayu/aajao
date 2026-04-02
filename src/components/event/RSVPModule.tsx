import React, { useEffect, useRef, useState } from "react";
import type { EventRecord, UserState } from "@/src/lib/useEvent";
import { formatEventDateTime } from "@/src/lib/useEvent";
import { NameModal } from "@/src/components/event/NameModal";

type RSVPModuleProps = {
  eventId: string;
  event: EventRecord | null;
  counts: { going: number; maybe: number; no: number; total: number };
  presenceCount: number;
  userState: UserState;
  userStatus: string | null;
  submittingStatus: string | null;
  createdNow?: boolean;
  openedFromWhatsApp?: boolean;
  inviteRewardMessage?: string | null;
  inviterRef: string;
  needsName: boolean;
  onInvite: () => void;
  onSelect: (name: string, status: string) => void;
};

export function RSVPModule({
  eventId,
  event,
  counts,
  presenceCount,
  userState,
  userStatus,
  submittingStatus,
  onSelect,
  createdNow,
  openedFromWhatsApp,
  inviteRewardMessage,
  inviterRef,
  onInvite,
  needsName,
}: RSVPModuleProps) {
  const [highlightRsvp, setHighlightRsvp] = useState(false);
  const [showOpenNudge, setShowOpenNudge] = useState(false);
  const [showInvitePrompt, setShowInvitePrompt] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const rsvpSectionRef = useRef<HTMLDivElement | null>(null);

  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/event/${eventId}${inviterRef ? `?ref=${encodeURIComponent(inviterRef)}` : ""}`;

  const scheduleLabel = event
    ? [formatEventDateTime(event.event_date, event.time), event.location]
        .filter(Boolean)
        .join(" • ")
    : "";

  const shareMessage = `\u{1F525} Scene set hai!\n\n${event?.title ?? "Event"}\n${scheduleLabel || "Time TBD"}\n\nAlready ${counts.going} people in \u{1F440}\n\nTu aa raha hai? \u{1F447}\n${shareUrl}`;

  const whatsappHref = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    : "https://wa.me";

  const nudgeMessage = `Quick reminder 🚨\n\n${event?.title ?? "The scene"} is coming up. Lock your RSVP here: ${shareUrl}`;
  const nudgeHref = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(nudgeMessage)}`
    : "https://wa.me";

  const handleRSVP = (status: string) => {
    if (needsName) {
      // Open the modal, save the pending status
      setPendingStatus(status);
      setNameModalOpen(true);
    } else {
      // Already have a name in localStorage
      const name = localStorage.getItem("aajao_name") ?? "Anonymous";
      void onSelect(name, status);
    }
  };

  const handleNameSubmit = (name: string) => {
    setNameModalOpen(false);
    if (pendingStatus) {
      void onSelect(name, pendingStatus);
      setPendingStatus(null);
    }
  };

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

  useEffect(() => {
    if (!openedFromWhatsApp || userState !== "viewer") {
      setShowOpenNudge(false);
      return;
    }

    setShowOpenNudge(true);
    const timeout = setTimeout(() => setShowOpenNudge(false), 3000);
    return () => clearTimeout(timeout);
  }, [openedFromWhatsApp, userState]);

  useEffect(() => {
    if (!userStatus) {
      setShowInvitePrompt(false);
      return;
    }

    const timeout = setTimeout(() => setShowInvitePrompt(true), 500);
    return () => clearTimeout(timeout);
  }, [userStatus]);

  if (!event) return null;

  return (
    <section className="mt-8 mb-4">
      <NameModal
        open={nameModalOpen}
        onSubmit={handleNameSubmit}
        onClose={() => {
          setNameModalOpen(false);
          setPendingStatus(null);
        }}
      />

      {showOpenNudge && (
        <div className="mb-5 border border-white/15 bg-surface-bright/20 rounded-2xl p-4 animate-slide-in-up">
          <p className="font-bold text-sm text-on-surface">
            👀 {presenceCount} people already here
          </p>
          <p className="font-black text-base text-primary mt-1">
            🔥 {counts.going} going
          </p>
          <p className="text-sm text-on-surface-variant mt-2">
            Kaun aa raha hai? 👇
          </p>
        </div>
      )}

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
              onClick={() => handleRSVP("going")}
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
                onClick={() => handleRSVP("maybe")}
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
                onClick={() => handleRSVP("no")}
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

          {showInvitePrompt && userStatus && (
            <div className="mt-2 border border-white/10 bg-surface-bright/20 rounded-2xl p-4 animate-slide-in-up">
              <p className="font-black text-base">+ Invite your squad</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Make this a scene 👀
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onInvite}
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full py-2.5 px-5 font-bold text-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">
                    share
                  </span>
                  Share on WhatsApp
                </a>
                <a
                  href={nudgeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-surface/50 py-2.5 px-5 font-bold text-sm text-on-surface"
                >
                  Nudge maybes
                </a>
              </div>
              {inviteRewardMessage && (
                <p className="text-sm text-primary font-bold mt-3">
                  {inviteRewardMessage}
                </p>
              )}
            </div>
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
