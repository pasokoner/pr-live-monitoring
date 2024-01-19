/// <reference types="lucia" />

// import { type roles } from "@/server/db/schema";

declare namespace Lucia {
  type Auth = import("@/server/auth").Auth;
  type DatabaseUserAttributes = {
    name: string;
    username: string;
    role: import("@/server/db/schema").Roles;
  };
  type DatabaseSessionAttributes = Record<string, never>;
}
