"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { EventHeader } from "@/src/components/event/EventHeader";
import { formatEventDateTime } from "@/src/lib/useEvent";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type LocationSuggestion = {
  id: string;
  label: string;
};

export default function CreatePage() {
  const router = useRouter();
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const normalizeTimeInput = (value: string) => {
    const cleaned = value.trim().replace(/\s+/g, " ");
    if (!cleaned) return "";

    const twelveHourClock = cleaned.match(/^([1-9]|1[0-2])(?::([0-5]\d))?$/);
    if (!twelveHourClock) return null;

    const hour = Number(twelveHourClock[1]);
    const minute = twelveHourClock[2] ?? "00";
    return `${hour}:${minute}`;
  };

  const canAcceptTimeTyping = (value: string) => {
    if (!value) return true;

    const partial = value.match(/^(\d{0,2})(?::(\d{0,2}))?$/);
    if (!partial) return false;

    const hourPart = partial[1];
    const minutePart = partial[2] ?? "";

    if (hourPart) {
      const hour = Number(hourPart);
      if (hour > 12) return false;
    }

    if (minutePart && Number(minutePart) > 59) return false;

    return true;
  };

  const formatDateToClockAndPeriod = (date: Date) => {
    const hour24 = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const derivedPeriod = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;

    return {
      clock: `${hour12}:${minute}`,
      period: derivedPeriod as "AM" | "PM",
    };
  };

  const parseTimeToDate = (
    clock: string,
    period: "AM" | "PM",
    dayOffset = 0,
  ) => {
    const parts = clock.match(/^(\d{1,2}):(\d{2})$/);
    if (!parts) return null;

    const hour12 = Number(parts[1]);
    const minute = Number(parts[2]);
    const hour24 = period === "PM" ? (hour12 % 12) + 12 : hour12 % 12;

    const result = new Date();
    result.setDate(result.getDate() + dayOffset);
    result.setHours(hour24, minute, 0, 0);
    return result;
  };

  const isUpcomingTime = (
    clock: string,
    period: "AM" | "PM",
    dayOffset = 0,
  ) => {
    const target = parseTimeToDate(clock, period, dayOffset);
    if (!target) return false;
    const minLeadMs = 5 * 60 * 1000;
    return target.getTime() > Date.now() + minLeadMs;
  };

  const formatSceneText = (value: string) => {
    const acronymWords = new Set(["byob", "vip", "dj", "bbq", "am", "pm"]);

    return value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        const lowerWord = word.toLowerCase();
        if (acronymWords.has(lowerWord)) return lowerWord.toUpperCase();

        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      })
      .join(" ");
  };

  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [eventDate, setEventDate] = useState<string>(""); // "2026-04-02" ISO
  const [timeDayOffset, setTimeDayOffset] = useState(0);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Generate next 14 days for the date picker strip
  const dateOptions = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const options: { iso: string; dayName: string; dayNum: number; monthName: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      let label = `${days[d.getDay()]}`;
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      options.push({
        iso,
        dayName: label,
        dayNum: d.getDate(),
        monthName: months[d.getMonth()],
        label,
      });
    }
    return options;
  }, []);

  const dateScrollRef = useRef<HTMLDivElement>(null);

  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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
  const [previewDate, setPreviewDate] = useState<string>("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreviewTitle(formatSceneText(title) || "Sunday Cricket");
      setPreviewHost(formatSceneText(hostName) || "Rahul");
      setPreviewLocation(formatSceneText(location) || "Shivaji Park");
      setPreviewTime(time ? `${time} ${period}` : "7:00 AM");
      setPreviewDate(eventDate);
    }, 140);

    return () => window.clearTimeout(timeout);
  }, [title, hostName, location, time, period, eventDate]);

  useEffect(() => {
    const query = location.trim();

    if (query.length < 2 || !showLocationDropdown) {
      setLocationSuggestions([]);
      setActiveLocationIndex(-1);
      setLocationLoading(false);
      return;
    }

    if (!mapboxAccessToken) {
      setLocationSuggestions([]);
      setActiveLocationIndex(-1);
      setLocationLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLocationLoading(true);
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&country=IN&language=en&proximity=77.2090,28.6139&limit=6&access_token=${encodeURIComponent(mapboxAccessToken)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setLocationSuggestions([]);
          return;
        }

        const data = (await response.json()) as {
          features?: Array<{ id: string; place_name: string }>;
        };

        const suggestions = (data.features ?? []).map((item) => ({
          id: item.id,
          label: item.place_name,
        }));

        setLocationSuggestions(suggestions);
        setActiveLocationIndex(suggestions.length > 0 ? 0 : -1);
      } catch {
        setLocationSuggestions([]);
        setActiveLocationIndex(-1);
      } finally {
        setLocationLoading(false);
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [location, mapboxAccessToken, showLocationDropdown]);

  const applyQuickTime = (mode: "plus30" | "tonight8" | "tomorrow9") => {
    const now = new Date();
    let target = new Date(now);
    let dayOffset = 0;

    if (mode === "plus30") {
      target = new Date(now.getTime() + 30 * 60 * 1000);
      dayOffset = 0;
    }

    if (mode === "tonight8") {
      target = new Date(now);
      target.setHours(20, 0, 0, 0);
      dayOffset = 0;
    }

    if (mode === "tomorrow9") {
      target = new Date(now);
      target.setDate(target.getDate() + 1);
      target.setHours(9, 0, 0, 0);
      dayOffset = 1;
    }

    const formatted = formatDateToClockAndPeriod(target);
    setTime(formatted.clock);
    setPeriod(formatted.period);
    setTimeDayOffset(dayOffset);
    setTimeError(null);

    // Also set the date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const iso = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
    setEventDate(iso);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const finalTitle = formatSceneText(title);
    const finalHost = formatSceneText(hostName);
    const finalLocation = formatSceneText(location);
    const normalizedClock = normalizeTimeInput(time);

    if (normalizedClock === null) {
      setTimeError("Use format like 7:00");
      setError("Please enter a valid time.");
      setSubmitting(false);
      return;
    }

    if (
      normalizedClock &&
      !isUpcomingTime(normalizedClock, period, timeDayOffset)
    ) {
      // If they selected a future date, the time check should use that date's offset
      const dateOffset = eventDate ? (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [y, m, d] = eventDate.split("-").map(Number);
        const selected = new Date(y, m - 1, d);
        selected.setHours(0, 0, 0, 0);
        return Math.round((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      })() : timeDayOffset;

      if (!isUpcomingTime(normalizedClock, period, dateOffset)) {
        setTimeError("Pick an upcoming time (at least 5 minutes from now)");
        setError("Time should be in the future.");
        setSubmitting(false);
        return;
      }
    }

    const finalTime = normalizedClock ? `${normalizedClock} ${period}` : "";
    setTimeError(null);

    if (!finalTitle || finalTitle.length < 2) {
      setError("Event title must be at least 2 characters.");
      setSubmitting(false);
      return;
    }

    if (!finalHost || finalHost.length < 2) {
      setError("Host name must be at least 2 characters.");
      setSubmitting(false);
      return;
    }

    setTitle(finalTitle);
    setHostName(finalHost);
    if (location.trim()) setLocation(finalLocation);
    if (time.trim()) setTime(normalizedClock ?? "");

    const slugBase = finalTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${slugBase}-${randomSuffix}`;

    const supabase = getSupabaseClient();
    const minLoadingDelay = new Promise((resolve) =>
      window.setTimeout(resolve, 500),
    );

    let insertPromise = supabase
      .from("events")
      .insert([
        {
          title: finalTitle,
          host_name: finalHost,
          location: finalLocation || null,
          time: finalTime || null,
          event_date: eventDate || null,
          slug,
        },
      ])
      .select("id, slug")
      .single();

    let result = await insertPromise;

    // Graceful fallback if the column doesn't exist yet
    if (
      result.error?.message?.toLowerCase().includes("event_date") ||
      result.error?.message?.toLowerCase().includes("column")
    ) {
      console.warn("event_date column missing, retrying without it...");
      insertPromise = supabase
        .from("events")
        .insert([
          {
            title: finalTitle,
            host_name: finalHost,
            location: finalLocation || null,
            time: finalTime || null,
            slug,
          },
        ])
        .select("id, slug")
        .single();
      result = await insertPromise;
    }

    const { data, error: insertError } = result;
    await minLoadingDelay;

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message || "Failed to create event. Try again.");
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
    `🔥 Scene set hai!\n\n🏏 ${title}\n👑 Hosted by ${hostName}\n📅 ${formatEventDateTime(eventDate || null, time ? `${time} ${period}` : null) || "Time TBD"}${location ? `\n📍 ${location}` : ""}\n\nKaun aa raha hai? 👇\nLive list dekh 👀\n${shareUrl}`,
  )}`;

  return (
    <main className="pt-30 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center relative min-h-screen">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/20 blur-[120px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed top-[24%] right-[16%] w-52 h-36 rounded-3xl border border-white/8 bg-white/[0.02] rotate-12 blur-[1px] -z-20 pointer-events-none"></div>
      <div className="fixed bottom-[14%] left-[11%] w-44 h-32 rounded-3xl border border-white/8 bg-primary/[0.04] -rotate-6 blur-[1px] -z-20 pointer-events-none"></div>

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
              <div className="relative">
                <input
                  className={`w-full bg-[#2a0f3d] text-on-surface p-4 rounded-lg border transition-all text-xl font-semibold font-headline outline-none ${
                    error && !title.trim() ? "border-error/50 shadow-[0_0_0_3px_rgba(255,84,105,0.2)]" : "border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)]"
                  }`}
                  placeholder="Sunday Cricket"
                  type="text"
                  value={title}
                  maxLength={50}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={() =>
                    setTitle((currentValue) => formatSceneText(currentValue))
                  }
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant/30 tracking-wider">
                  {title.length}/50
                </span>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                Host Name
              </label>
              <div className="relative">
                <input
                  className={`w-full bg-[#2a0f3d] text-on-surface p-4 rounded-lg border transition-all text-lg font-normal outline-none ${
                    error && !hostName.trim() ? "border-error/50 shadow-[0_0_0_3px_rgba(255,84,105,0.2)]" : "border-white/5 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(255,171,243,0.2)]"
                  }`}
                  placeholder="Rahul"
                  type="text"
                  value={hostName}
                  maxLength={25}
                  onChange={(e) => {
                    setHostName(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={() =>
                    setHostName((currentValue) => formatSceneText(currentValue))
                  }
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant/30 tracking-wider">
                  {hostName.length}/25
                </span>
              </div>
            </div>

            {/* Date Picker Strip */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2 ml-1 text-on-secondary-container/95 tracking-wider uppercase text-[10px]">
                Date
              </label>
              <div
                ref={dateScrollRef}
                className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {dateOptions.map((opt) => (
                  <button
                    key={opt.iso}
                    type="button"
                    onClick={(e) => {
                      setEventDate(opt.iso);
                      // Scroll the clicked element into view smoothly
                      (e.currentTarget as HTMLButtonElement).scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      });
                      // Recalculate timeDayOffset to match
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const [y, m, d] = opt.iso.split("-").map(Number);
                      const selected = new Date(y, m - 1, d);
                      selected.setHours(0, 0, 0, 0);
                      setTimeDayOffset(Math.round((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                      if (timeError) setTimeError(null);
                    }}
                    className={`flex-shrink-0 flex flex-col items-center min-w-[56px] px-3 py-2.5 rounded-xl border text-center transition-all ${
                      eventDate === opt.iso
                        ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_12px_rgba(255,171,243,0.2)]"
                        : "bg-surface-container-high border-white/8 text-on-surface hover:bg-surface-container-highest"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1">
                      {opt.dayName}
                    </span>
                    <span className="text-lg font-black leading-none">
                      {opt.dayNum}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-wider leading-none mt-0.5 opacity-60">
                      {opt.monthName}
                    </span>
                  </button>
                ))}
              </div>
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
                    placeholder="7:00"
                    type="text"
                    value={time}
                    maxLength={5}
                    onChange={(e) => {
                      const typedValue = e.target.value
                        .replace(/[^0-9:]/g, "")
                        .trimStart();
                      if (!canAcceptTimeTyping(typedValue)) return;

                      setTime(typedValue);
                      setTimeDayOffset(0);
                      if (timeError) setTimeError(null);
                    }}
                    onBlur={() => {
                      const normalized = normalizeTimeInput(time);
                      if (normalized === null) {
                        setTimeError("Use format like 7:00");
                        return;
                      }

                      if (!isUpcomingTime(normalized, period, timeDayOffset)) {
                        setTimeError(
                          "Pick an upcoming time (at least 5 minutes from now)",
                        );
                        return;
                      }

                      setTime(normalized);
                      setTimeError(null);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPeriod("AM")}
                    className={`text-xs font-bold py-2 rounded-lg border transition-colors ${
                      period === "AM"
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-surface-container-high border-white/8 text-on-surface"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriod("PM")}
                    className={`text-xs font-bold py-2 rounded-lg border transition-colors ${
                      period === "PM"
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-surface-container-high border-white/8 text-on-surface"
                    }`}
                  >
                    PM
                  </button>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => applyQuickTime("plus30")}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-surface-container-high border border-white/8 hover:bg-surface-container-highest transition-colors"
                  >
                    In 30 min
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickTime("tonight8")}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-surface-container-high border border-white/8 hover:bg-surface-container-highest transition-colors"
                  >
                    Tonight 8:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickTime("tomorrow9")}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-surface-container-high border border-white/8 hover:bg-surface-container-highest transition-colors"
                  >
                    Tomorrow 9:00 AM
                  </button>
                </div>

                {timeError && (
                  <p className="text-xs text-error mt-2 ml-1 font-semibold">
                    {timeError}
                  </p>
                )}
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
                    maxLength={50}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowLocationDropdown(true);
                      setActiveLocationIndex(-1);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    onKeyDown={(e) => {
                      if (!showLocationDropdown) setShowLocationDropdown(true);

                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        if (locationSuggestions.length === 0) return;
                        setActiveLocationIndex((prev) =>
                          Math.min(prev + 1, locationSuggestions.length - 1),
                        );
                        return;
                      }

                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        if (locationSuggestions.length === 0) return;
                        setActiveLocationIndex((prev) => Math.max(prev - 1, 0));
                        return;
                      }

                      if (e.key === "Enter") {
                        if (
                          showLocationDropdown &&
                          activeLocationIndex >= 0 &&
                          activeLocationIndex < locationSuggestions.length
                        ) {
                          e.preventDefault();
                          setLocation(
                            locationSuggestions[activeLocationIndex].label,
                          );
                          setShowLocationDropdown(false);
                          setLocationSuggestions([]);
                        }
                        return;
                      }

                      if (e.key === "Escape") {
                        setShowLocationDropdown(false);
                        setLocationSuggestions([]);
                      }
                    }}
                    onBlur={() =>
                      window.setTimeout(() => {
                        setLocation((currentValue) =>
                          formatSceneText(currentValue),
                        );
                        setShowLocationDropdown(false);
                      }, 140)
                    }
                  />

                  {showLocationDropdown &&
                    (locationLoading ||
                      locationSuggestions.length > 0 ||
                      location.trim().length >= 2) && (
                      <div className="absolute left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#1a0828] shadow-xl z-30 max-h-56 overflow-y-auto">
                        {locationLoading && (
                          <p className="px-4 py-3 text-sm text-on-surface-variant">
                            Finding places...
                          </p>
                        )}

                        {!locationLoading &&
                          locationSuggestions.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`w-full text-left px-4 py-3 text-sm text-on-surface transition-colors ${
                                locationSuggestions[activeLocationIndex]?.id ===
                                item.id
                                  ? "bg-white/8"
                                  : "hover:bg-white/6"
                              }`}
                              onClick={() => {
                                setLocation(item.label);
                                setShowLocationDropdown(false);
                                setLocationSuggestions([]);
                                setActiveLocationIndex(-1);
                              }}
                            >
                              {item.label}
                            </button>
                          ))}

                        {!locationLoading &&
                          location.trim().length >= 2 &&
                          locationSuggestions.length === 0 &&
                          !!mapboxAccessToken && (
                            <p className="px-4 py-3 text-sm text-on-surface-variant">
                              No results found.
                            </p>
                          )}

                        {!locationLoading &&
                          location.trim().length >= 2 &&
                          !mapboxAccessToken && (
                            <p className="px-4 py-3 text-sm text-on-surface-variant">
                              Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local
                            </p>
                          )}
                      </div>
                    )}
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
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <Link 
                  href="/how-it-works" 
                  className="group flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all duration-300"
                >
                  New here? 
                  <span className="text-primary/60 group-hover:text-primary">See how it works</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-center text-error mt-4 text-sm font-bold bg-error/10 py-2 rounded-lg">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

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
                  event_date: previewDate || undefined,
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
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span
                    className="material-symbols-outlined text-5xl text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                {/* CSS Confetti Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.1,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
                      style={{
                        backgroundColor: i % 3 === 0 ? "#FFABF3" : i % 3 === 1 ? "#00E0FF" : "#FFFFFF",
                      }}
                    />
                  ))}
                </div>
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
                  {formatEventDateTime(eventDate || null, previewTime || null) || "Time TBD"}
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
