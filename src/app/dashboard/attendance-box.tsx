import { ScrollArea } from "@/components/ui/scroll-area";
import type { Attendance, AttendanceType } from "@/server/db/schema";
import { Square } from "lucide-react";
import React from "react";

type AttendanceBoxProps = {
  type: AttendanceType;
  attendees: Attendance[];
  title: string;
};

export default function AttendanceBox({
  type,
  attendees,
  title,
}: AttendanceBoxProps) {
  const attendee = attendees.filter((a) => a.type === type);

  return (
    <div className="flex flex-col">
      <h4 className="flex items-center gap-3 text-4xl text-[#c86656]">
        <Square className="h-5 w-5" />
        {title}
      </h4>
      <ScrollArea className="h-44 text-2xl">
        <div className="grid grid-cols-2">
          {attendee.map((a) => (
            <p key={a.id} className="col-span-1">
              {a.employeeName}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
