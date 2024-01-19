"use client";

import React, { useState } from "react";

import { api } from "@/trpc/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isBefore, isToday } from "date-fns";
import AttendanceTable from "./attendance-table";
import NewAttendee from "./new-attendee";

export default function AdminPage() {
  const { data, isLoading } = api.attendance.all.useQuery();
  const [tab, setTab] = useState("Today");

  if (isLoading) return null;

  const today = data?.filter((data) => isToday(data.attendanceDate));
  const record = data?.filter((data) => {
    if (isToday(data.attendanceDate)) {
      return false;
    }
    return isBefore(data.attendanceDate, new Date());
  });

  const currentData = tab === "Today" ? today : record;

  const travelOrder = currentData?.filter(
    (data) => data.type === "travel_order",
  );
  const officialBusiness = currentData?.filter(
    (data) => data.type === "official_business",
  );
  const onLeave = currentData?.filter((data) => data.type === "on_leave");

  return (
    <Tabs defaultValue={tab}>
      <TabsList className="flex items-center justify-between bg-white">
        <div>
          <TabsTrigger value="Today" onClick={() => setTab("Today")}>
            Today
          </TabsTrigger>
          <TabsTrigger value="Record" onClick={() => setTab("Record")}>
            Record
          </TabsTrigger>
        </div>
        <NewAttendee />
      </TabsList>

      <TabsContent value="Today">
        <div className="grid grid-cols-6 gap-4">
          <AttendanceTable title="Travel Order" data={travelOrder!} />
          <AttendanceTable title="Official Business" data={officialBusiness!} />
          <AttendanceTable title="On Leave" data={onLeave!} />
        </div>
      </TabsContent>
      <TabsContent value="Record">
        <div className="grid grid-cols-6 gap-4">
          <AttendanceTable title="Travel Order" data={travelOrder!} />
          <AttendanceTable title="Official Business" data={officialBusiness!} />
          <AttendanceTable title="On Leave" data={onLeave!} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
