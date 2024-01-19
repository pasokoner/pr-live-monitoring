"use client";

import { api } from "@/trpc/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import NewPr from "./new-pr";

import { addDays, format, isAfter } from "date-fns";
import { AlarmClockMinusIcon, Loader, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function ReceiverPage() {
  const utils = api.useUtils();
  const [supplyId, setSupplyId] = useState("");
  const [out, setOut] = useState(false);
  const { data } = api.inventory.byOut.useQuery({
    out,
  });
  const { mutate, isLoading } = api.supply.delete.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  async function onDelete(supplyId: string) {
    setSupplyId(supplyId);
    mutate({ supplyId: supplyId });
  }

  function overdue(date: Date) {
    const twentyDaysFromNow = addDays(date, 20);

    // Check if the target date is after 20 days from now
    const isPast20Days = isAfter(new Date(), twentyDaysFromNow);

    return isPast20Days;
  }

  if (!data) return null;

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <Button
            disabled={!out}
            variant="outline"
            onClick={() => setOut(false)}
          >
            In
          </Button>
          <Button disabled={out} variant="outline" onClick={() => setOut(true)}>
            Out
          </Button>
        </div>
        <NewPr inventories={data} />
      </div>
      <div className="grid grid-cols-6 gap-4">
        {data.map(({ id, supplies, focal }) => (
          <div
            key={id}
            className="col-span-6 flex h-80 flex-col rounded-b-md sm:col-span-3 md:col-span-2"
          >
            <div className="flex items-center justify-between rounded-t-md bg-zinc-400 p-2 text-white">
              <h2 className="text-lg font-semibold">{focal.name}</h2>
            </div>
            <ScrollArea className="rounded-t-0 h-full flex-1 rounded-md border-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PR Control No.</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplies.map((supply, i) => (
                    <TableRow key={supply.id}>
                      <TableCell className="flex items-center gap-1 font-medium">
                        {i + 1}. {supply.prControl}{" "}
                        {overdue(new Date(supply.createdAt)) && !out && (
                          <AlarmClockMinusIcon className="h-4 w-4 text-[#c86656]" />
                        )}
                      </TableCell>
                      <TableCell>
                        {format(supply.createdAt, "MM/dd/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="destructive"
                          disabled={isLoading && supplyId === supply.id}
                          onClick={() => onDelete(supply.id)}
                          className="flex h-5 w-5 items-center justify-center p-1"
                        >
                          {supplyId !== supply.id && <X />}
                          {isLoading && supplyId === supply.id && <Loader />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        ))}
      </div>
    </>
  );
}
