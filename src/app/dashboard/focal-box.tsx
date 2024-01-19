import { cn } from "@/lib/utils";
import type { Inventory, Supply, User } from "@/server/db/schema";
import { addDays, format, isAfter, isToday } from "date-fns";
import React from "react";

type FocalBoxProps = {
  variant: "outline" | "red" | "dark brown";
  inventory: Inventory & { focal: User; supplies: Supply[] };
};

export default function FocalBox({ variant, inventory }: FocalBoxProps) {
  const { focal, supplies, name } = inventory;

  const focalPerson = focal.name;

  const totalIn = supplies.filter((s) => {
    return !s.outDate;
  }).length;

  const releasedToday = supplies.filter((s) => {
    return !!s.outDate && isToday(s.outDate);
  }).length;

  const totalOut = supplies.filter((s) => {
    return !!s.outDate;
  }).length;

  const overdue = supplies.filter((s) => {
    if (s.outDate) {
      return false;
    }

    const twentyDaysFromNow = addDays(s.createdAt, 20);

    // Check if the target date is after 20 days from now
    const isPast20Days = isAfter(new Date(), twentyDaysFromNow);

    return isPast20Days;
  }).length;

  return (
    <div
      className={cn(
        `grid h-full w-full grid-cols-12 rounded-md p-4`,
        variant === "outline"
          ? "border-2 border-[#c86656] text-[#c86656]"
          : variant === "red"
            ? "bg-[#c86656] text-white"
            : "bg-[#4c4645] text-white",
      )}
    >
      <div className="col-span-5 flex flex-col">
        <h3 className="px-4 text-5xl font-semibold uppercase tracking-wide">
          {focalPerson}
        </h3>
        <div className="grid flex-1 grid-rows-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 flex items-center text-3xl">
              TOTAL OUT
            </div>
            <div className="col-span-1 flex items-center justify-center text-4xl">
              {totalOut}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 flex items-center text-3xl">
              RELEASED TODAY
            </div>
            <div className="col-span-1 flex items-center justify-center text-4xl">
              {releasedToday}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 flex items-center text-3xl">OVERDUE</div>
            <div className="col-span-1 flex items-center justify-center text-4xl">
              {overdue}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-7 flex flex-col">
        <div className="flex h-28 items-center justify-center p-2 text-center text-xl">
          {name}
        </div>
        <div className="flex flex-1 items-center justify-center text-9xl font-bold">
          {totalIn}
        </div>
      </div>
    </div>
  );
}
