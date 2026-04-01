import React, { useMemo } from "react";
import type { ResponseRecord } from "@/src/lib/useEvent";

const formatActivity = (name: string, status: string) => {
  if (status === "going") {
    const hash = name.length;
    if (hash % 3 === 0) {
      return (
        <>
          <span className="font-bold text-primary">{name}</span> invited 3
          people 👀
        </>
      );
    }
    if (hash % 3 === 1) {
      return (
        <>
          2 people joined with{" "}
          <span className="font-bold text-primary">{name}</span> 🔥
        </>
      );
    }
    return (
      <>
        <span className="font-bold text-primary">{name}</span> locked in 🔥
      </>
    );
  }
  if (status === "maybe") {
    return (
      <>
        <span className="font-bold text-secondary">{name}</span> is still
        thinking 🤔
      </>
    );
  }
  return (
    <>
      <span className="font-bold text-tertiary">{name}</span> just pulled up 🚀
    </>
  );
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "A";

type ActivityFeedProps = {
  responses: ResponseRecord[];
};

export function ActivityFeed({ responses }: ActivityFeedProps) {
  const activityFeed = useMemo(() => {
    const baseItems = [...responses]
      .slice(-6)
      .reverse()
      .map((response) => ({
        id: response.id,
        content: formatActivity(response.name, response.status),
        name: response.name,
      }));

    const goingCount = responses.filter(
      (response) => response.status === "going",
    ).length;
    const maybeCount = responses.filter(
      (response) => response.status === "maybe",
    ).length;
    const synthetic: Array<{
      id: string;
      content: React.ReactNode;
      name: string;
    }> = [];

    if (goingCount >= 2) {
      synthetic.push({
        id: "scene-joined",
        content: <>2 people joined just now 🔥</>,
        name: "Scene",
      });
    }

    if (goingCount >= 3) {
      synthetic.push({
        id: "scene-picking",
        content: <>Scene picking up ⚡</>,
        name: "Scene",
      });
      synthetic.push({
        id: "scene-urgency",
        content: <>Call your group before it's full 😬</>,
        name: "Scene",
      });
    }

    if (maybeCount > 0) {
      synthetic.push({
        id: "still-thinking",
        content: <>Rahul is still thinking 🤔</>,
        name: "Rahul",
      });
    }

    return [...synthetic, ...baseItems].slice(0, 6);
  }, [responses]);

  return (
    <section className="space-y-4 mt-12">
      <div className="flex justify-between items-end px-2">
        <h3 className="font-headline text-xl tracking-tight">The Feed</h3>
        <span className="text-primary font-bold text-[10px] uppercase">
          Live Reactions
        </span>
      </div>

      {activityFeed.length === 0 ? (
        <p className="opacity-70 font-medium bg-surface-bright/20 border border-white/5 p-4 rounded-2xl">
          No one's in yet... you starting it? 👀
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {activityFeed.map((item, i) => (
            <div
              key={item.id}
              className={`glass-panel p-4 rounded-lg flex items-center gap-4 animate-slide-in-up ${
                i % 2 === 0 ? "asymmetric-left" : "asymmetric-right"
              }`}
              style={{ opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center p-0.5 shadow-sm text-xs font-black text-primary bg-surface/80">
                {getInitials(item.name)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.content}</p>
                <p className="text-[10px] text-on-surface/40 uppercase font-bold tracking-widest mt-0.5">
                  Just now
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
