import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { inventoryRouter } from "@/server/api/routers/inventory";
import { supplyRouter } from "@/server/api/routers/supply";
import { attendanceRouter } from "@/server/api/routers/attendace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  inventory: inventoryRouter,
  supply: supplyRouter,
  attendance: attendanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
