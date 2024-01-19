import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  bigint,
  varchar,
  text,
  pgEnum,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

const roles = ["focal", "receiver", "admin"] as const;
export type Roles = (typeof roles)[number];

export const attendanceType = [
  "travel_order",
  "official_business",
  "on_leave",
] as const;
export type AttendanceType = (typeof attendanceType)[number];

export const userRoleEnum = pgEnum("user_role_enum", roles);
export const attendaceTypeEnum = pgEnum("attendace_type_enum", attendanceType);

export const user = pgTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  username: varchar("username", { length: 16 }).unique().notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const session = pgTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const key = pgTable("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  focalId: varchar("focal_id", { length: 15 })
    .notNull()
    .references(() => user.id),
  name: varchar("name", {
    length: 255,
  }).notNull(),
});

export const supply = pgTable("supply", {
  id: uuid("id").defaultRandom().primaryKey(),
  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventory.id, { onDelete: "cascade" }),
  prControl: varchar("pr_control", { length: 255 }).notNull(),
  outDate: timestamp("outDate", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: varchar("admin_id", {
    length: 15,
  }).references(() => user.id, { onDelete: "set null" }),
  employeeName: varchar("employee_name", {
    length: 255,
  }).notNull(),
  attendanceDate: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  type: attendaceTypeEnum("type").notNull(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  attendees: many(attendance),
  inventory: one(inventory),
}));

export const inventoryRelations = relations(inventory, ({ many, one }) => ({
  supplies: many(supply),
  focal: one(user, {
    fields: [inventory.focalId],
    references: [user.id],
  }),
}));

export const supplyRelations = relations(supply, ({ one }) => ({
  inventory: one(inventory, {
    fields: [supply.inventoryId],
    references: [inventory.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  admin: one(user, {
    fields: [attendance.adminId],
    references: [user.id],
  }),
}));

export type Inventory = InferSelectModel<typeof inventory>;
export type Supply = InferSelectModel<typeof supply>;
export type User = InferSelectModel<typeof user>;
export type Attendance = InferSelectModel<typeof attendance>;
