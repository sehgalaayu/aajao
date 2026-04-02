import React from "react";
import type { ResponseRecord } from "@/src/lib/useEvent";

type AvatarRowProps = {
  responses: ResponseRecord[];
};

export function AvatarRow({ responses }: AvatarRowProps) {
  const goingResponses = responses.filter((r) => r.status === "going");

  if (goingResponses.length === 0) return null;

  const displayLimit = 4;
  const showList = goingResponses.slice(-displayLimit).reverse();
  const extraCount = Math.max(0, goingResponses.length - displayLimit);

  const getInitials = (name: string) =>
    name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A";

  const firstPerson = showList[0];
  const firstTwoNames = showList.slice(0, 2).map((res) => res.name);
  const namesLabel = firstTwoNames.join(", ");
  const remainingCount = Math.max(
    0,
    goingResponses.length - firstTwoNames.length,
  );

  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-white/5 bg-surface-bright/20 p-4 rounded-3xl">
      <div className="flex items-center">
        <div className="flex -space-x-3">
          {showList.map((res, i) => (
            <div
              key={res.id}
              className="w-10 h-10 rounded-full bg-background border-2 border-[#1d0c26] flex items-center justify-center text-xs font-black text-primary shadow-sm"
              style={{ zIndex: 10 - i }}
            >
              {getInitials(res.name)}
            </div>
          ))}
          {extraCount > 0 && (
            <div
              className="w-10 h-10 rounded-full bg-surface-bright border-2 border-[#1d0c26] flex items-center justify-center text-xs font-black text-on-surface shadow-sm"
              style={{ zIndex: 5 }}
            >
              +{extraCount}
            </div>
          )}
        </div>
      </div>
      <div className="text-left sm:text-right flex-1 sm:ml-4 line-clamp-2 leading-tight w-full">
        <span className="font-bold text-on-surface">
          {goingResponses.length === 1
            ? `${firstPerson.name} is going 🔥`
            : `${namesLabel}${remainingCount > 0 ? ` + ${remainingCount}` : ""} going 🔥`}
        </span>
      </div>
    </div>
  );
}
