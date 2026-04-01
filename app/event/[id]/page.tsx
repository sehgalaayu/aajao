"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEvent } from "@/src/lib/useEvent";
import { EventShell } from "@/src/components/event/EventShell";
import { EventHeader } from "@/src/components/event/EventHeader";
import { RSVPModule } from "@/src/components/event/RSVPModule";
import { ActivityFeed } from "@/src/components/event/ActivityFeed";
import { AvatarRow } from "@/src/components/event/AvatarRow";
import { InviteCard } from "@/src/components/event/InviteCard";

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

  return (
    <EventShell toast={toast} error={error}>
      <EventHeader
        event={event}
        counts={counts}
        recentJoinCount={recentJoinCount}
        presenceCount={presenceCount}
        loading={loading}
        energy={energy}
      />
      <RSVPModule
        eventId={eventId}
        event={event}
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
            eventTitle={event.title}
            hostName={event.host_name}
            eventTime={event.time}
            eventDate={event.event_date}
            eventLocation={event.location}
            goingCount={counts.going}
            rewardMessage={inviteRewardMessage}
            joinsAfterInvite={joinsAfterInvite}
            inviterRef={inviterRef}
            onInvite={markInviteAction}
          />
        </div>
      )}
    </EventShell>
  );
}
