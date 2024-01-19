"use server";

import { auth } from "@/server/auth";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const authRequest = auth.handleRequest("POST", context);
  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    return { error: "UNAUTHORIZED" };
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);

  redirect("/login");
};
