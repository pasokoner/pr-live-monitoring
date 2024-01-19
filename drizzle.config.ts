import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  // tablesFilter: ["1bataancaisa_*"],
  verbose: true,
  strict: true,
} satisfies Config;
