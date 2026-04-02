"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Share2,
  UserMinus,
  BellRing,
  Zap,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";

import { useEvent } from "@/src/lib/useEvent";
import { EventShell } from "@/src/components/event/EventShell";
import { EventHeader } from "@/src/components/event/EventHeader";
import { RSVPModule } from "@/src/components/event/RSVPModule";
import { ActivityFeed } from "@/src/components/event/ActivityFeed";

export default function HomeBelowFold() {
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
    event: { id: "preview", title: "Friday Night Scenes", host_name: "Ishan" },
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
    presenceCount: 12,
  });

  return (
    <>
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-28 max-w-5xl mx-auto">
        <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 bg-surface/45 p-6 sm:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-black text-primary/80">
            Positioning for launch
          </p>
          <h2 className="mt-4 font-headline text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tight leading-[0.95]">
            Built for House parties, Sunday cricket, and everything your friend
            group plans
          </h2>
          <p className="mt-4 text-on-surface-variant text-base sm:text-lg font-medium max-w-2xl mx-auto">
            Private invite links, fast RSVP, and instant visibility on who is
            actually coming. No public explore feed. No chaos.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-28 md:py-48 max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-20 md:mb-24 rotate-[1deg]">
          <h2 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tighter italic leading-none">
            Built for the RSVP
          </h2>
          <p className="text-on-surface-variant text-lg sm:text-xl md:text-2xl font-bold italic opacity-70 max-w-2xl mx-auto">
            No more "Bhai check group chat." One link to rule them all.
          </p>
        </div>
        <div className="relative bg-surface/60 backdrop-blur-lg p-2 sm:p-3 rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_25px_50px_rgba(0,0,0,0.35)] rotate-[-1deg] border border-primary/15">
          <div className="bg-background rounded-[2.25rem] sm:rounded-[3.8rem] min-h-[560px] sm:min-h-[600px] relative overflow-hidden flex justify-center py-4 sm:py-6">
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
          <div className="hidden md:flex absolute -top-12 -right-12 w-40 h-40 bg-tertiary text-background rounded-full items-center justify-center font-black rotate-[12deg] shadow-lg border-[8px] border-background text-center px-4 leading-tight text-2xl animate-float-card">
            FULL SCENE HAI!
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-48 bg-surface-bright/10"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 md:gap-32 items-center">
          <div className="relative">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline mb-8 sm:mb-12 md:mb-16 text-red-400 italic rotate-[-2deg] tracking-tight">
              WhatsApp Chaos 😵‍💫
            </h3>
            <div className="space-y-6">
              {[
                "Kaun kaun aa raha hai batana?",
                "Address kya hai?",
                "Bhai address dena...",
                "Koi address pin kardo group pe pls! 😤",
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-bright/40 backdrop-blur-md p-4 sm:p-6 rounded-3xl rounded-bl-none max-w-[92%] sm:max-w-[85%] text-base sm:text-xl font-bold shadow-xl border border-white/5"
                  style={{
                    rotate: `${i % 2 === 0 ? 1 : -2}deg`,
                    marginLeft: `${i * 12}px`,
                  }}
                >
                  {msg}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rotate-[1deg]">
            <h2 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black mb-8 sm:mb-10 italic tracking-tighter leading-none">
              Aajao Fixes This
            </h2>
            <div className="space-y-10 sm:space-y-14">
              <div className="flex gap-4 sm:gap-8 items-start group">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-[1.25rem] sm:rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 rotate-[-5deg] group-hover:rotate-0 transition-transform shadow-xl border border-primary/20">
                  <LinkIcon size={28} className="sm:w-9 sm:h-9" />
                </div>
                <div>
                  <h4 className="font-black text-2xl sm:text-3xl mb-2 sm:mb-3 italic tracking-tight">
                    One Single Source of Truth
                  </h4>
                  <p className="text-on-surface-variant text-base sm:text-xl font-medium opacity-80 leading-relaxed">
                    Location, time, and attendees-all in one link. No more
                    scrolling through 500 messages.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-8 items-start group">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-[1.25rem] sm:rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary shrink-0 rotate-[5deg] group-hover:rotate-0 transition-transform shadow-xl border border-secondary/20">
                  <BarChart3 size={28} className="sm:w-9 sm:h-9" />
                </div>
                <div>
                  <h4 className="font-black text-2xl sm:text-3xl mb-2 sm:mb-3 italic tracking-tight">
                    Live RSVP Tracking
                  </h4>
                  <p className="text-on-surface-variant text-base sm:text-xl font-medium opacity-80 leading-relaxed">
                    See exactly who&apos;s Going, Maybe, or Ghosting in
                    real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-28 md:py-48 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 md:gap-12">
          {[
            {
              icon: <Share2 size={48} />,
              title: "Share anywhere",
              desc: "Optimized for WhatsApp, Insta, and SMS. Just paste the link.",
              rotate: -1,
              color: "primary",
            },
            {
              icon: <UserMinus size={48} />,
              title: "No login required",
              desc: "Guests can RSVP in 2 seconds without ever creating an account.",
              rotate: 2,
              color: "tertiary",
              offset: true,
            },
            {
              icon: <BellRing size={48} />,
              title: "Bhai Reminder Bhej Deta Hai",
              desc: "Jo reply nahi karte unko automatic ping lag jata hai.",
              rotate: -2,
              color: "secondary",
            },
            {
              icon: <Zap size={48} />,
              title: "Instant Setup",
              desc: "Soch se link tak in under 30 seconds.",
              rotate: 1,
              color: "primary",
              offset: true,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-surface/50 backdrop-blur-md p-7 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] flex flex-col gap-6 sm:gap-8 border border-white/5 hover:border-primary/40 transition-all ${f.offset ? "lg:translate-y-16" : ""}`}
              style={{ rotate: `${f.rotate}deg` }}
            >
              <div className={`text-${f.color} opacity-90`}>{f.icon}</div>
              <h4 className="font-headline font-black text-xl sm:text-2xl italic tracking-tight">
                {f.title}
              </h4>
              <p className="text-base sm:text-lg text-on-surface-variant font-medium opacity-80 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 pt-24 sm:pt-36 md:pt-56 pb-20 sm:pb-28 md:pb-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[800px] sm:h-[800px] bg-primary/5 blur-[150px] rounded-full"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block relative mb-12 sm:mb-24">
            <h2 className="font-headline text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter italic mb-4 sm:mb-6 leading-none">
              Ready for the scene?
            </h2>
            <motion.div
              animate={{ rotate: [-15, -12, -15], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="hidden sm:block absolute -top-24 -left-16 md:-left-32"
            >
              <div className="px-8 py-4 bg-primary text-background rounded-full text-2xl font-black shadow-2xl border-4 border-background">
                LFG! 🚀
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: [10, 13, 10], y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="hidden sm:block absolute -bottom-12 -right-12"
            >
              <div className="px-7 py-3 bg-secondary text-background rounded-full text-xl font-black shadow-xl border-2 border-background">
                Sorted? ✅
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-8 sm:gap-14 mt-8 sm:mt-12">
            <p className="text-2xl sm:text-4xl font-black italic text-on-surface-variant rotate-[-1deg] opacity-90">
              Scene bana ya phir rehne de?
            </p>
            <p className="text-on-surface-variant text-lg font-semibold opacity-85">
              Takes 10 seconds. No login. 1,200 scenes created today.
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-primary via-primary-container to-primary text-background text-xl sm:text-4xl font-black px-8 sm:px-20 py-4 sm:py-10 rounded-[1.25rem] sm:rounded-[2.5rem] shadow-[0_20px_45px_rgba(255,0,255,0.26)] bounce-interaction"
            >
              Aajao, scene banate hain 🔥
            </Link>
            <p className="text-on-surface-variant font-black text-lg sm:text-2xl italic tracking-widest uppercase opacity-60">
              100% Free. Unlimited Vibez.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-surface/20 py-14 sm:py-20 px-4 sm:px-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <Link
              href="/"
              className="inline-flex justify-center md:justify-start"
            >
              <Image
                src="/brand/aajao-wordmark.png"
                alt="Aajao wordmark"
                width={190}
                height={64}
                className="h-auto w-[150px] sm:w-[190px]"
              />
            </Link>
            <p className="text-on-surface-variant text-lg font-bold max-w-sm leading-relaxed opacity-80 mx-auto md:mx-0">
              The easiest way to organize anything from gully cricket to the
              year-end rager.
            </p>
            <p className="text-sm font-semibold text-on-surface-variant/80">
              Built for Sunday cricket first, expanding from there.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-black text-on-surface-variant/70 mb-3">
                Product
              </p>
              <div className="space-y-2 text-base font-bold text-on-surface-variant">
                <Link
                  href="/how-it-works"
                  className="block hover:text-primary transition-colors italic"
                >
                  How it works
                </Link>
                <a
                  href="#"
                  className="block hover:text-primary transition-colors italic"
                >
                  Explore
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-black text-on-surface-variant/70 mb-3">
                Legal
              </p>
              <div className="space-y-2 text-base font-bold text-on-surface-variant">
                <a
                  href="#"
                  className="block hover:text-primary transition-colors italic"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="block hover:text-primary transition-colors italic"
                >
                  Terms
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-black text-on-surface-variant/70 mb-3">
                Social
              </p>
              <div className="space-y-2 text-base font-bold text-on-surface-variant">
                <a
                  href="https://www.instagram.com/sehgalaayu"
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-primary transition-colors italic"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/sehgalaayu/aajao"
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-primary transition-colors italic"
                >
                  Give me a star on GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-on-surface text-lg font-black italic">
              Built by Aayu Sehgal
            </p>
            <a
              href="mailto:sehgalaayu@gmail.com"
              className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
            >
              sehgalaayu@gmail.com
            </a>
            <p className="text-primary-container text-base font-black italic mt-3">
              ❤️ Made with vibes
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
