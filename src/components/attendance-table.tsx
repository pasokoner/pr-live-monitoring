"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";

import type { Attendance } from "@/server/db/schema";
import React from "react";

import { format } from "date-fns";
import DeleteAttendee from "./delete-attendee";

type AttendanceTableProps = {
  title: string;
  data: Attendance[];
};

export default function AttendanceTable({ title, data }: AttendanceTableProps) {
  return (
    <div className="col-span-6 flex h-80 flex-col rounded-b-md sm:col-span-3">
      <div className="flex items-center justify-between rounded-t-md bg-zinc-400 p-2 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ScrollArea className="rounded-t-0 h-full flex-1 rounded-md border-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[30px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((attendee, i) => (
              <TableRow key={attendee.id}>
                <TableCell className="font-medium">
                  {i + 1}. {attendee.employeeName}
                </TableCell>
                <TableCell>
                  {format(attendee.attendanceDate, "MM/dd/yyyy")}
                </TableCell>
                <TableCell>
                  <DeleteAttendee attendeeId={attendee.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
