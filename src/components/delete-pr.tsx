import { api } from "@/trpc/react";
import React from "react";
import { Button } from "./ui/button";
import { LoaderIcon, XIcon } from "lucide-react";

type DeletePrProps = {
  supplyId: string;
};

export default function DeletePr({ supplyId }: DeletePrProps) {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.supply.delete.useMutation({
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
      variant="destructive"
      disabled={isLoading}
      onClick={onDelete}
      className="flex h-5 w-5 items-center justify-center p-1"
    >
      {!isLoading && <XIcon />}
      {isLoading && <LoaderIcon />}
    </Button>
  );
}
