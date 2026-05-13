import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  uniqueIndex
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  totpSecret: text("totp_secret"),
  totpEnabledAt: timestamp("totp_enabled_at", { mode: "date" }),
  recoveryCodes: text("recovery_codes").array(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow()
});

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] })
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull()
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const passwordResets = pgTable("password_reset", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  usedAt: timestamp("used_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow()
});

export const connectedAccounts = pgTable(
  "connected_account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    verified: integer("verified").notNull().default(1),
    linkedAt: timestamp("linked_at", { mode: "date" }).notNull().defaultNow()
  },
  (t) => [
    uniqueIndex("connected_account_provider_account_idx").on(
      t.provider,
      t.providerAccountId
    ),
    uniqueIndex("connected_account_user_provider_idx").on(t.userId, t.provider)
  ]
);

export const exemplarSubmissions = pgTable("exemplar_submission", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  operativeType: text("operative_type").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  youtubeId: text("youtube_id").notNull(),
  status: text("status").notNull().default("pending"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at", { mode: "date" }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  reviewedBy: text("reviewed_by").references(() => users.id, {
    onDelete: "set null"
  })
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ConnectedAccount = typeof connectedAccounts.$inferSelect;
export type ConnectionProvider = "steam" | "epic" | "xbox" | "playstation";
export type ExemplarSubmission = typeof exemplarSubmissions.$inferSelect;
export type OperativeType = "auditor" | "surgeon" | "guardian" | "distributor";
export type ExemplarStatus = "pending" | "approved" | "rejected";
