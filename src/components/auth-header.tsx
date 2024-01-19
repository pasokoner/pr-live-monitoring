"use client";

import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { Loader } from "lucide-react";
import { useTransition } from "react";

export default function AuthHeader() {
  const [isPending, startTransition] = useTransition();

  const { data: session, isLoading } = api.user.getSession.useQuery();

  if (isLoading || !session) {
    return null;
  }

  const name = session.user.name;
  const role = session.user.role.toUpperCase();
  const firstLetter = session.user.name[0]?.toUpperCase();

  return (
    <header className="h-16 bg-neutral-500">
      <div className="container flex h-full items-center">
        <h1 className="text-2xl font-bold text-white">LIVE MONITORING</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto">
            <Avatar className="ml-auto">
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-48">
            <DropdownMenuLabel className="flex gap-x-4">
              <Avatar>
                <AvatarFallback>{firstLetter}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-gray-500">{name}</div>
                <div className="text-xs">{role}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isPending}
              onClick={async () => {
                startTransition(async () => {
                  await logout();
                });
              }}
              className="flex items-center justify-between"
            >
              Logout
              {isPending && <Loader className="h-3 w-3 animate-spin" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
