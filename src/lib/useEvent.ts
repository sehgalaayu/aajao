import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type EventRecord = {
  id: string;
  title: string;
  host_name: string;
  host_email?: string;
  invite_audience?: string[] | null;
  what_to_carry?: string[] | null;
  location?: string;
  time?: string;
  event_date?: string; // "2026-04-02" ISO date string
  recurring_weekly?: boolean;
};

/**
 * Formats event_date + time into a human-friendly string.
 * Handles fallback for legacy records missing event_date.
 */
export function formatEventDateTime(
  eventDate?: string | null,
  time?: string | null,
): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let datePart = "";
  if (eventDate) {
    // parse "2026-04-02" safely
    const [year, month, day] = eventDate.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const eventDay = new Date(d);
      eventDay.setHours(0, 0, 0, 0);

      if (eventDay.getTime() === today.getTime()) {
        datePart = "Today";
      } else if (eventDay.getTime() === tomorrow.getTime()) {
        datePart = "Tomorrow";
      } else {
        datePart = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
      }
    }
  }

  if (datePart && time) return `${datePart} • ${time}`;
  if (datePart) return datePart;
  if (time) return time;
  return "";
}

export type ResponseRecord = {
  id: string;
  event_id: string;
  name: string;
  status: string;
  created_at?: string;
  invited_by?: string | null;
  user_token?: string | null;
};

export type UserState = "viewer" | "responded" | "engaged" | "inviter";

export type EventHookReturn = {
  event: EventRecord | null;
  responses: ResponseRecord[];
  counts: { going: number; maybe: number; no: number; total: number };
  energy: number;
  recentJoinCount: number;
  userStatus: string | null;
  submittingStatus: string | null;
  loading: boolean;
  error: string | null;
  toast: string | null;
  presenceCount: number;
  userState: UserState;
  inviteRewardMessage: string | null;
  joinsAfterInvite: number;
  inviterRef: string;
  addResponse: (name: string, status: string) => Promise<void>;
  markInviteAction: () => void;
  needsName: boolean;
};

export function useEvent(
  eventId: string | null,
  initialMockData?: Partial<EventHookReturn>,
): EventHookReturn {
  const [event, setEvent] = useState<EventRecord | null>(
    initialMockData?.event ?? null,
  );
  const [responses, setResponses] = useState<ResponseRecord[]>(
    initialMockData?.responses ?? [],
  );
  const [loading, setLoading] = useState(
    initialMockData?.loading ?? !initialMockData,
  );
  const [error, setError] = useState<string | null>(
    initialMockData?.error ?? null,
  );
  const [submittingStatus, setSubmittingStatus] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(
    initialMockData?.userStatus ?? null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [presenceCount, setPresenceCount] = useState<number>(
    initialMockData?.presenceCount ?? 1,
  );
  const [recentJoinTimestamps, setRecentJoinTimestamps] = useState<number[]>(
    [],
  );
  const [userState, setUserState] = useState<UserState>(
    (initialMockData?.userState as UserState) ?? "viewer",
  );
  const [hasShared, setHasShared] = useState(false);
  const [joinsAfterInvite, setJoinsAfterInvite] = useState(0);
  const [inviterRef, setInviterRef] = useState<string>("");
  const [joinedFromRef, setJoinedFromRef] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>("");

  const seenResponseIds = useRef<Set<string>>(new Set());
  const optimisticIds = useRef<Set<string>>(new Set());

  // MOCK LOGIC BYPASS
  const isMockMode = Boolean(initialMockData);

  useEffect(() => {
    if (isMockMode || typeof window === "undefined") return;

    const refStorageKey = "aajao_ref_id";
    let currentRef = localStorage.getItem(refStorageKey);

    if (!currentRef) {
      currentRef =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `guest-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem(refStorageKey, currentRef);
    }

    setInviterRef(currentRef);

    const url = new URL(window.location.href);
    const refFromUrl = url.searchParams.get("ref");
    const joinedRefKey = "aajao_joined_from";

    if (refFromUrl && refFromUrl !== currentRef) {
      setJoinedFromRef(refFromUrl);
      localStorage.setItem(joinedRefKey, refFromUrl);
    } else {
      const savedJoinedRef = localStorage.getItem(joinedRefKey);
      if (savedJoinedRef) setJoinedFromRef(savedJoinedRef);
    }
  }, [eventId, isMockMode]);

  useEffect(() => {
    if (isMockMode || typeof window === "undefined") return;

    const tokenStorageKey = "aajao_user_token";
    let token = localStorage.getItem(tokenStorageKey);

    if (!token) {
      token =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `user-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem(tokenStorageKey, token);
    }

    setUserToken(token);
  }, [isMockMode]);

  const loadResponses = useCallback(
    async (resolvedEventId: string) => {
      if (!resolvedEventId || isMockMode) return;

      const supabase = getSupabaseClient();
      const { data, error: responseError } = await supabase
        .from("responses")
        .select("*")
        .eq("event_id", resolvedEventId);

      if (responseError) {
        setError(responseError.message);
        return;
      }

      const nextResponses = (data ?? []) as ResponseRecord[];

      // Reconcile optimistic updates
      // Only clear optimistic IDs if we actually see the corresponding record in the DB
      // or if enough time has passed (to avoid permanent ghosts)
      const confirmedUserTokens = new Set(
        nextResponses.map((r) => r.user_token).filter(Boolean),
      );
      const confirmedNames = new Set(
        nextResponses.map((r) => r.name).filter(Boolean),
      );

      // We'll filter the responses in the component, but let's manage the optimisticIds set
      // Actually, a simpler way: just clear it once we have a non-empty list that likely includes our update
      if (nextResponses.length > 0) {
        optimisticIds.current.clear();
      }

      const unseen = nextResponses.filter(
        (response) => !seenResponseIds.current.has(response.id),
      );

      if (seenResponseIds.current.size > 0 && unseen.length > 0) {
        const latest = unseen[unseen.length - 1];
        if (userState === "responded" || userState === "inviter") {
          setToast("Someone joined after you 👀");
        } else {
          setToast(`${latest.name} just pulled up 🔥`);
        }
        setRecentJoinTimestamps((previous) => [Date.now(), ...previous]);

        if (userState === "responded") {
          setUserState("engaged");
        }

        if (hasShared) {
          const joinedSinceShare = unseen.filter((response) => {
            if (response.status !== "going") return false;
            if (!inviterRef) return false;
            return response.invited_by === inviterRef;
          }).length;
          if (joinedSinceShare > 0) {
            setJoinsAfterInvite((previous) => previous + joinedSinceShare);
          }
        }
      }

      unseen.forEach((response) => seenResponseIds.current.add(response.id));

      setResponses(nextResponses);

      const savedName = localStorage.getItem("aajao_name");
      if (savedName || userToken) {
        const lastOwnResponse = nextResponses
          .filter((response: any) => {
            if (userToken && response.user_token) {
              return response.user_token === userToken;
            }
            return savedName ? response.name === savedName : false;
          })
          .at(-1);
        setUserStatus(lastOwnResponse?.status ?? null);
      }
    },
    [hasShared, inviterRef, isMockMode, userState, userToken],
  );

  useEffect(() => {
    if (isMockMode || userState !== "responded") return;

    const timeout = setTimeout(() => {
      setUserState("engaged");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [isMockMode, userState]);

  useEffect(() => {
    if (isMockMode) return;

    if (toast) {
      const timeout = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(timeout);
    }
  }, [toast, isMockMode]);

  useEffect(() => {
    if (isMockMode) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setRecentJoinTimestamps((previous) =>
        previous.filter((timestamp) => now - timestamp < 120000),
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [isMockMode]);

  useEffect(() => {
    if (!event?.id || isMockMode) return;

    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`responses-${event.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "responses",
          filter: `event_id=eq.${event.id}`,
        },
        () => {
          void loadResponses(event.id);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [event?.id, loadResponses, isMockMode]);

  // PRESENCE LOGIC
  useEffect(() => {
    if (!event?.id || isMockMode) return;

    const supabase = getSupabaseClient();
    const room = supabase.channel(`presence-${event.id}`, {
      config: {
        presence: {
          key: "user",
        },
      },
    });

    room
      .on("presence", { event: "sync" }, () => {
        const state = room.presenceState();
        const activeUsersCount = Object.keys(state).length;
        setPresenceCount(activeUsersCount);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await room.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      void supabase.removeChannel(room);
    };
  }, [event?.id, isMockMode]);

  useEffect(() => {
    if (!eventId || isMockMode) return;

    const loadEvent = async () => {
      const supabase = getSupabaseClient();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(eventId);

      let query = supabase.from("events").select("*");
      if (isUuid) query = query.eq("id", eventId);
      else query = query.eq("slug", eventId);

      const { data, error: eventError } = await query.single();

      if (eventError) {
        setError("Event not found or invalid link.");
        setLoading(false);
        return;
      }

      setEvent(data as EventRecord);
      await loadResponses((data as EventRecord).id);
      setLoading(false);
    };

    void loadEvent();
  }, [eventId, loadResponses, isMockMode]);

  const needsName = useMemo(() => {
    if (isMockMode) return false;
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("aajao_name");
  }, [isMockMode, userStatus]);

  const addResponse = async (name: string, status: string) => {
    if (isMockMode && initialMockData?.addResponse) {
      return initialMockData.addResponse(name, status);
    }

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("A valid name is required to RSVP.");
      return;
    }

    // Persist the name
    localStorage.setItem("aajao_name", trimmedName);

    const effectiveUserToken =
      userToken ||
      localStorage.getItem("aajao_user_token") ||
      (() => {
        const generated =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `user-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        localStorage.setItem("aajao_user_token", generated);
        setUserToken(generated);
        return generated;
      })();

    setError(null);
    setSubmittingStatus(status);
    setUserStatus(status);
    setUserState("responded");

    if (responses.length === 0 && !isMockMode) {
      setToast("You're setting the vibe");
    }

    const optimisticId = `optimistic-${Date.now()}`;
    const existingResponse = responses
      .filter((response) => {
        if (response.user_token && effectiveUserToken) {
          return response.user_token === effectiveUserToken;
        }
        return response.name === trimmedName;
      })
      .at(-1);
    const optimisticResponse: ResponseRecord = {
      id: existingResponse?.id ?? optimisticId,
      event_id: event?.id ?? "preview",
      name: trimmedName,
      status,
      created_at: new Date().toISOString(),
      invited_by: existingResponse?.invited_by ?? joinedFromRef ?? null,
      user_token: existingResponse?.user_token ?? effectiveUserToken,
    };

    optimisticIds.current.add(optimisticId);
    setResponses((previous) => {
      const withoutExisting = previous.filter((response) => {
        if (response.user_token && effectiveUserToken) {
          return response.user_token !== effectiveUserToken;
        }
        return response.name !== trimmedName;
      });
      return [...withoutExisting, optimisticResponse];
    });

    if (isMockMode) {
      setSubmittingStatus(null);
      return;
    }

    const supabase = getSupabaseClient();
    let insertError: { message?: string } | null = null;

    let existingRow: { id: string } | null = null;
    let existingLookupError: { message?: string } | null = null;

    if (effectiveUserToken) {
      const lookupByToken = await supabase
        .from("responses")
        .select("id")
        .eq("event_id", event?.id ?? "")
        .eq("user_token", effectiveUserToken)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lookupByToken.error?.message?.toLowerCase().includes("user_token")) {
        const lookupByName = await supabase
          .from("responses")
          .select("id")
          .eq("event_id", event?.id ?? "")
          .eq("name", trimmedName)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        existingRow = lookupByName.data;
        existingLookupError = lookupByName.error;
      } else {
        existingRow = lookupByToken.data;
        existingLookupError = lookupByToken.error;
      }
    }

    if (existingLookupError) {
      insertError = existingLookupError;
    } else if (existingRow?.id) {
      const { error } = await supabase
        .from("responses")
        .update({ status, name: trimmedName })
        .eq("id", existingRow.id);
      insertError = error;
    } else {
      const payloadWithIdentity = {
        event_id: event?.id,
        name: trimmedName,
        status,
        invited_by: joinedFromRef,
        user_token: effectiveUserToken,
      };

      const tryInsert = async (payload: Record<string, unknown>) =>
        supabase.from("responses").insert([payload]);

      const sanitizeAndRetryInsert = async (
        message: string,
        payload: Record<string, unknown>,
      ) => {
        const lowered = message.toLowerCase();
        const nextPayload = { ...payload };

        if (lowered.includes("invited_by")) {
          delete nextPayload.invited_by;
        }
        if (lowered.includes("user_token")) {
          delete nextPayload.user_token;
        }

        return tryInsert(nextPayload);
      };

      const firstAttempt = await tryInsert(payloadWithIdentity);
      insertError = firstAttempt.error;

      if (insertError?.message) {
        const retry = await sanitizeAndRetryInsert(
          insertError.message,
          payloadWithIdentity,
        );
        insertError = retry.error;
      }
    }

    setSubmittingStatus(null);

    if (insertError) {
      optimisticIds.current.delete(optimisticId);
      setResponses((previous) => {
        if (existingResponse) {
          const withoutUser = previous.filter((response) => {
            if (response.user_token && effectiveUserToken) {
              return response.user_token !== effectiveUserToken;
            }
            return response.name !== trimmedName;
          });
          return [...withoutUser, existingResponse];
        }

        return previous.filter((response) => response.id !== optimisticId);
      });
      setError(insertError.message);
      return;
    }

    if (event?.id) {
      await loadResponses(event.id);
    }
  };

  const countsObj = useMemo(() => {
    const counts = { going: 0, maybe: 0, no: 0, total: 0 };
    responses.forEach((res) => {
      if (res.status === "going") counts.going++;
      else if (res.status === "maybe") counts.maybe++;
      else if (res.status === "no") counts.no++;
      counts.total++;
    });
    return counts;
  }, [responses]);

  const energyScore = useMemo(() => {
    if (isMockMode && initialMockData?.energy !== undefined) {
      return initialMockData.energy;
    }
    const { going, maybe, no, total } = countsObj;
    if (total === 0) return 0;
    const raw = ((going * 1 + maybe * 0.6 - no * 0.3) / total) * 100;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [countsObj, isMockMode, initialMockData]);

  const markInviteAction = useCallback(() => {
    setHasShared(true);
    setUserState("inviter");

    if (joinsAfterInvite < 1) {
      setToast("You brought the vibe 🔥");
    }
  }, [joinsAfterInvite]);

  const inviteRewardMessage = useMemo(() => {
    if (joinsAfterInvite >= 2) {
      return "You started this scene 😎";
    }
    if (hasShared) {
      return "You brought the vibe 🔥";
    }
    return null;
  }, [hasShared, joinsAfterInvite]);

  return {
    event,
    responses,
    counts: countsObj,
    energy: energyScore,
    recentJoinCount: recentJoinTimestamps.length,
    userStatus,
    submittingStatus,
    loading,
    error,
    toast: initialMockData?.toast ?? toast,
    presenceCount,
    userState,
    inviteRewardMessage,
    joinsAfterInvite,
    inviterRef,
    addResponse,
    markInviteAction,
    needsName,
  };
}
