import { relations } from "drizzle-orm";
import {
  text,
  timestamp,
  boolean,
  pgTable,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  image: text("image"),
  password: text("password"),
  provider: text("provider").default("CREDENTIALS"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  workspaces: many(workspaces),
  favoritePages: many(favoritePages),
}));

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  memberships: many(memberships),
  pages: many(pages),
}));

export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    role: text("role").default("MEMBER"),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("memberships_user_id_workspace_id_idx").on(table.userId, table.workspaceId),
  }),
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [memberships.workspaceId],
    references: [workspaces.id],
  }),
}));

export const pages = pgTable("pages", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon"),
  coverImage: text("cover_image"),
  data: text("data"),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pagesRelations = relations(pages, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [pages.workspaceId],
    references: [workspaces.id],
  }),
  favoritedBy: many(favoritePages),
}));

export const favoritePages = pgTable(
  "favorite_pages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("favorite_pages_user_id_page_id_idx").on(table.userId, table.pageId),
  }),
);

export const favoritePagesRelations = relations(favoritePages, ({ one }) => ({
  user: one(users, {
    fields: [favoritePages.userId],
    references: [users.id],
  }),
  page: one(pages, {
    fields: [favoritePages.pageId],
    references: [pages.id],
  }),
}));
