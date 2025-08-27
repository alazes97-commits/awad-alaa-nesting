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
