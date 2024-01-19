import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const inventoryRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    return await db.query.inventory.findMany({
      with: {
        supplies: true,
        focal: true,
      },
    });
  }),
  byOut: publicProcedure
    .input(
      z.object({
        out: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      return await db.query.inventory.findMany({
        with: {
          supplies: {
            orderBy: (supplies, { asc }) => [asc(supplies.createdAt)],
            where: (supplies, { isNotNull, isNull }) =>
              input.out
                ? isNotNull(supplies.outDate)
                : isNull(supplies.outDate),
          },
          focal: true,
        },
      });
    }),
});
