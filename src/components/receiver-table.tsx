import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import type { Inventory, Supply, User } from "@/server/db/schema";

import { addDays, format, isAfter } from "date-fns";
import { AlarmClockMinusIcon } from "lucide-react";
import UndoPr from "./undo-pr";
import DeletePr from "./delete-pr";
import { Input } from "./ui/input";

type ReceiverTableProps = {
  inventory: Inventory & { focal: User; supplies: Supply[] };
  out: boolean;
};

export default function ReceiverTable({ inventory, out }: ReceiverTableProps) {
  const { focal, supplies } = inventory;

  const [q, setQ] = useState("");

  function overdue(date: Date) {
    const twentyDaysFromNow = addDays(date, 20);

    // Check if the target date is after 20 days from now
    const isPast20Days = isAfter(new Date(), twentyDaysFromNow);

    return isPast20Days;
  }

  const filteredSupplies = supplies.filter(({ prControl }) => {
    if (!q) {
      return true;
    }

    return prControl.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="col-span-6 flex h-80 flex-col rounded-b-md sm:col-span-3 md:col-span-2">
      <div className="flex items-center justify-between rounded-t-md bg-zinc-400 p-2 text-white">
        <h2 className="text-lg font-semibold">{focal.name}</h2>
        <Input
          placeholder="Search PR"
          onChange={(e) => setQ(e.currentTarget.value)}
          className="max-w-32 border-0 bg-black/10 text-white placeholder:text-white/90 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <ScrollArea className="rounded-t-0 h-full flex-1 rounded-md border-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PR Control No.</TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSupplies.map((supply, i) => (
              <TableRow key={supply.id}>
                <TableCell className="flex items-center gap-1 font-medium">
                  {i + 1}. {supply.prControl}{" "}
                  {overdue(new Date(supply.createdAt)) && !out && (
                    <AlarmClockMinusIcon className="h-4 w-4 text-[#c86656]" />
                  )}
                </TableCell>
                <TableCell>{format(supply.createdAt, "MM/dd/yyyy")}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  {out && <UndoPr supplyId={supply.id} />}
                  <DeletePr supplyId={supply.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
