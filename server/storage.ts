import { type Recipe, type InsertRecipe } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Recipe methods
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: string): Promise<boolean>;
  searchRecipes(query: string): Promise<Recipe[]>;
  filterRecipes(filters: {
    country?: string;
    servingTemperature?: string;
    category?: string;
    rating?: number;
  }): Promise<Recipe[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private recipes: Map<string, Recipe>;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = randomUUID();
    const now = new Date();
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      descriptionEn: insertRecipe.descriptionEn ?? null,
      descriptionAr: insertRecipe.descriptionAr ?? null,
      calories: insertRecipe.calories ?? null,
      prepTime: insertRecipe.prepTime ?? null,
      images: Array.isArray(insertRecipe.images) ? insertRecipe.images as string[] : [],
      ingredientsEn: Array.isArray(insertRecipe.ingredientsEn) ? insertRecipe.ingredientsEn : [],
      ingredientsAr: Array.isArray(insertRecipe.ingredientsAr) ? insertRecipe.ingredientsAr : [],
      toolsEn: Array.isArray(insertRecipe.toolsEn) ? insertRecipe.toolsEn as string[] : [],
      toolsAr: Array.isArray(insertRecipe.toolsAr) ? insertRecipe.toolsAr as string[] : [],
      additionalLinks: Array.isArray(insertRecipe.additionalLinks) ? insertRecipe.additionalLinks : [],
      rating: insertRecipe.rating ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: string, updateData: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);
    if (!existingRecipe) return undefined;

    const updatedRecipe: Recipe = {
      ...existingRecipe,
      ...updateData,
      descriptionEn: updateData.descriptionEn !== undefined ? updateData.descriptionEn : existingRecipe.descriptionEn,
      descriptionAr: updateData.descriptionAr !== undefined ? updateData.descriptionAr : existingRecipe.descriptionAr,
      calories: updateData.calories !== undefined ? updateData.calories : existingRecipe.calories,
      prepTime: updateData.prepTime !== undefined ? updateData.prepTime : existingRecipe.prepTime,
      images: updateData.images !== undefined ? (Array.isArray(updateData.images) ? updateData.images as string[] : []) : existingRecipe.images,
      ingredientsEn: updateData.ingredientsEn !== undefined ? (Array.isArray(updateData.ingredientsEn) ? updateData.ingredientsEn : []) : existingRecipe.ingredientsEn,
      ingredientsAr: updateData.ingredientsAr !== undefined ? (Array.isArray(updateData.ingredientsAr) ? updateData.ingredientsAr : []) : existingRecipe.ingredientsAr,
      toolsEn: updateData.toolsEn !== undefined ? (Array.isArray(updateData.toolsEn) ? updateData.toolsEn as string[] : []) : existingRecipe.toolsEn,
      toolsAr: updateData.toolsAr !== undefined ? (Array.isArray(updateData.toolsAr) ? updateData.toolsAr as string[] : []) : existingRecipe.toolsAr,
      additionalLinks: updateData.additionalLinks !== undefined ? (Array.isArray(updateData.additionalLinks) ? updateData.additionalLinks : []) : existingRecipe.additionalLinks,
      rating: updateData.rating !== undefined ? updateData.rating : existingRecipe.rating,
      updatedAt: new Date(),
    };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.nameEn.toLowerCase().includes(lowerQuery) ||
      recipe.nameAr.toLowerCase().includes(lowerQuery) ||
      recipe.country.toLowerCase().includes(lowerQuery) ||
      (recipe.ingredientsEn && recipe.ingredientsEn.some(ing => ing.name.toLowerCase().includes(lowerQuery))) ||
      (recipe.ingredientsAr && recipe.ingredientsAr.some(ing => ing.name.toLowerCase().includes(lowerQuery)))
    );
  }

  async filterRecipes(filters: {
    country?: string;
    servingTemperature?: string;
    category?: string;
    rating?: number;
  }): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(recipe => {
      if (filters.country && recipe.country !== filters.country) return false;
      if (filters.servingTemperature && recipe.servingTemperature !== filters.servingTemperature) return false;
      if (filters.category && recipe.category !== filters.category) return false;
      if (filters.rating && (recipe.rating || 0) < filters.rating) return false;
      return true;
    });
  }
}

export const storage = new MemStorage();
