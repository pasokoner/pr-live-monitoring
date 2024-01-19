import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    return session;
  }),
});
