import { newAttendanceSchema } from "@/lib/schema";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { attendance } from "@/server/db/schema";
import { isToday } from "date-fns";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const attendanceRouter = createTRPCRouter({
  all: adminProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    return await db.select().from(attendance);
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    await ctx.db.delete(attendance).where(eq(attendance.id, input));

    return {
      message: "Attendee Deleted",
    };
  }),
  today: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.select().from(attendance);

    return data?.filter((data) => isToday(data.attendanceDate));
  }),
  new: adminProcedure
    .input(newAttendanceSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(attendance).values({
        employeeName: input.employeeName,
        type: input.type,
      });

      return { message: "PR added" };
    }),
});
