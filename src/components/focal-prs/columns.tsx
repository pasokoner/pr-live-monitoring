"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Check, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Supply = {
  id: string;
  prControl: string;
  date: string;
};

export const columns: ColumnDef<Supply>[] = [
  {
    accessorKey: "prControl",
    header: "PR Control",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateFormat = format(row.getValue("date"), "MM/dd/yyyy");

      return <div>{dateFormat}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => {
      const id = row.getValue("id");

      const utils = api.useUtils();
      const { mutate, isLoading } = api.supply.confirm.useMutation({
        onSuccess: async () => {
          await utils.invalidate();
        },
      });

      return (
        <div className="w-[50px]">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => mutate(id as string)}
            className="flex items-center justify-center gap-2"
          >
            Confirm {!isLoading && <Check className="h-4 w-4" />}
            {isLoading && <Loader className="h-4 w-4" />}
          </Button>
        </div>
      );
    },
  },
];

export const outColumns: ColumnDef<Supply>[] = [
  {
    accessorKey: "prControl",
    header: "PR Control",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateFormat = format(row.getValue("date"), "MM/dd/yyyy");

      return <div>{dateFormat}</div>;
    },
  },
];
