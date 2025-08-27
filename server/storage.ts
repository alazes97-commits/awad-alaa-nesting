import { 
  recipes, 
  shoppingList, 
  pantry, 
  users, 
  familyGroups,
  type Recipe, 
  type InsertRecipe, 
  type ShoppingListItem, 
  type InsertShoppingListItem,
  type PantryItem,
  type InsertPantryItem,
  type User,
  type InsertUser,
  type FamilyGroup,
  type InsertFamilyGroup
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Family Group operations
  getFamilyGroup(id: string): Promise<FamilyGroup | undefined>;
  getFamilyGroupByInviteCode(code: string): Promise<FamilyGroup | undefined>;
  createFamilyGroup(group: InsertFamilyGroup): Promise<FamilyGroup>;
  joinFamilyGroup(userId: string, familyGroupId: string): Promise<void>;
  getUsersByFamilyGroup(familyGroupId: string): Promise<User[]>;
  
  // Recipe operations (family-scoped)
  getAllRecipes(familyGroupId?: string): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: string): Promise<boolean>;
  searchRecipes(query: string, familyGroupId?: string): Promise<Recipe[]>;
  filterRecipes(filters: any, familyGroupId?: string): Promise<Recipe[]>;
  
  // Shopping list operations (family-scoped)
  getAllShoppingItems(familyGroupId?: string): Promise<ShoppingListItem[]>;
  getShoppingItemById(id: string): Promise<ShoppingListItem | undefined>;
  createShoppingItem(item: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingItem(id: string, item: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined>;
  deleteShoppingItem(id: string): Promise<boolean>;
  
  // Pantry operations (family-scoped)
  getAllPantryItems(familyGroupId?: string): Promise<PantryItem[]>;
  getPantryItemById(id: string): Promise<PantryItem | undefined>;
  createPantryItem(item: InsertPantryItem): Promise<PantryItem>;
  updatePantryItem(id: string, item: Partial<InsertPantryItem>): Promise<PantryItem | undefined>;
  deletePantryItem(id: string): Promise<boolean>;
  
  // Additional shopping list operations
  toggleShoppingItemCompleted(id: string): Promise<ShoppingListItem | undefined>;
  clearCompletedShoppingItems(familyGroupId?: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Family Group operations
  async getFamilyGroup(id: string): Promise<FamilyGroup | undefined> {
    const [group] = await db.select().from(familyGroups).where(eq(familyGroups.id, id));
    return group;
  }

  async getFamilyGroupByInviteCode(code: string): Promise<FamilyGroup | undefined> {
    const [group] = await db.select().from(familyGroups).where(eq(familyGroups.inviteCode, code));
    return group;
  }

  async createFamilyGroup(groupData: InsertFamilyGroup): Promise<FamilyGroup> {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [group] = await db
      .insert(familyGroups)
      .values({ ...groupData, inviteCode })
      .returning();
    return group;
  }

  async joinFamilyGroup(userId: string, familyGroupId: string): Promise<void> {
    await db
      .update(users)
      .set({ familyGroupId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getUsersByFamilyGroup(familyGroupId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.familyGroupId, familyGroupId));
  }

  // Recipe operations
  async getAllRecipes(familyGroupId?: string): Promise<Recipe[]> {
    if (familyGroupId) {
      return await db.select().from(recipes).where(eq(recipes.familyGroupId, familyGroupId));
    }
    return await db.select().from(recipes).where(eq(recipes.familyGroupId, sql`NULL`));
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(recipeData: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db
      .insert(recipes)
      .values({
        ...recipeData,
        nameEn: recipeData.nameEn || '',
        nameAr: recipeData.nameAr || '',
        instructionsEn: recipeData.instructionsEn || '',
        instructionsAr: recipeData.instructionsAr || '',
        country: recipeData.country || '',
        servingTemperature: recipeData.servingTemperature || '',
        category: recipeData.category || ''
      })
      .returning();
    return recipe;
  }

  async updateRecipe(id: string, recipeData: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const updateData: any = { ...recipeData, updatedAt: new Date() };
    const [recipe] = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();
    return recipe;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchRecipes(query: string, familyGroupId?: string): Promise<Recipe[]> {
    const baseCondition = familyGroupId 
      ? eq(recipes.familyGroupId, familyGroupId)
      : eq(recipes.familyGroupId, sql`NULL`);
    
    return await db
      .select()
      .from(recipes)
      .where(and(
        baseCondition,
        or(
          like(recipes.nameEn, `%${query}%`),
          like(recipes.nameAr, `%${query}%`),
          like(recipes.descriptionEn, `%${query}%`),
          like(recipes.descriptionAr, `%${query}%`)
        )
      ));
  }

  async filterRecipes(filters: any, familyGroupId?: string): Promise<Recipe[]> {
    const conditions = [];
    
    if (familyGroupId) {
      conditions.push(eq(recipes.familyGroupId, familyGroupId));
    } else {
      conditions.push(eq(recipes.familyGroupId, sql`NULL`));
    }
    
    if (filters.country) conditions.push(eq(recipes.country, filters.country));
    if (filters.servingTemperature) conditions.push(eq(recipes.servingTemperature, filters.servingTemperature));
    if (filters.category) conditions.push(eq(recipes.category, filters.category));
    if (filters.rating) conditions.push(eq(recipes.rating, filters.rating));

    return await db.select().from(recipes).where(and(...conditions));
  }

  // Shopping list operations
  async getAllShoppingItems(familyGroupId?: string): Promise<ShoppingListItem[]> {
    if (familyGroupId) {
      return await db.select().from(shoppingList).where(eq(shoppingList.familyGroupId, familyGroupId));
    }
    return await db.select().from(shoppingList).where(eq(shoppingList.familyGroupId, sql`NULL`));
  }

  async getShoppingItemById(id: string): Promise<ShoppingListItem | undefined> {
    const [item] = await db.select().from(shoppingList).where(eq(shoppingList.id, id));
    return item;
  }

  async createShoppingItem(itemData: InsertShoppingListItem): Promise<ShoppingListItem> {
    // Check if similar item already exists (same name and family group)
    const existingItems = await db.select()
      .from(shoppingList)
      .where(
        and(
          or(
            sql`LOWER(${shoppingList.itemNameEn}) = LOWER(${itemData.itemNameEn})`,
            sql`LOWER(${shoppingList.itemNameAr}) = LOWER(${itemData.itemNameAr})`
          ),
          eq(shoppingList.familyGroupId, itemData.familyGroupId || sql`NULL`),
          eq(shoppingList.isCompleted, false)
        )
      );

    if (existingItems.length > 0) {
      // Merge with existing item
      const existingItem = existingItems[0];
      
      // Parse quantities and combine them
      const existingQty = this.parseQuantity(existingItem.quantity);
      const newQty = this.parseQuantity(itemData.quantity);
      
      // Try to merge units if compatible
      let combinedQuantity: string;
      let combinedNotes = existingItem.notes || '';
      
      if (this.canMergeUnits(existingQty.unit, newQty.unit)) {
        const merged = this.convertAndMergeUnits(existingQty.amount, existingQty.unit, newQty.amount, newQty.unit);
        combinedQuantity = `${merged.amount} ${merged.unit}`;
      } else {
        combinedQuantity = existingItem.quantity;
        const newQuantityNote = `+ ${itemData.quantity}`;
        combinedNotes = combinedNotes ? `${combinedNotes}, ${newQuantityNote}` : newQuantityNote;
      }
      
      // Update existing item with combined quantity and notes
      const [updatedItem] = await db
        .update(shoppingList)
        .set({
          quantity: combinedQuantity,
          notes: itemData.notes ? `${combinedNotes}, ${itemData.notes}` : combinedNotes,
          updatedAt: new Date()
        })
        .where(eq(shoppingList.id, existingItem.id))
        .returning();
      
      return updatedItem;
    } else {
      // Create new item
      const [item] = await db
        .insert(shoppingList)
        .values(itemData)
        .returning();
      return item;
    }
  }

  private parseQuantity(quantity: string): { amount: number; unit: string } {
    const match = quantity.match(/^(\d*\.?\d+)\s*(.*)$/);
    if (!match) {
      return { amount: 1, unit: 'piece' };
    }
    
    const amount = parseFloat(match[1]) || 1;
    let unit = match[2]?.trim() || 'piece';
    
    // Normalize common units
    const unitNormalization: Record<string, string> = {
      'g': 'gram',
      'grams': 'gram',
      'جرام': 'gram',
      'جم': 'gram',
      'kg': 'kg',
      'كيلو': 'kg',
      'كيلوجرام': 'kg',
      'ml': 'ml',
      'مل': 'ml',
      'liter': 'liter',
      'لتر': 'liter',
      'l': 'liter',
      'cup': 'cup',
      'cups': 'cup',
      'كوب': 'cup',
      'piece': 'piece',
      'pieces': 'piece',
      'قطعة': 'piece',
      'حبة': 'piece'
    };
    
    unit = unitNormalization[unit.toLowerCase()] || unit;
    
    return { amount, unit };
  }

  private canMergeUnits(unit1: string, unit2: string): boolean {
    // Define unit groups that can be merged together
    const mergeGroups = [
      ['gram', 'kg'],
      ['جرام', 'كيلو', 'كيلوجرام'],
      ['ml', 'liter'],
      ['مل', 'لتر'],
      ['cup'],
      ['كوب'],
      ['piece'],
      ['قطعة', 'حبة']
    ];
    
    for (const group of mergeGroups) {
      if (group.includes(unit1) && group.includes(unit2)) {
        return true;
      }
    }
    
    return unit1 === unit2;
  }

  private convertAndMergeUnits(amount1: number, unit1: string, amount2: number, unit2: string): { amount: number; unit: string } {
    // Convert to base units and merge
    if (unit1 === 'kg' && unit2 === 'gram') {
      return { amount: amount1 + (amount2 / 1000), unit: 'kg' };
    }
    if (unit1 === 'gram' && unit2 === 'kg') {
      return { amount: (amount1 / 1000) + amount2, unit: 'kg' };
    }
    if (unit1 === 'liter' && unit2 === 'ml') {
      return { amount: amount1 + (amount2 / 1000), unit: 'liter' };
    }
    if (unit1 === 'ml' && unit2 === 'liter') {
      return { amount: (amount1 / 1000) + amount2, unit: 'liter' };
    }
    
    // Same units - just add
    if (unit1 === unit2) {
      return { amount: amount1 + amount2, unit: unit1 };
    }
    
    // Can't merge - return original
    return { amount: amount1, unit: unit1 };
  }

  async updateShoppingItem(id: string, itemData: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined> {
    const [item] = await db
      .update(shoppingList)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(shoppingList.id, id))
      .returning();
    return item;
  }

  async deleteShoppingItem(id: string): Promise<boolean> {
    const result = await db.delete(shoppingList).where(eq(shoppingList.id, id));
    return (result.rowCount || 0) > 0;
  }

  async toggleShoppingItemCompleted(id: string): Promise<ShoppingListItem | undefined> {
    const item = await this.getShoppingItemById(id);
    if (!item) return undefined;

    const [updatedItem] = await db
      .update(shoppingList)
      .set({ isCompleted: !item.isCompleted, updatedAt: new Date() })
      .where(eq(shoppingList.id, id))
      .returning();
    return updatedItem;
  }

  async clearCompletedShoppingItems(familyGroupId?: string): Promise<boolean> {
    let condition = eq(shoppingList.isCompleted, true);
    
    if (familyGroupId) {
      condition = and(condition, eq(shoppingList.familyGroupId, familyGroupId));
    } else {
      condition = and(condition, eq(shoppingList.familyGroupId, sql`NULL`));
    }
    
    const result = await db
      .delete(shoppingList)
      .where(condition);
    return (result.rowCount || 0) > 0;
  }

  // Pantry operations
  async getAllPantryItems(familyGroupId?: string): Promise<PantryItem[]> {
    if (familyGroupId) {
      return await db.select().from(pantry).where(eq(pantry.familyGroupId, familyGroupId));
    }
    return await db.select().from(pantry).where(eq(pantry.familyGroupId, sql`NULL`));
  }

  async getPantryItemById(id: string): Promise<PantryItem | undefined> {
    const [item] = await db.select().from(pantry).where(eq(pantry.id, id));
    return item;
  }

  async createPantryItem(itemData: InsertPantryItem): Promise<PantryItem> {
    const [item] = await db
      .insert(pantry)
      .values(itemData)
      .returning();
    return item;
  }

  async updatePantryItem(id: string, itemData: Partial<InsertPantryItem>): Promise<PantryItem | undefined> {
    const [item] = await db
      .update(pantry)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(pantry.id, id))
      .returning();
    return item;
  }

  async deletePantryItem(id: string): Promise<boolean> {
    const result = await db.delete(pantry).where(eq(pantry.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getLowStockItems(): Promise<PantryItem[]> {
    // This would require complex SQL for comparing quantities
    // For now, return empty array and implement client-side filtering
    return [];
  }

  async getExpiringSoonItems(): Promise<PantryItem[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return await db
      .select()
      .from(pantry)
      .where(
        and(
          sql`${pantry.expiryDate} IS NOT NULL`,
          sql`${pantry.expiryDate} <= ${sevenDaysFromNow.toISOString()}`
        )
      );
  }
}

export const storage = new DatabaseStorage();