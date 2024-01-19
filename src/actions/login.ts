"use server";

import { loginSchema } from "@/lib/schema";
import { auth } from "@/server/auth";
import type * as z from "zod";
import { redirect } from "next/navigation";
import * as context from "next/headers";
import { LuciaError } from "lucia";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const response = loginSchema.safeParse(values);

  if (!response.success) {
    return { error: "Invalid fields" };
  }

  const { username, password } = response.data;

  try {
    const user = await auth.useKey(
      "username",
      username.toLowerCase(),
      password,
    );

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return { error: "Incorrect username or password" };
    }

    return {
      error: "An unknown error occurred",
    };
  }

  redirect("/");
};
