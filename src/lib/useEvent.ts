import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type EventRecord = {
  id: string;
  title: string;
  host_name: string;
  location?: string;
  time?: string;
};

export type ResponseRecord = {
  id: string;
  event_id: string;
  name: string;
  status: string;
  created_at?: string;
};

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
  addResponse: (status: string) => Promise<void>;
};

export function useEvent(eventId: string | null, initialMockData?: Partial<EventHookReturn>): EventHookReturn {
  const [event, setEvent] = useState<EventRecord | null>(initialMockData?.event ?? null);
  const [responses, setResponses] = useState<ResponseRecord[]>(initialMockData?.responses ?? []);
  const [loading, setLoading] = useState(initialMockData?.loading ?? !initialMockData);
  const [error, setError] = useState<string | null>(initialMockData?.error ?? null);
  const [submittingStatus, setSubmittingStatus] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(initialMockData?.userStatus ?? null);
  const [toast, setToast] = useState<string | null>(null);
  const [presenceCount, setPresenceCount] = useState<number>(initialMockData?.presenceCount ?? 1);
  const [recentJoinTimestamps, setRecentJoinTimestamps] = useState<number[]>([]);

  const seenResponseIds = useRef<Set<string>>(new Set());

  // MOCK LOGIC BYPASS
  const isMockMode = Boolean(initialMockData);

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
      const unseen = nextResponses.filter(
        (response) => !seenResponseIds.current.has(response.id),
      );

      if (seenResponseIds.current.size > 0 && unseen.length > 0) {
        const latest = unseen[unseen.length - 1];
        setToast(`${latest.name} just pulled up 🔥`);
        setRecentJoinTimestamps((previous) => [Date.now(), ...previous]);
      }

      unseen.forEach((response) => seenResponseIds.current.add(response.id));

      setResponses(nextResponses);

      const savedName = localStorage.getItem("aajao_name");
      if (savedName) {
        const lastOwnResponse = nextResponses
          .filter((response: any) => response.name === savedName)
          .at(-1);
        setUserStatus(lastOwnResponse?.status ?? null);
      }
    },
    [isMockMode],
  );

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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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

  const askName = () => {
    const saved = localStorage.getItem("aajao_name");
    if (saved) return saved;

    const entered = prompt("Enter your name")?.trim();
    if (!entered) return null;

    localStorage.setItem("aajao_name", entered);
    return entered;
  };

  const addResponse = async (status: string) => {
    if (isMockMode && initialMockData?.addResponse) {
      return initialMockData.addResponse(status);
    }

    let name = "You";
    if (!isMockMode) {
      const askResult = askName();
      if (!askResult) {
        setError("Name is required to RSVP.");
        return;
      }
      name = askResult;
    }

    setError(null);
    setSubmittingStatus(status);
    setUserStatus(status);

    if (responses.length === 0 && !isMockMode) {
      setToast("You're setting the vibe");
    }

    const optimisticResponse: ResponseRecord = {
      id: `optimistic-${Date.now()}`,
      event_id: event?.id ?? "preview",
      name,
      status,
      created_at: new Date().toISOString(),
    };

    setResponses((previous) => [...previous, optimisticResponse]);

    if (isMockMode) {
      setSubmittingStatus(null);
      return;
    }

    const supabase = getSupabaseClient();
    const { error: insertError } = await supabase.from("responses").insert([
      {
        event_id: event?.id,
        name,
        status,
      },
    ]);

    setSubmittingStatus(null);

    if (insertError) {
      setResponses((previous) =>
        previous.filter((response) => response.id !== optimisticResponse.id),
      );
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
    addResponse,
  };
}
