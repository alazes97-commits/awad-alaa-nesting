import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for email-based sync
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  name: varchar("name"),
  profileImage: varchar("profile_image"),
  familyGroupId: varchar("family_group_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Family groups for shared sync
export const familyGroups = pgTable("family_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  ownerEmail: varchar("owner_email").notNull(),
  inviteCode: varchar("invite_code").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  country: text("country").notNull(),
  servingTemperature: text("serving_temperature").notNull(), // 'hot', 'cold', 'room_temp'
  calories: integer("calories"),
  prepTime: integer("prep_time"), // in minutes
  images: jsonb("images").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  ingredientsEn: jsonb("ingredients_en").$type<Array<{name: string, amount: string}>>().default([]),
  ingredientsAr: jsonb("ingredients_ar").$type<Array<{name: string, amount: string}>>().default([]),
  instructionsEn: text("instructions_en").notNull(),
  instructionsAr: text("instructions_ar").notNull(),
  toolsEn: jsonb("tools_en").$type<string[]>().default([]),
  toolsAr: jsonb("tools_ar").$type<string[]>().default([]),
  additionalLinks: jsonb("additional_links").$type<Array<{title: string, url: string, description?: string}>>().default([]),
  rating: integer("rating").default(0), // 0-5 stars
  category: text("category").notNull(), // 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink'
  servings: integer("servings").default(4), // number of people this recipe serves
  familyGroupId: varchar("family_group_id"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Shopping List Schema
export const shoppingList = pgTable("shopping_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemNameEn: text("item_name_en").notNull(),
  itemNameAr: text("item_name_ar").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit"), // 'kg', 'gram', 'cup', 'piece', etc
  category: text("category"), // 'vegetables', 'meat', 'dairy', etc
  notes: text("notes"),
  isCompleted: boolean("is_completed").default(false),
  recipeId: varchar("recipe_id"), // optional reference to recipe
  familyGroupId: varchar("family_group_id"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertShoppingListSchema = createInsertSchema(shoppingList).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertShoppingListItem = z.infer<typeof insertShoppingListSchema>;
export type ShoppingListItem = typeof shoppingList.$inferSelect;

// Pantry Schema
export const pantry = pgTable("pantry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemNameEn: text("item_name_en").notNull(),
  itemNameAr: text("item_name_ar").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit"), // 'kg', 'gram', 'cup', 'piece', etc
  category: text("category"), // 'vegetables', 'meat', 'dairy', etc
  expiryDate: timestamp("expiry_date"),
  location: text("location"), // 'fridge', 'freezer', 'pantry', etc
  notes: text("notes"),
  minimumStock: text("minimum_stock"), // alert when quantity goes below this
  familyGroupId: varchar("family_group_id"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPantrySchema = createInsertSchema(pantry).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPantryItem = z.infer<typeof insertPantrySchema>;
export type PantryItem = typeof pantry.$inferSelect;

// Tools List Schema
export const toolsList = pgTable("tools_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolNameEn: text("tool_name_en").notNull(),
  toolNameAr: text("tool_name_ar").notNull(),
  category: text("category"), // 'cooking', 'baking', 'preparation', etc
  notes: text("notes"),
  isAvailable: boolean("is_available").default(false),
  recipeId: varchar("recipe_id"), // optional reference to recipe
  familyGroupId: varchar("family_group_id"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertToolsListSchema = createInsertSchema(toolsList).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertToolsListItem = z.infer<typeof insertToolsListSchema>;
export type ToolsListItem = typeof toolsList.$inferSelect;

// User and Family Group Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type FamilyGroup = typeof familyGroups.$inferSelect;
export type InsertFamilyGroup = typeof familyGroups.$inferInsert;

// User and Family Group Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyGroupSchema = createInsertSchema(familyGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
