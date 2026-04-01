"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Share2,
  UserMinus,
  BellRing,
  Zap,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Link as LinkIcon,
  BarChart3,
  Flame,
  PartyPopper,
  Users,
  Ghost,
  TrendingUp,
} from "lucide-react";

import { useEvent } from "@/src/lib/useEvent";
import { EventShell } from "@/src/components/event/EventShell";
import { EventHeader } from "@/src/components/event/EventHeader";
import { RSVPModule } from "@/src/components/event/RSVPModule";
import { ActivityFeed } from "@/src/components/event/ActivityFeed";
import { Navbar } from "@/src/components/common/Navbar";

const LiveRSVPSimulator = () => {
  const [count, setCount] = useState(42);
  const [recentJoiner, setRecentJoiner] = useState<string | null>(null);
  const names = ["Rahul", "Anjali", "Siddharth", "Priya", "Ishaan", "Riya"];

  useEffect(() => {
    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      setRecentJoiner(name);
      setCount((prev) => prev + 1);
      setTimeout(() => setRecentJoiner(null), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface-bright/20 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Users className="text-primary w-10 h-10" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background"
          />
        </div>
        <div className="text-center">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black font-headline block"
          >
            {count}
          </motion.span>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            People in the scene
          </span>
        </div>
      </div>

      <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {recentJoiner && (
            <motion.div
              key={recentJoiner}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-black italic flex items-center gap-2 border border-primary/30"
            >
              <Zap size={14} className="fill-primary" />
              {recentJoiner} just joined!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex -space-x-4">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src={`https://picsum.photos/seed/live${i}/100/100`}
            className="w-12 h-12 rounded-full border-4 border-surface shadow-lg"
            referrerPolicy="no-referrer"
          />
        ))}
        <div className="w-12 h-12 rounded-full bg-surface border-4 border-surface flex items-center justify-center text-xs font-black">
          +99
        </div>
      </div>
    </div>
  );
};

const Hero = () => (
  <section className="relative px-6 pt-40 pb-32 md:pt-56 md:pb-48 max-w-7xl mx-auto overflow-visible">
    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/8 blur-[120px] rounded-full -z-10" />

    <div className="grid lg:grid-cols-2 gap-24 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 relative"
      >
        <div className="inline-block px-5 py-2.5 mb-10 rounded-full bg-tertiary text-background text-[11px] font-black tracking-[0.2em] uppercase rotate-[-2deg] shadow-md">
          🇮🇳 India's Party Engine
        </div>
        <h1 className="font-headline text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-10 italic">
          Plan anything. <span className="block">Without the</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary-container drop-shadow-2xl">
            WhatsApp chaos.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed mb-14 max-w-lg font-medium opacity-90">
          Create a link, share it, and instantly see who’s coming. No app
          download, no login, just vibes.
        </p>
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <Link
            href="/create"
            className="inline-block bg-gradient-to-br from-primary to-primary-container text-background text-2xl font-black px-12 py-7 rounded-2xl shadow-[8px_8px_0_rgba(255,0,255,0.16)] bounce-interaction hover:shadow-[4px_4px_0_rgba(255,0,255,0.16)]"
          >
            🔥 Aajao, scene banate hain
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative min-h-[500px]">
        {/* Floating Cards - Medium Drift */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [2, 3, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 md:right-10 w-72 md:w-80 p-7 glass-card rounded-[2.5rem] shadow-lg z-10 border border-white/12"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-5xl">🏏</span>
            <span className="bg-tertiary text-background text-[10px] px-4 py-2 rounded-full font-black tracking-widest">
              FULL SCENE
            </span>
          </div>
          <h3 className="font-headline font-black text-3xl leading-tight mb-2">
            Sunday Cricket
          </h3>
          <p className="text-sm font-bold text-on-surface-variant opacity-80">
            Shivaji Park • 7:00 AM
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-surface shadow-lg"
                  src={`https://picsum.photos/seed/hero${i}/100/100`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <span className="text-sm font-black text-primary italic">
              Rahul +12 going
            </span>
          </div>
        </motion.div>

        {/* Stickers - Jittery & Playful */}
        <div className="absolute bottom-20 left-0 md:left-[-40px] w-64 p-6 glass-card rounded-[2rem] shadow-lg z-20 border border-white/10 rotate-[-2deg]">
          <h3 className="font-headline font-black text-2xl mb-2">
            House Party 🍻
          </h3>
          <p className="text-xs font-bold text-on-surface-variant mb-5 opacity-70">
            Rohan's place, Bandra
          </p>
          <div className="flex items-center gap-3 text-primary font-black text-sm uppercase italic tracking-wider">
            <PartyPopper size={20} />
            Aajao Yaar!
          </div>
        </div>

        <div className="absolute top-[10%] left-[20%] text-7xl opacity-35 -z-10 rotate-[12deg]">
          🍕
        </div>
      </div>
    </div>
  </section>
);

const EventCard = ({
  title,
  date,
  emoji,
  image,
  badge,
  social,
  rotate,
}: any) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: rotate + 2 }}
    style={{ rotate: `${rotate}deg` }}
    className="bg-surface/55 backdrop-blur-sm p-8 rounded-[3rem] border border-white/8 shadow-lg w-full max-w-[320px] group"
  >
    <div className="aspect-[4/5] bg-surface-bright rounded-[2.5rem] mb-8 overflow-hidden relative">
      <img
        src={image}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-5 right-5 bg-primary text-background w-14 h-14 rounded-full font-black text-3xl flex items-center justify-center shadow-md">
        {emoji}
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <span className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
          🔥 12
        </span>
        <span className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
          🙌 4
        </span>
      </div>
    </div>
    <h3 className="font-headline font-black text-3xl mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-sm font-bold text-on-surface-variant mb-8 opacity-70">
      {date}
    </p>
    <div className="flex justify-between items-center bg-background/40 p-4 rounded-2xl border border-white/5">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
          Top Attendee
        </span>
        <span className="text-xs font-black text-tertiary italic uppercase tracking-wider flex items-center gap-1">
          <Flame size={12} className="fill-tertiary" /> {badge}
        </span>
      </div>
      <div className="flex -space-x-3">
        {[1, 2, 3].map((i) => (
          <img
            key={i}
            src={`https://picsum.photos/seed/social${social}${i}/100/100`}
            className="w-9 h-9 rounded-full border-2 border-surface shadow-md"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const ViralWidgets = () => (
  <section className="px-6 py-40 max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
    <div className="bg-surface/90 p-12 rounded-[3rem] border border-white/8 flex flex-col items-center text-center group">
      <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-400 mb-8 rotate-[-5deg] group-hover:rotate-0 transition-transform">
        <Ghost size={40} />
      </div>
      <h4 className="font-headline font-black text-2xl mb-4 italic">
        Kaun Bhai Ghost Karega 👻
      </h4>
      <p className="text-on-surface-variant font-medium mb-8">
        Jo Going bolke chup ho gaya, usko sabse pehle pakad lo.
      </p>
      <div className="w-full bg-background/50 rounded-full h-4 overflow-hidden p-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "65%" }}
          className="h-full bg-red-400 rounded-full"
        />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-red-400">
        65% Ghosting Risk
      </span>
    </div>

    <div className="bg-surface/90 p-12 rounded-[3rem] border border-primary/15 flex flex-col items-center text-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <TrendingUp className="text-primary opacity-20" />
      </div>
      <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-8 rotate-[5deg] group-hover:rotate-0 transition-transform">
        <Flame size={40} />
      </div>
      <h4 className="font-headline font-black text-2xl mb-4 italic">
        Scene Kitna Garam Hai 🔥
      </h4>
      <p className="text-on-surface-variant font-medium mb-8">
        Mood, RSVP, aur activity dekh ke live scene score nikalta hai.
      </p>
      <div className="text-5xl font-black font-headline text-primary italic">
        9.8/10
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-primary">
        Certified Banger
      </span>
    </div>

    <LiveRSVPSimulator />
  </section>
);

export default function App() {
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
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-background relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(255,0,255,0.14),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(241,193,0,0.12),transparent_35%)]" />
      <Navbar activePage="explore" />

      <Hero />

      {/* Bade Scenes Section - More Space, More People */}
      <section className="px-6 py-48 max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="rotate-[-1deg]">
            <h2 className="font-headline text-7xl md:text-8xl font-black mb-6 italic tracking-tighter leading-none">
              Bade Scenes 🌍
            </h2>
            <p className="text-on-surface-variant text-2xl font-bold opacity-80 italic">
              Real people. Real moments. Real scenes.
            </p>
          </div>
          <div className="bg-surface-bright/30 px-8 py-4 rounded-full border border-white/5 flex items-center gap-4 rotate-[2deg]">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm font-black italic">
              People are planning scenes right now 👀
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-16 justify-center lg:justify-start">
          <EventCard
            title="Sunday Cricket"
            date="Nov 12 • 07:00 AM"
            emoji="🏏"
            image="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=900&q=80"
            badge="Rahul +14 GOING"
            social="1"
            rotate={-2}
          />
          <EventCard
            title="House Party"
            date="Dec 31 • 09:00 PM"
            emoji="🍻"
            image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80"
            badge="Anjali +28 MAYBE"
            social="2"
            rotate={1}
          />
          <EventCard
            title="Goa Trip"
            date="Jan 15 • ALL DAY"
            emoji="✈️"
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
            badge="Siddharth +6 PACKED"
            social="3"
            rotate={-1}
          />
        </div>
      </section>

      {/* Viral Hooks */}
      <ViralWidgets />

      {/* RSVP Demo Section - More Breathing Space */}
      <section className="px-6 py-48 max-w-5xl mx-auto">
        <div className="text-center mb-24 rotate-[1deg]">
          <h2 className="font-headline text-6xl md:text-8xl font-black mb-8 tracking-tighter italic leading-none">
            Built for the RSVP
          </h2>
          <p className="text-on-surface-variant text-2xl font-bold italic opacity-70 max-w-2xl mx-auto">
            No more "Bhai check group chat." One link to rule them all.
          </p>
        </div>
        <div className="relative bg-surface/60 backdrop-blur-lg p-3 rounded-[4rem] shadow-[0_25px_50px_rgba(0,0,0,0.35)] rotate-[-1deg] border border-primary/15">
          <div className="bg-background rounded-[3.8rem] min-h-[600px] relative overflow-hidden flex justify-center py-6">
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
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-tertiary text-background rounded-full flex items-center justify-center font-black rotate-[12deg] shadow-lg border-[8px] border-background text-center px-4 leading-tight text-2xl animate-float-card">
            FULL SCENE HAI!
          </div>
        </div>
      </section>

      {/* Comparison - More Breathing Space */}
      <section id="how-it-works" className="px-6 py-48 bg-surface-bright/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="relative">
            <h3 className="text-5xl font-black font-headline mb-16 text-red-400 italic rotate-[-2deg] tracking-tight">
              WhatsApp Chaos 😵‍C
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
                  className={`bg-surface-bright/40 backdrop-blur-md p-6 rounded-3xl rounded-bl-none max-w-[85%] text-xl font-bold shadow-xl rotate-[${i % 2 === 0 ? 1 : -2}deg] ml-${i * 6} border border-white/5`}
                >
                  {msg}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rotate-[1deg]">
            <h2 className="font-headline text-7xl md:text-8xl font-black mb-10 italic tracking-tighter leading-none">
              Aajao Fixes This
            </h2>
            <div className="space-y-14">
              <div className="flex gap-8 items-start group">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 rotate-[-5deg] group-hover:rotate-0 transition-transform shadow-xl border border-primary/20">
                  <LinkIcon size={36} />
                </div>
                <div>
                  <h4 className="font-black text-3xl mb-3 italic tracking-tight">
                    One Single Source of Truth
                  </h4>
                  <p className="text-on-surface-variant text-xl font-medium opacity-80 leading-relaxed">
                    Location, time, and attendees—all in one link. No more
                    scrolling through 500 messages.
                  </p>
                </div>
              </div>
              <div className="flex gap-8 items-start group">
                <div className="w-20 h-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary shrink-0 rotate-[5deg] group-hover:rotate-0 transition-transform shadow-xl border border-secondary/20">
                  <BarChart3 size={36} />
                </div>
                <div>
                  <h4 className="font-black text-3xl mb-3 italic tracking-tight">
                    Live RSVP Tracking
                  </h4>
                  <p className="text-on-surface-variant text-xl font-medium opacity-80 leading-relaxed">
                    See exactly who's 'Going', 'Maybe', or 'Ghosting' in
                    real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Staggered & Spacious */}
      <section className="px-6 py-48 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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
              className={`bg-surface/50 backdrop-blur-md p-12 rounded-[3.5rem] flex flex-col gap-8 border border-white/5 hover:border-primary/40 transition-all ${f.offset ? "lg:translate-y-16" : ""}`}
              style={{ rotate: `${f.rotate}deg` }}
            >
              <div className={`text-${f.color} opacity-90`}>{f.icon}</div>
              <h4 className="font-headline font-black text-2xl italic tracking-tight">
                {f.title}
              </h4>
              <p className="text-lg text-on-surface-variant font-medium opacity-80 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA - Massive & Expressive */}
      <section className="px-6 pt-56 pb-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block relative mb-24">
            <h2 className="font-headline text-8xl md:text-[10rem] font-black tracking-tighter italic mb-6 leading-none">
              Ready for the scene?
            </h2>
            <motion.div
              animate={{ rotate: [-15, -12, -15], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-24 -left-16 md:-left-32"
            >
              <div className="px-8 py-4 bg-primary text-background rounded-full text-2xl font-black shadow-2xl border-4 border-background">
                LFG! 🚀
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: [10, 13, 10], y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-12 -right-12"
            >
              <div className="px-7 py-3 bg-secondary text-background rounded-full text-xl font-black shadow-xl border-2 border-background">
                Sorted? ✅
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-14 mt-12">
            <p className="text-4xl font-black italic text-on-surface-variant rotate-[-1deg] opacity-90">
              Scene bana ya phir rehne de?
            </p>
            <p className="text-on-surface-variant text-lg font-semibold opacity-85">
              Takes 10 seconds. No login. 1,200 scenes created today.
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-primary via-primary-container to-primary text-background text-4xl font-black px-20 py-10 rounded-[2.5rem] shadow-[0_20px_45px_rgba(255,0,255,0.26)] bounce-interaction"
            >
              Aajao, scene banate hain 🔥
            </Link>
            <p className="text-on-surface-variant font-black text-2xl italic tracking-widest uppercase opacity-60">
              100% Free. Unlimited Vibez.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-surface/20 py-20 px-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="text-5xl font-headline font-black italic tracking-tighter text-on-surface">
              Aajao
            </div>
            <p className="text-on-surface-variant text-lg font-bold max-w-sm leading-relaxed opacity-80 mx-auto md:mx-0">
              The easiest way to organize anything from gully cricket to the
              year-end rager.
            </p>
            <p className="text-sm font-semibold text-on-surface-variant/80">
              Used for cricket, parties & everything in between.
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
                  href="#"
                  className="block hover:text-primary transition-colors italic"
                >
                  Follow the vibe
                </a>
                <a
                  href="#"
                  className="block hover:text-primary transition-colors italic"
                >
                  Help
                </a>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-on-surface text-lg font-black italic">
              Built by Aayu Sehgal
            </p>
            <p className="text-on-surface-variant text-sm font-semibold">
              Founder, Aajao
            </p>
            <p className="text-primary-container text-base font-black italic mt-3">
              ❤️ Made with vibes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
