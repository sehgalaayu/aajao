"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";

import { Navbar } from "@/src/components/common/Navbar";
import { useEvent } from "@/src/lib/useEvent";
import { EventShell } from "@/src/components/event/EventShell";
import { EventHeader } from "@/src/components/event/EventHeader";
import { RSVPModule } from "@/src/components/event/RSVPModule";
import { ActivityFeed } from "@/src/components/event/ActivityFeed";

const StepConnector = () => (
  <div className="flex justify-center py-6">
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface/40 text-on-surface-variant">
      <ArrowDown size={18} />
    </div>
  </div>
);

export default function HowItWorksPage() {
  const {
    event,
    responses,
    counts,
    energy,
    recentJoinCount,
    userStatus,
    submittingStatus,
    loading,
    toast,
    presenceCount,
    addResponse,
  } = useEvent(null, {
    event: { id: "preview", title: "Saturday House Scene", host_name: "Aayu" },
    responses: [
      {
        id: "1",
        event_id: "preview",
        name: "Ria",
        status: "going",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        event_id: "preview",
        name: "Arjun",
        status: "maybe",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        event_id: "preview",
        name: "Neha",
        status: "going",
        created_at: new Date().toISOString(),
      },
    ],
    presenceCount: 16,
  });

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-background overflow-x-hidden">
      <Navbar activePage="how-it-works" />

      <section className="pt-36 pb-14 px-6 relative overflow-hidden">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.2em] font-black text-on-surface-variant/80 mb-5"
          >
            3-step story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.92]"
          >
            WhatsApp planning = chaos 😵‍💫
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-semibold mt-6"
          >
            47 messages. No clarity. Aajao turns that into one clean flow:
            create, share, and see who is actually coming.
          </motion.p>
        </div>
      </section>

      <section className="px-6 pb-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center rounded-[2rem] border border-white/10 bg-surface/40 p-7 md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-primary mb-4">
              Step 1
            </p>
            <h2 className="text-4xl font-headline font-black italic tracking-tight leading-tight">
              Create a scene
            </h2>
            <p className="text-on-surface-variant text-lg font-medium mt-4">
              Add title, time, and location in around 10 seconds. No signup
              wall, no heavy form.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-background/70 p-6">
            <p className="text-sm font-black text-on-surface mb-4">
              Friday Night Badminton
            </p>
            <div className="space-y-3 text-sm font-semibold text-on-surface-variant">
              <div className="rounded-xl border border-white/10 bg-surface/40 px-4 py-3">
                Time: 7:30 PM
              </div>
              <div className="rounded-xl border border-white/10 bg-surface/40 px-4 py-3">
                Location: Siri Fort Sports Complex
              </div>
              <div className="rounded-xl border border-white/10 bg-surface/40 px-4 py-3">
                Mood: Competitive + fun
              </div>
            </div>
            <Link
              href="/create"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-background"
            >
              Create now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <StepConnector />

      <section className="px-6 pb-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center rounded-[2rem] border border-white/10 bg-surface/40 p-7 md:p-10">
          <div className="order-2 md:order-1 rounded-[1.75rem] border border-white/10 bg-background/70 p-6">
            <div className="space-y-3">
              <div className="ml-auto w-[88%] rounded-2xl rounded-tr-md bg-[#075E54] px-4 py-3 text-sm font-semibold text-white">
                Scene set hai. Tap and RSVP: aajao.app/saturday-house 🔥
              </div>
              <div className="w-[92%] rounded-2xl border border-white/10 bg-surface/60 p-4">
                <p className="text-sm font-black text-on-surface">
                  Saturday House Scene
                </p>
                <p className="text-xs font-semibold text-on-surface-variant mt-1">
                  9:00 PM · Hauz Khas
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-black text-primary">
                  <MessageCircle size={14} /> Tap to open
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.2em] font-black text-secondary mb-4">
              Step 2
            </p>
            <h2 className="text-4xl font-headline font-black italic tracking-tight leading-tight">
              Send to your group
            </h2>
            <p className="text-on-surface-variant text-lg font-medium mt-4">
              One link to WhatsApp, Insta, or SMS. Everyone sees the same plan
              with zero confusion.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-sm font-black text-[#25D366]">
              <Send size={16} /> Shared in 1 tap
            </div>
          </div>
        </div>
      </section>

      <StepConnector />

      <section className="px-6 pb-14 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start rounded-[2rem] border border-white/10 bg-surface/40 p-7 md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-tertiary mb-4">
              Step 3
            </p>
            <h2 className="text-4xl font-headline font-black italic tracking-tight leading-tight">
              See who is coming
            </h2>
            <p className="text-on-surface-variant text-lg font-medium mt-4">
              Live RSVP updates, momentum, and social proof. No more guessing
              from group chat silence.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-4 py-2 text-sm font-black text-on-surface">
              <Users size={16} /> {presenceCount} people viewing right now
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-primary/15 bg-background/70 p-3">
            <EventShell toast={toast} hideCreateLink>
              <EventHeader
                event={event}
                counts={counts}
                recentJoinCount={recentJoinCount}
                presenceCount={presenceCount}
                loading={loading}
                energy={energy}
              />
              <RSVPModule
                eventId="preview"
                event={event}
                counts={counts}
                presenceCount={presenceCount}
                userState="viewer"
                userStatus={userStatus}
                submittingStatus={submittingStatus}
                onSelect={addResponse}
                onInvite={() => {}}
                needsName={false}
                inviterRef=""
              />
              <ActivityFeed responses={responses} />
            </EventShell>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 text-center">
        <div className="max-w-3xl mx-auto rounded-[2rem] border border-primary/20 bg-surface/40 px-8 py-12">
          <h2 className="text-5xl md:text-6xl font-headline font-black italic tracking-tighter leading-[0.92]">
            Create your first scene 🚀
          </h2>
          <p className="mt-4 text-on-surface-variant text-lg font-semibold">
            Takes 10 seconds. No login needed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-4 text-lg font-black text-background"
            >
              Make your scene
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/15 bg-background/50 px-8 py-4 text-lg font-black text-on-surface"
            >
              Back to explore
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
