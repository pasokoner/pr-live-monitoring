"use client";

import React from "react";

import { Bebas_Neue } from "next/font/google";

import DashboardHeader from "./header";
import FocalBox from "./focal-box";
import { api } from "@/trpc/react";
import AttendanceBox from "./attendance-box";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function DashboardPage() {
  const { data } = api.inventory.all.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const { data: attendee } = api.attendance.today.useQuery(undefined, {
    refetchInterval: 5000,
  });

  if (!data || !attendee) return null;

  console.log(data, attendee);

  return (
    <div
      className={`flex h-screen w-screen flex-col overflow-hidden bg-[#f5f2eb] ${bebasNeue.className}`}
    >
      <DashboardHeader />
      <main className="grid flex-1 grid-cols-12 gap-2 px-4 py-6">
        <div className="border-1 col-span-9 grid h-full grid-cols-3 gap-x-2 gap-y-4">
          <FocalBox variant="outline" inventory={data[0]!} />
          <FocalBox variant="red" inventory={data[1]!} />
          <FocalBox variant="dark brown" inventory={data[2]!} />
          <FocalBox variant="outline" inventory={data[3]!} />
          <FocalBox variant="red" inventory={data[4]!} />
          <FocalBox variant="dark brown" inventory={data[5]!} />
        </div>

        <div className="col-span-3 h-full w-full flex-1 space-y-2 border-2 border-[#c86656] p-2">
          <AttendanceBox
            attendees={attendee}
            type="travel_order"
            title="TRAVEL ORDER"
          />
          <AttendanceBox
            attendees={attendee}
            type="official_business"
            title="OFFICIAL BUSINESS"
          />
          <AttendanceBox
            attendees={attendee}
            type="on_leave"
            title="ON LEAVE"
          />
        </div>
      </main>
      <footer className="flex justify-end bg-[#aeaaa5] px-8 py-4 text-2xl">
        <h5>DEVELOPED BY JOHN CARLO ASILO</h5>
      </footer>
    </div>
  );
}
