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
    addResponse,
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
        userStatus={userStatus}
        submittingStatus={submittingStatus}
        onSelect={addResponse}
        createdNow={createdNow}
      />

      {!loading && responses.length > 0 && <AvatarRow responses={responses} />}

      <ActivityFeed responses={responses} />

      {userStatus === "going" && event && (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <InviteCard
            eventId={event.id ?? eventId}
            eventTitle={event.title}
            hostName={event.host_name}
          />
        </div>
      )}
    </EventShell>
  );
}
