import { type Recipe, type InsertRecipe, type ShoppingListItem, type InsertShoppingListItem, type PantryItem, type InsertPantryItem } from "@shared/schema";
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

  // Shopping List methods
  getAllShoppingItems(): Promise<ShoppingListItem[]>;
  getShoppingItemById(id: string): Promise<ShoppingListItem | undefined>;
  createShoppingItem(item: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingItem(id: string, item: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined>;
  deleteShoppingItem(id: string): Promise<boolean>;
  toggleShoppingItemCompleted(id: string): Promise<ShoppingListItem | undefined>;
  clearCompletedShoppingItems(): Promise<boolean>;

  // Pantry methods
  getAllPantryItems(): Promise<PantryItem[]>;
  getPantryItemById(id: string): Promise<PantryItem | undefined>;
  createPantryItem(item: InsertPantryItem): Promise<PantryItem>;
  updatePantryItem(id: string, item: Partial<InsertPantryItem>): Promise<PantryItem | undefined>;
  deletePantryItem(id: string): Promise<boolean>;
  getLowStockItems(): Promise<PantryItem[]>;
  getExpiringSoonItems(): Promise<PantryItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private recipes: Map<string, Recipe>;
  private shoppingItems: Map<string, ShoppingListItem>;
  private pantryItems: Map<string, PantryItem>;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.shoppingItems = new Map();
    this.pantryItems = new Map();
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
      ingredientsEn: Array.isArray(insertRecipe.ingredientsEn) ? insertRecipe.ingredientsEn as Array<{name: string, amount: string}> : [],
      ingredientsAr: Array.isArray(insertRecipe.ingredientsAr) ? insertRecipe.ingredientsAr as Array<{name: string, amount: string}> : [],
      toolsEn: Array.isArray(insertRecipe.toolsEn) ? insertRecipe.toolsEn as string[] : [],
      toolsAr: Array.isArray(insertRecipe.toolsAr) ? insertRecipe.toolsAr as string[] : [],
      additionalLinks: Array.isArray(insertRecipe.additionalLinks) ? insertRecipe.additionalLinks as Array<{title: string, url: string}> : [],
      videoUrl: insertRecipe.videoUrl ?? null,
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
      ingredientsEn: updateData.ingredientsEn !== undefined ? (Array.isArray(updateData.ingredientsEn) ? updateData.ingredientsEn as Array<{name: string, amount: string}> : []) : existingRecipe.ingredientsEn,
      ingredientsAr: updateData.ingredientsAr !== undefined ? (Array.isArray(updateData.ingredientsAr) ? updateData.ingredientsAr as Array<{name: string, amount: string}> : []) : existingRecipe.ingredientsAr,
      toolsEn: updateData.toolsEn !== undefined ? (Array.isArray(updateData.toolsEn) ? updateData.toolsEn as string[] : []) : existingRecipe.toolsEn,
      toolsAr: updateData.toolsAr !== undefined ? (Array.isArray(updateData.toolsAr) ? updateData.toolsAr as string[] : []) : existingRecipe.toolsAr,
      additionalLinks: updateData.additionalLinks !== undefined ? (Array.isArray(updateData.additionalLinks) ? updateData.additionalLinks as Array<{title: string, url: string}> : []) : existingRecipe.additionalLinks,
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

  // Shopping List methods
  async getAllShoppingItems(): Promise<ShoppingListItem[]> {
    return Array.from(this.shoppingItems.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getShoppingItemById(id: string): Promise<ShoppingListItem | undefined> {
    return this.shoppingItems.get(id);
  }

  async createShoppingItem(insertItem: InsertShoppingListItem): Promise<ShoppingListItem> {
    const id = randomUUID();
    const now = new Date();
    const item: ShoppingListItem = {
      ...insertItem,
      id,
      unit: insertItem.unit ?? null,
      category: insertItem.category ?? null,
      notes: insertItem.notes ?? null,
      isCompleted: insertItem.isCompleted ?? false,
      recipeId: insertItem.recipeId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.shoppingItems.set(id, item);
    return item;
  }

  async updateShoppingItem(id: string, updateData: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined> {
    const existingItem = this.shoppingItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: ShoppingListItem = {
      ...existingItem,
      ...updateData,
      updatedAt: new Date(),
    };
    this.shoppingItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteShoppingItem(id: string): Promise<boolean> {
    return this.shoppingItems.delete(id);
  }

  async toggleShoppingItemCompleted(id: string): Promise<ShoppingListItem | undefined> {
    const item = this.shoppingItems.get(id);
    if (!item) return undefined;

    const updatedItem: ShoppingListItem = {
      ...item,
      isCompleted: !item.isCompleted,
      updatedAt: new Date(),
    };
    this.shoppingItems.set(id, updatedItem);
    return updatedItem;
  }

  async clearCompletedShoppingItems(): Promise<boolean> {
    const completed = Array.from(this.shoppingItems.entries())
      .filter(([_, item]) => item.isCompleted)
      .map(([id, _]) => id);
    
    completed.forEach(id => this.shoppingItems.delete(id));
    return true;
  }

  // Pantry methods
  async getAllPantryItems(): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPantryItemById(id: string): Promise<PantryItem | undefined> {
    return this.pantryItems.get(id);
  }

  async createPantryItem(insertItem: InsertPantryItem): Promise<PantryItem> {
    const id = randomUUID();
    const now = new Date();
    const item: PantryItem = {
      ...insertItem,
      id,
      unit: insertItem.unit ?? null,
      category: insertItem.category ?? null,
      expiryDate: insertItem.expiryDate ?? null,
      location: insertItem.location ?? null,
      notes: insertItem.notes ?? null,
      minimumStock: insertItem.minimumStock ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.pantryItems.set(id, item);
    return item;
  }

  async updatePantryItem(id: string, updateData: Partial<InsertPantryItem>): Promise<PantryItem | undefined> {
    const existingItem = this.pantryItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: PantryItem = {
      ...existingItem,
      ...updateData,
      updatedAt: new Date(),
    };
    this.pantryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePantryItem(id: string): Promise<boolean> {
    return this.pantryItems.delete(id);
  }

  async getLowStockItems(): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).filter(item => {
      if (!item.minimumStock || !item.quantity) return false;
      const currentQuantity = parseFloat(item.quantity);
      const minStock = parseFloat(item.minimumStock);
      return !isNaN(currentQuantity) && !isNaN(minStock) && currentQuantity <= minStock;
    });
  }

  async getExpiringSoonItems(): Promise<PantryItem[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return Array.from(this.pantryItems.values()).filter(item => {
      if (!item.expiryDate) return false;
      return new Date(item.expiryDate) <= sevenDaysFromNow;
    });
  }
}

export const storage = new MemStorage();
