"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import { formatEventDateTime } from "@/src/lib/useEvent";
import { Navbar } from "@/src/components/common/Navbar";

type HostEvent = {
  id: string;
  slug?: string | null;
  title: string;
  location?: string | null;
  time?: string | null;
  event_date?: string | null;
  recurring_weekly?: boolean | null;
  created_at?: string;
};

export default function HostDashboardPage() {
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [events, setEvents] = useState<HostEvent[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    window.location.origin;

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentEmail = session?.user?.email?.toLowerCase() ?? null;
      setSessionEmail(currentEmail);
      if (currentEmail) {
        setEmail(currentEmail);
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await checkSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!sessionEmail) {
      setEvents([]);
      return;
    }

    const loadEvents = async () => {
      setLoadingEvents(true);
      setMessage(null);

      let query = supabase
        .from("events")
        .select(
          "id,slug,title,location,time,event_date,recurring_weekly,created_at",
        )
        .eq("host_email", sessionEmail)
        .order("created_at", { ascending: false });

      let result = await query;

      if (result.error?.message?.toLowerCase().includes("created_at")) {
        result = await supabase
          .from("events")
          .select("id,slug,title,location,time,event_date,recurring_weekly")
          .eq("host_email", sessionEmail);
      }

      if (result.error) {
        setMessage(result.error.message || "Could not load your events.");
        setEvents([]);
      } else {
        setEvents((result.data ?? []) as HostEvent[]);
      }

      setLoadingEvents(false);
    };

    void loadEvents();
  }, [sessionEmail, supabase]);

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    setLoadingAuth(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: `${appBaseUrl}/host`,
      },
    });

    if (error) {
      setMessage(error.message || "Could not send OTP.");
    } else {
      setMessage("OTP / magic link sent. Open email and come back here.");
    }

    setLoadingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionEmail(null);
    setEvents([]);
    setMessage("Logged out.");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Navbar activePage="other" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        <section className="rounded-3xl border border-white/10 bg-surface/45 p-6 sm:p-8">
          <h1 className="font-headline text-3xl sm:text-4xl font-black italic tracking-tight">
            Host Login
          </h1>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant">
            Login with your host email to view all scenes you have created.
          </p>

          {!sessionEmail ? (
            <form onSubmit={handleSendOtp} className="mt-5 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Host email"
                className="w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-3 text-sm outline-none focus:border-primary/50"
                required
              />
              <button
                type="submit"
                disabled={loadingAuth}
                className="rounded-full bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-black text-background"
              >
                {loadingAuth ? "Sending..." : "Get OTP / magic link"}
              </button>
            </form>
          ) : (
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <p className="text-sm text-primary font-semibold">
                Logged in as {sessionEmail}
              </p>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="rounded-full border border-white/15 bg-surface/50 px-4 py-2 text-xs font-bold"
              >
                Log out
              </button>
            </div>
          )}

          {message && (
            <p className="mt-4 text-sm text-on-surface-variant">{message}</p>
          )}
        </section>

        {sessionEmail && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-surface/35 p-5 sm:p-6">
            <h2 className="font-headline text-2xl font-black italic tracking-tight">
              Your scenes
            </h2>

            {loadingEvents ? (
              <p className="mt-4 text-sm text-on-surface-variant">Loading...</p>
            ) : events.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-variant">
                No events found for this host yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {events.map((item) => (
                  <Link
                    key={item.id}
                    href={`/event/${item.slug || item.id}`}
                    className="block rounded-2xl border border-white/10 bg-background/40 p-4 hover:border-primary/30 transition-colors"
                  >
                    <p className="font-black text-lg break-words">
                      {item.title}
                    </p>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {formatEventDateTime(item.event_date, item.time) ||
                        "Time TBD"}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                    {item.recurring_weekly && (
                      <p className="text-xs font-bold text-secondary mt-2">
                        Repeats weekly
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
