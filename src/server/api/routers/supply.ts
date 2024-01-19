import { newPrSchema } from "@/lib/schema";
import {
  createTRPCRouter,
  focalProcedure,
  publicProcedure,
  receiverProcedure,
} from "@/server/api/trpc";
import { inventory, supply } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";

export const supplyRouter = createTRPCRouter({
  new: publicProcedure.input(newPrSchema).mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    await db
      .insert(supply)
      .values({
        inventoryId: input.inventoryId,
        prControl: input.prControl,
      })
      .returning({
        id: supply.id,
      });

    return { message: "PR added" };
  }),
  delete: receiverProcedure
    .input(
      z.object({
        supplyId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(supply).where(eq(supply.id, input.supplyId));

      return {
        message: "PR Deleted",
      };
    }),
  confirm: focalProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db
      .update(supply)
      .set({ outDate: new Date().toISOString() })
      .where(eq(supply.id, input));
  }),
  focalSupply: focalProcedure.query(async ({ ctx }) => {
    const invent = await ctx.db
      .select()
      .from(inventory)
      .where(eq(inventory.focalId, ctx.session.user.userId));

    if (invent.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    return await ctx.db
      .select()
      .from(supply)
      .where(and(eq(supply.inventoryId, invent[0]!.id)));
  }),
});
