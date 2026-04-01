"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { EventHeader } from "@/src/components/event/EventHeader";
import { motion, AnimatePresence } from "motion/react";

export default function CreatePage() {
  const router = useRouter();
  const formatSceneText = (value: string) => {
    const acronymWords = new Set(["byob", "vip", "dj", "bbq", "am", "pm"]);

    return value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        const lowerWord = word.toLowerCase();
        if (acronymWords.has(lowerWord)) {
          return lowerWord.toUpperCase();
        }

        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      })
      .join(" ");
  };

  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdData, setCreatedData] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [previewTitle, setPreviewTitle] = useState("Sunday Cricket");
  const [previewHost, setPreviewHost] = useState("Rahul");
  const [previewLocation, setPreviewLocation] = useState("Shivaji Park");
  const [previewTime, setPreviewTime] = useState("7:00 AM");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreviewTitle(formatSceneText(title) || "Sunday Cricket");
      setPreviewHost(formatSceneText(hostName) || "Rahul");
      setPreviewLocation(formatSceneText(location) || "Shivaji Park");
      setPreviewTime(time || "7:00 AM");
    }, 140);

    return () => window.clearTimeout(timeout);
  }, [title, hostName, location, time]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${slugBase}-${randomSuffix}`;

    const supabase = getSupabaseClient();
    const minLoadingDelay = new Promise((resolve) =>
      window.setTimeout(resolve, 500),
    );

    const insertPromise = supabase
      .from("events")
      .insert([
        {
          title,
          host_name: hostName,
          location,
          time,
          slug,
        },
      ])
      .select("id, slug")
      .single();

    const [, { data, error: insertError }] = await Promise.all([
      minLoadingDelay,
      insertPromise,
    ]);

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (!data?.id) {
      setError("Event was not created correctly.");
      return;
    }

    setCreatedData(data);
    setSuccess(true);
  };

  const shareUrl = createdData
    ? `${window.location.origin}/event/${createdData.slug || createdData.id}`
    : "";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `🔥 Scene set hai!\n\n🏏 ${title}\n👑 Hosted by ${hostName}\n\nKaun aa raha hai? 👇\nLive list dekh 👀\n${shareUrl}`,
  )}`;

  return (
    <main className="pt-30 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center relative min-h-screen">
      {/* Ambient Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/20 blur-[120px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed top-[24%] right-[16%] w-52 h-36 rounded-3xl border border-white/8 bg-white/[0.02] rotate-12 blur-[1px] -z-20 pointer-events-none"></div>
      <div className="fixed bottom-[14%] left-[11%] w-44 h-32 rounded-3xl border border-white/8 bg-primary/[0.04] -rotate-6 blur-[1px] -z-20 pointer-events-none"></div>

      {/* LEFT SIDE: Create Form */}
      <section className="space-y-6 animate-slide-in-up max-w-xl lg:max-w-[560px] w-full justify-self-center">
        <div className="bg-[#1a0828] p-7 rounded-2xl border border-white/8 shadow-[0px_16px_42px_rgba(6,2,10,0.38)] relative overflow-hidden">
          <header className="mb-5">
            <h1 className="text-5xl font-black font-headline text-white mb-2 tracking-tight leading-[0.94]">
              Create your scene 🔥
            </h1>
            <p className="text-on-surface-variant text-base">
              Takes 10 seconds. Share instantly.
            </p>
          </header>

          <div className="h-px w-full bg-white/8 mb-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-primary/80 font-medium min-h-[20px] transition-opacity duration-200">
              {title.trim() ? "This is going to be a scene 🔥" : ""}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                Event Title
              </label>
              <input
                className="w-full bg-[#2a0f3d] text-on-surface p-4 rounded-lg border border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)] transition-all text-xl font-semibold font-headline outline-none"
                placeholder="Sunday Cricket"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() =>
                  setTitle((currentValue) => formatSceneText(currentValue))
                }
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                Host Name
              </label>
              <input
                className="w-full bg-[#2a0f3d] text-on-surface p-4 rounded-lg border border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)] transition-all text-lg font-normal outline-none"
                placeholder="Rahul"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                onBlur={() =>
                  setHostName((currentValue) => formatSceneText(currentValue))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                  Time
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/80">
                    schedule
                  </span>
                  <input
                    className="w-full bg-[#2a0f3d] text-on-surface py-3.5 pl-12 pr-4 rounded-lg border border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)] transition-all font-normal outline-none"
                    placeholder="7:00 AM"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                  Location
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/80">
                    location_on
                  </span>
                  <input
                    className="w-full bg-[#2a0f3d] text-on-surface py-3.5 pl-12 pr-4 rounded-lg border border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)] transition-all font-normal outline-none"
                    placeholder="Shivaji Park"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={() =>
                      setLocation((currentValue) =>
                        formatSceneText(currentValue),
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                animate={submitting ? { scale: [1, 0.97, 1] } : { scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-black text-xl shadow-[0px_6px_14px_rgba(255,0,255,0.11)] active:scale-[0.98] transition-transform font-headline"
              >
                {submitting ? "Building..." : "Create & Share 🚀"}
              </motion.button>
              <p className="text-center text-on-surface-variant/60 text-sm mt-3 font-medium italic">
                No login. No app. Just send the link.
              </p>
            </div>

            {error && (
              <p className="text-center text-error mt-4 text-sm font-bold bg-error/10 py-2 rounded-lg">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* RIGHT SIDE: Live Preview */}
      <section className="lg:sticky lg:top-28 hidden lg:block pt-3 justify-self-center">
        <p className="text-sm text-on-surface-variant mb-3 font-medium">
          This is what you're creating 👇
        </p>
        <div className="relative">
          <div className="bg-[#1a0828] border border-white/8 rounded-3xl shadow-[0_0_40px_rgba(255,0,150,0.12)] p-6 rotate-[-1.5deg] transition-transform duration-500 max-w-sm animate-preview-float">
            <div className="opacity-75 pointer-events-none scale-[0.93] -origin-top transition-all duration-300 ease-out">
              <EventHeader
                event={{
                  title: previewTitle,
                  host_name: previewHost,
                  location: previewLocation,
                  time: previewTime,
                  id: "",
                }}
                counts={{ going: 0, maybe: 0, no: 0, total: 0 }}
                presenceCount={1}
                recentJoinCount={0}
                loading={false}
                energy={0}
              />
            </div>

            <div className="mt-6 space-y-3.5 opacity-50 pointer-events-none scale-[0.93] origin-top transition-all duration-300 ease-out">
              <div className="bg-[#2a0f3d] h-11 rounded-full w-full border border-white/6"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2a0f3d] h-11 rounded-full w-full border border-white/6"></div>
                <div className="bg-[#2a0f3d] h-11 rounded-full w-full border border-white/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success State Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-surface/80"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel p-10 rounded-xl border border-primary/20 shadow-[0px_0px_100px_rgba(255,0,255,0.2)] text-center"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span
                  className="material-symbols-outlined text-5xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h3 className="text-3xl font-black font-headline mb-2 tracking-tight italic">
                🎉 Scene created!
              </h3>
              <p className="text-on-surface-variant mb-8 font-medium">
                "{title}" is live. Now get the squad in.
              </p>

              <div className="bg-[#1a0828] border border-white/8 rounded-xl px-4 py-3 mb-5 text-left">
                <p className="text-on-surface font-headline text-lg font-extrabold leading-tight break-words">
                  {previewTitle}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">
                  {previewTime || "Time TBD"}
                  {previewLocation ? ` • ${previewLocation}` : ""}
                </p>
              </div>

              <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between mb-4 border border-white/5">
                <span className="text-xs font-mono truncate text-on-surface-variant pr-4">
                  {shareUrl}
                </span>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(shareUrl);
                    alert("Copied!");
                  }}
                  className="text-primary font-black text-xs uppercase tracking-widest flex-shrink-0"
                >
                  Copy
                </button>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full py-5 rounded-full bg-[#25D366] text-white font-black text-lg mb-6 flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">share</span>
                Send to WhatsApp 🚀
              </a>

              <button
                onClick={() =>
                  router.push(`/event/${createdData?.slug || createdData?.id}`)
                }
                className="text-on-surface-variant font-black text-xs uppercase tracking-widest hover:text-on-surface transition-colors"
              >
                Go to Scene 👀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
