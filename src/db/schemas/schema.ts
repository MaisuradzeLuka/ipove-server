import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const userCategoryEnum = pgEnum("user_category", [
  "developer",
  "handyman",
]);

export const users = pgTable("users", {
  userId: uuid("user_id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name"),
  lastname: text("lastname"),
  phoneNumber: bigint("phone_number", { mode: "number" }),
  email: text("email").notNull().unique(),
  address: text("address"),
  city: text("city"),
  category: userCategoryEnum("category"),
  avatar: text("avatar"),
  examples: text("examples").array().default([]).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  isComplete: boolean("is_complete").default(false).notNull(),
});
