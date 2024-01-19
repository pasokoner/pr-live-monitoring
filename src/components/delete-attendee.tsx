import React from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { Loader, X } from "lucide-react";

type DeleteAttendeeProps = {
  attendeeId: string;
};

export default function DeleteAttendee({ attendeeId }: DeleteAttendeeProps) {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.attendance.delete.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  return (
    <Button
      size="icon"
      variant="destructive"
      disabled={isLoading}
      onClick={() => mutate(attendeeId)}
      className="flex h-5 w-5 items-center justify-center p-1"
    >
      {!isLoading && <X />}
      {isLoading && <Loader />}
    </Button>
  );
}
