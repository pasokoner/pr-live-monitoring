import { api } from "@/trpc/react";
import React from "react";
import { Button } from "./ui/button";
import { LoaderIcon, Undo2Icon } from "lucide-react";

type UndoPr = {
  supplyId: string;
};

export default function UndoPr({ supplyId }: UndoPr) {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.supply.undo.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  async function onDelete() {
    mutate({ supplyId: supplyId });
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      disabled={isLoading}
      onClick={onDelete}
      className="flex h-5 w-5 items-center justify-center p-1"
    >
      {!isLoading && <Undo2Icon />}
      {isLoading && <LoaderIcon />}
    </Button>
  );
}
