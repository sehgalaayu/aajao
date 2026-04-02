"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { EventRecord, useEvent } from "@/src/lib/useEvent";
import { EventShell } from "@/src/components/event/EventShell";
import { EventHeader } from "@/src/components/event/EventHeader";
import { RSVPModule } from "@/src/components/event/RSVPModule";
import { ActivityFeed } from "@/src/components/event/ActivityFeed";
import { AvatarRow } from "@/src/components/event/AvatarRow";
import { InviteCard } from "@/src/components/event/InviteCard";
import { getSupabaseClient } from "@/lib/supabase";

export default function EventPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params.id;
  const createdNow = searchParams.get("created") === "1";
  const openedFromWhatsApp =
    searchParams.get("from") === "whatsapp" ||
    searchParams.get("utm_source") === "whatsapp";

  const {
    event,
    responses,
    counts,
    energy,
    recentJoinCount,
    userStatus,
    submittingStatus,
    loading,
    error,
    toast,
    presenceCount,
    userState,
    inviteRewardMessage,
    joinsAfterInvite,
    inviterRef,
    addResponse,
    markInviteAction,
    needsName,
  } = useEvent(eventId);

  const [hostEmailInput, setHostEmailInput] = useState("");
  const [hostAuthMessage, setHostAuthMessage] = useState<string | null>(null);
  const [hostAuthLoading, setHostAuthLoading] = useState(false);
  const [hostVerified, setHostVerified] = useState(false);
  const [hostSaveLoading, setHostSaveLoading] = useState(false);
  const [hostSaveMessage, setHostSaveMessage] = useState<string | null>(null);
  const [nudgeFilter, setNudgeFilter] = useState<"maybes" | "non_responders">(
    "maybes",
  );

  const [eventOverride, setEventOverride] =
    useState<Partial<EventRecord> | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editWhatToCarry, setEditWhatToCarry] = useState("");

  const displayEvent =
    event && eventOverride
      ? ({ ...event, ...eventOverride } as EventRecord)
      : event;

  const mapUrl = displayEvent?.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayEvent.location)}`
    : null;

  useEffect(() => {
    if (!event?.host_email) return;

    const supabase = getSupabaseClient();

    const syncHostVerification = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const sessionEmail = session?.user?.email?.toLowerCase();
      const isVerifiedHost =
        !!sessionEmail && sessionEmail === event.host_email?.toLowerCase();

      setHostVerified(isVerifiedHost);

      if (isVerifiedHost && sessionEmail) {
        localStorage.setItem("aajao_host_email", sessionEmail);
        setHostEmailInput(sessionEmail);
      }
    };

    void syncHostVerification();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncHostVerification();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [event?.host_email]);

  useEffect(() => {
    if (!event) return;

    setEditTitle(event.title ?? "");
    setEditLocation(event.location ?? "");
    setEditTime(event.time ?? "");
    setEditDate(event.event_date ?? "");
    setEditWhatToCarry(
      Array.isArray(event.what_to_carry) ? event.what_to_carry.join("\n") : "",
    );
    setEventOverride(null);
    setHostSaveMessage(null);
  }, [event?.id]);

  const maybeResponders = useMemo(
    () => responses.filter((response) => response.status === "maybe"),
    [responses],
  );

  const inviteAudience = useMemo(() => {
    if (
      !displayEvent?.invite_audience ||
      !Array.isArray(displayEvent.invite_audience)
    ) {
      return [] as string[];
    }
    return displayEvent.invite_audience
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
  }, [displayEvent?.invite_audience]);

  const nonResponders = useMemo(() => {
    const normalize = (value: string) => value.trim().toLowerCase();

    const responded = new Set(
      responses.map((response) => normalize(response.name)).filter(Boolean),
    );

    return inviteAudience.filter((name) => !responded.has(normalize(name)));
  }, [inviteAudience, responses]);

  const carryItems = useMemo(() => {
    if (
      !displayEvent?.what_to_carry ||
      !Array.isArray(displayEvent.what_to_carry)
    ) {
      return [] as string[];
    }
    return displayEvent.what_to_carry
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
  }, [displayEvent?.what_to_carry]);

  const handleHostMagicLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event?.host_email) {
      setHostAuthMessage("Host email is not configured for this scene.");
      return;
    }

    const normalized = hostEmailInput.trim().toLowerCase();
    if (normalized !== event.host_email.toLowerCase()) {
      setHostAuthMessage("This email does not match the scene host.");
      return;
    }

    setHostAuthLoading(true);
    setHostAuthMessage(null);

    try {
      const supabase = getSupabaseClient();
      const redirectTo = `${window.location.origin}/event/${eventId}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setHostAuthMessage(error.message || "Could not send magic link.");
      } else {
        setHostAuthMessage(
          "Magic link sent. Open your email and tap it to unlock host controls.",
        );
      }
    } catch {
      setHostAuthMessage("Could not send magic link right now.");
    } finally {
      setHostAuthLoading(false);
    }
  };

  const handleHostSaveDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event?.id || !hostVerified) return;

    const title = editTitle.trim();
    if (title.length < 2) {
      setHostSaveMessage("Title should be at least 2 characters.");
      return;
    }

    const whatToCarry = Array.from(
      new Set(
        editWhatToCarry
          .split(/\n|,/)
          .map((item) => item.replace(/^[-•\s]+/, "").trim())
          .filter((item) => item.length >= 2),
      ),
    ).slice(0, 20);

    setHostSaveLoading(true);
    setHostSaveMessage(null);

    try {
      const supabase = getSupabaseClient();
      const payload = {
        title,
        location: editLocation.trim() || null,
        time: editTime.trim() || null,
        event_date: editDate.trim() || null,
        what_to_carry: whatToCarry,
      };

      const { error: updateError } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event.id);

      if (updateError) {
        setHostSaveMessage(updateError.message || "Could not save updates.");
        return;
      }

      setEventOverride(payload);
      setHostSaveMessage("Scene details updated.");
    } catch {
      setHostSaveMessage("Could not save updates right now.");
    } finally {
      setHostSaveLoading(false);
    }
  };

  const nudgeTargetText =
    nudgeFilter === "maybes"
      ? maybeResponders.map((response) => response.name).join(", ") ||
        "people marked Maybe"
      : nonResponders.join(", ") || "people who have not responded yet";

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    window.location.origin;

  const carryItemsBlock =
    carryItems.length > 0
      ? `\n\nThings to carry:\n${carryItems.map((item) => `- ${item}`).join("\n")}`
      : "";

  const nudgeMessage = `Reminder from ${displayEvent?.host_name ?? "the host"}\n\n${displayEvent?.title ?? "Scene"} is coming up.\nPlease lock your RSVP here: ${appBaseUrl}/event/${eventId}${carryItemsBlock}\n\nTargeted nudge: ${nudgeTargetText}`;

  const nudgeHref = `https://wa.me/?text=${encodeURIComponent(nudgeMessage)}`;

  return (
    <EventShell toast={toast} error={error}>
      <EventHeader
        event={displayEvent}
        counts={counts}
        recentJoinCount={recentJoinCount}
        presenceCount={presenceCount}
        loading={loading}
        energy={energy}
      />
      <RSVPModule
        eventId={eventId}
        event={displayEvent}
        counts={counts}
        presenceCount={presenceCount}
        userState={userState}
        userStatus={userStatus}
        submittingStatus={submittingStatus}
        openedFromWhatsApp={openedFromWhatsApp}
        inviteRewardMessage={inviteRewardMessage}
        inviterRef={inviterRef}
        onInvite={markInviteAction}
        onSelect={addResponse}
        createdNow={createdNow}
        needsName={needsName}
      />

      {!loading &&
        (userState === "engaged" || userState === "inviter") &&
        responses.length > 0 && <AvatarRow responses={responses} />}

      {!loading && (userState === "engaged" || userState === "inviter") && (
        <ActivityFeed responses={responses} />
      )}

      {(userState === "engaged" || userState === "inviter") && event && (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <InviteCard
            eventId={event.id ?? eventId}
            eventTitle={displayEvent?.title}
            hostName={displayEvent?.host_name}
            eventTime={displayEvent?.time}
            eventDate={displayEvent?.event_date}
            eventLocation={displayEvent?.location}
            goingCount={counts.going}
            rewardMessage={inviteRewardMessage}
            joinsAfterInvite={joinsAfterInvite}
            inviterRef={inviterRef}
            onInvite={markInviteAction}
          />
        </div>
      )}

      {event && (
        <section className="mt-8 rounded-3xl border border-white/10 bg-surface-bright/20 p-5 sm:p-6 animate-slide-in-up">
          <h3 className="font-headline text-xl sm:text-2xl font-black tracking-tight italic">
            Need-to-know
          </h3>

          <div className="mt-4 space-y-2 text-sm sm:text-base text-on-surface-variant font-medium">
            <p>
              Time:{" "}
              <span className="text-on-surface font-semibold">
                {displayEvent?.time || "To be announced"}
              </span>
            </p>
            <p>
              Location:{" "}
              <span className="text-on-surface font-semibold">
                {displayEvent?.location || "To be announced"}
              </span>
            </p>
          </div>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-black text-primary"
            >
              Open location in Google Maps
            </a>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-background/40 p-4">
            <p className="text-xs uppercase tracking-[0.16em] font-black text-on-surface-variant/70 mb-2">
              What to carry
            </p>
            {carryItems.length > 0 ? (
              <ul className="space-y-1 text-sm font-medium text-on-surface-variant">
                {carryItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Host has not added carry items yet.
              </p>
            )}
          </div>
        </section>
      )}

      {event && (
        <section className="mt-6 rounded-3xl border border-primary/20 bg-primary/8 p-5 sm:p-6 animate-slide-in-up">
          <h3 className="font-headline text-xl sm:text-2xl font-black italic tracking-tight">
            Host controls
          </h3>

          {!hostVerified ? (
            <form onSubmit={handleHostMagicLink} className="mt-4 space-y-3">
              <p className="text-sm text-on-surface-variant">
                Re-enter as host to unlock targeted nudges.
              </p>
              <input
                type="email"
                value={hostEmailInput}
                onChange={(e) => setHostEmailInput(e.target.value)}
                placeholder="Host email"
                className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-3 text-sm outline-none focus:border-primary/50"
                required
              />
              <button
                type="submit"
                disabled={hostAuthLoading}
                className="rounded-full bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-black text-background"
              >
                {hostAuthLoading ? "Sending..." : "Send magic link"}
              </button>
              {hostAuthMessage && (
                <p className="text-xs text-on-surface-variant">
                  {hostAuthMessage}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-4">
              <form
                onSubmit={handleHostSaveDetails}
                className="space-y-3 rounded-2xl border border-white/10 bg-surface/35 p-4 mb-4"
              >
                <p className="text-sm font-semibold text-primary">
                  Edit scene details
                </p>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Scene title"
                  className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  required
                />
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="Time (e.g. 7:00 PM)"
                    className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  />
                </div>
                <textarea
                  value={editWhatToCarry}
                  onChange={(e) => setEditWhatToCarry(e.target.value)}
                  placeholder={"What to carry (one per line)"}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                />
                <button
                  type="submit"
                  disabled={hostSaveLoading}
                  className="rounded-full bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-black text-background"
                >
                  {hostSaveLoading ? "Saving..." : "Save scene details"}
                </button>
                {hostSaveMessage && (
                  <p className="text-xs text-on-surface-variant">
                    {hostSaveMessage}
                  </p>
                )}
              </form>

              <p className="text-sm font-semibold text-primary">
                Host verified. Send a targeted nudge:
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setNudgeFilter("maybes")}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${
                    nudgeFilter === "maybes"
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-white/10 bg-surface/40 text-on-surface"
                  }`}
                >
                  Nudge maybes ({maybeResponders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNudgeFilter("non_responders")}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${
                    nudgeFilter === "non_responders"
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-white/10 bg-surface/40 text-on-surface"
                  }`}
                >
                  Nudge non-responders ({nonResponders.length})
                </button>
              </div>

              {nudgeFilter === "non_responders" && nonResponders.length > 0 && (
                <p className="mt-2 text-xs text-on-surface-variant">
                  Targets: {nonResponders.join(", ")}
                </p>
              )}

              {nudgeFilter === "non_responders" &&
                nonResponders.length === 0 && (
                  <p className="mt-2 text-xs text-on-surface-variant">
                    No pending non-responders in your invite list.
                  </p>
                )}

              <a
                href={nudgeHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-black text-white"
              >
                Send targeted nudge on WhatsApp
              </a>
            </div>
          )}
        </section>
      )}
    </EventShell>
  );
}
