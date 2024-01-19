"use client";

import { api } from "@/trpc/react";

import NewPr from "./new-pr";

import { Button } from "./ui/button";
import { useState } from "react";
import ReceiverTable from "./receiver-table";

export default function ReceiverPage() {
  const [out, setOut] = useState(false);
  const { data } = api.inventory.byOut.useQuery({
    out,
  });

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
        {data.map((inventory) => (
          <ReceiverTable out={out} inventory={inventory} key={inventory.id} />
        ))}
      </div>
    </>
  );
}
