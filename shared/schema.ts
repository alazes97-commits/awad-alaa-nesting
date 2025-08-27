import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  additionalLinks: jsonb("additional_links").$type<Array<{title: string, url: string}>>().default([]),
  rating: integer("rating").default(0), // 0-5 stars
  category: text("category").notNull(), // 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink'
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
