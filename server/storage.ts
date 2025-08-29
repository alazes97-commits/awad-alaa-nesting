import { 
  recipes, 
  shoppingList, 
  pantry, 
  toolsList,
  users, 
  familyGroups,
  type Recipe, 
  type InsertRecipe, 
  type ShoppingListItem, 
  type InsertShoppingListItem,
  type PantryItem,
  type InsertPantryItem,
  type ToolsListItem,
  type InsertToolsListItem,
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
  
  // Tools list operations (family-scoped)
  getAllToolsItems(familyGroupId?: string): Promise<ToolsListItem[]>;
  getToolsItemById(id: string): Promise<ToolsListItem | undefined>;
  createToolsItem(item: InsertToolsListItem): Promise<ToolsListItem>;
  updateToolsItem(id: string, item: Partial<InsertToolsListItem>): Promise<ToolsListItem | undefined>;
  deleteToolsItem(id: string): Promise<boolean>;
  toggleToolsItemAvailable(id: string): Promise<ToolsListItem | undefined>;
  clearAvailableToolsItems(familyGroupId?: string): Promise<boolean>;
  
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
    // Return all recipes when no family group is specified
    return await db.select().from(recipes);
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(recipeData: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db
      .insert(recipes)
      .values([recipeData])
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
    const conditions = [
      or(
        like(recipes.nameEn, `%${query}%`),
        like(recipes.nameAr, `%${query}%`),
        like(recipes.descriptionEn, `%${query}%`),
        like(recipes.descriptionAr, `%${query}%`)
      )
    ];
    
    if (familyGroupId) {
      conditions.push(eq(recipes.familyGroupId, familyGroupId));
    }
    
    return await db
      .select()
      .from(recipes)
      .where(and(...conditions));
  }

  async filterRecipes(filters: any, familyGroupId?: string): Promise<Recipe[]> {
    const conditions = [];
    
    if (familyGroupId) {
      conditions.push(eq(recipes.familyGroupId, familyGroupId));
    }
    
    if (filters.country) conditions.push(eq(recipes.country, filters.country));
    if (filters.servingTemperature) conditions.push(eq(recipes.servingTemperature, filters.servingTemperature));
    if (filters.category) conditions.push(eq(recipes.category, filters.category));
    if (filters.rating) conditions.push(eq(recipes.rating, filters.rating));

    return await db.select().from(recipes).where(and(...conditions));
  }

  // Shopping list operations
  async getAllShoppingItems(familyGroupId?: string): Promise<ShoppingListItem[]> {
    console.log('🛒 getAllShoppingItems called with familyGroupId:', familyGroupId);
    if (familyGroupId && familyGroupId !== '') {
      const items = await db.select().from(shoppingList).where(eq(shoppingList.familyGroupId, familyGroupId));
      console.log('🛒 Found items for familyGroupId:', items.length);
      return items;
    }
    const items = await db.select().from(shoppingList).where(eq(shoppingList.familyGroupId, sql`NULL`));
    console.log('🛒 Found items with NULL familyGroupId:', items.length);
    return items;
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
            and(
              sql`LOWER(TRIM(${shoppingList.itemNameEn})) = LOWER(TRIM(${itemData.itemNameEn}))`,
              sql`LENGTH(TRIM(${itemData.itemNameEn})) > 0`
            ),
            and(
              sql`LOWER(TRIM(${shoppingList.itemNameAr})) = LOWER(TRIM(${itemData.itemNameAr}))`,
              sql`LENGTH(TRIM(${itemData.itemNameAr || ''})) > 0`
            )
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
        
        // Clean up notes - only keep the recipe sources, remove the old additions
        const recipeNotes = existingItem.notes?.split(',').filter(note => 
          note.trim().startsWith('From recipe:')
        ).join(', ') || '';
        
        combinedNotes = itemData.notes ? 
          (recipeNotes ? `${recipeNotes}, ${itemData.notes}` : itemData.notes) : 
          recipeNotes;
      } else {
        combinedQuantity = existingItem.quantity;
        const newQuantityNote = `+ ${itemData.quantity}`;
        combinedNotes = combinedNotes ? `${combinedNotes}, ${newQuantityNote}` : newQuantityNote;
      }
      
      // Update existing item with combined quantity and notes
      const merged = this.canMergeUnits(existingQty.unit, newQty.unit) ? 
        this.convertAndMergeUnits(existingQty.amount, existingQty.unit, newQty.amount, newQty.unit) : 
        { unit: existingItem.unit };
        
      const [updatedItem] = await db
        .update(shoppingList)
        .set({
          quantity: combinedQuantity,
          unit: merged.unit,
          notes: combinedNotes,
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
    // Units that can be converted to grams (dry ingredients)
    const dryUnits = ['gram', 'kg', 'كيلو', 'كيلوجرام', 'cup', 'كوب', 'tablespoon', 'ملعقة كبيرة', 'teaspoon', 'ملعقة صغيرة'];
    
    // Units that can be converted to ml (liquids)
    const liquidUnits = ['ml', 'مل', 'liter', 'لتر', 'cup', 'كوب', 'tablespoon', 'ملعقة كبيرة', 'teaspoon', 'ملعقة صغيرة'];
    
    // Counting units
    const countUnits = ['piece', 'pieces', 'قطعة', 'قطع', 'حبة', 'حبات'];
    
    // Check if both units are in the same category
    const bothDry = dryUnits.includes(unit1) && dryUnits.includes(unit2);
    const bothLiquid = liquidUnits.includes(unit1) && liquidUnits.includes(unit2);
    const bothCount = countUnits.includes(unit1) && countUnits.includes(unit2);
    
    return bothDry || bothLiquid || bothCount || unit1 === unit2;
  }

  private convertToGrams(amount: number, unit: string): number | null {
    // Convert various units to grams for dry ingredients
    const conversions: Record<string, number> = {
      'gram': 1,
      'kg': 1000,
      'كيلو': 1000,
      'كيلوجرام': 1000,
      'cup': 120, // Average for flour/sugar
      'كوب': 120, // Average for flour/sugar  
      'tablespoon': 15,
      'ملعقة كبيرة': 15,
      'teaspoon': 5,
      'ملعقة صغيرة': 5
    };
    
    return conversions[unit] ? amount * conversions[unit] : null;
  }

  private convertToMilliliters(amount: number, unit: string): number | null {
    // Convert various units to ml for liquids
    const conversions: Record<string, number> = {
      'ml': 1,
      'مل': 1,
      'liter': 1000,
      'لتر': 1000,
      'cup': 240, // Standard cup for liquids
      'كوب': 240,
      'tablespoon': 15,
      'ملعقة كبيرة': 15,
      'teaspoon': 5,
      'ملعقة صغيرة': 5
    };
    
    return conversions[unit] ? amount * conversions[unit] : null;
  }

  private convertAndMergeUnits(amount1: number, unit1: string, amount2: number, unit2: string): { amount: number; unit: string } {
    // Try converting to grams first (for dry ingredients)
    const grams1 = this.convertToGrams(amount1, unit1);
    const grams2 = this.convertToGrams(amount2, unit2);
    
    if (grams1 !== null && grams2 !== null) {
      const totalGrams = grams1 + grams2;
      
      // Convert back to kg if amount is large
      if (totalGrams >= 1000) {
        return { amount: Math.round((totalGrams / 1000) * 100) / 100, unit: 'kg' };
      }
      
      return { amount: Math.round(totalGrams * 100) / 100, unit: 'gram' };
    }
    
    // Try converting to milliliters (for liquids)
    const ml1 = this.convertToMilliliters(amount1, unit1);
    const ml2 = this.convertToMilliliters(amount2, unit2);
    
    if (ml1 !== null && ml2 !== null) {
      const totalMl = ml1 + ml2;
      
      // Convert back to liter if amount is large
      if (totalMl >= 1000) {
        return { amount: Math.round((totalMl / 1000) * 100) / 100, unit: 'liter' };
      }
      
      return { amount: Math.round(totalMl * 100) / 100, unit: 'ml' };
    }
    
    // Same units - just add
    if (unit1 === unit2) {
      return { amount: Math.round((amount1 + amount2) * 100) / 100, unit: unit1 };
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
    const conditions = [eq(shoppingList.isCompleted, true)];
    
    if (familyGroupId) {
      conditions.push(eq(shoppingList.familyGroupId, familyGroupId));
    } else {
      conditions.push(eq(shoppingList.familyGroupId, sql`NULL`));
    }
    
    const result = await db
      .delete(shoppingList)
      .where(and(...conditions));
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

  async markShoppingItemAsBought(id: string): Promise<{ pantryItem: PantryItem } | undefined> {
    try {
      // Get the shopping item first
      const shoppingItem = await this.getShoppingItemById(id);
      if (!shoppingItem) {
        return undefined;
      }

      // Create pantry item from shopping item
      const pantryData = {
        itemNameEn: shoppingItem.itemNameEn,
        itemNameAr: shoppingItem.itemNameAr,
        quantity: shoppingItem.quantity,
        unit: shoppingItem.unit,
        category: shoppingItem.category,
        notes: shoppingItem.notes,
        location: 'pantry', // default location
        familyGroupId: shoppingItem.familyGroupId,
        createdBy: shoppingItem.createdBy,
      };

      // Check if similar item already exists in pantry
      const existingPantryItems = await db
        .select()
        .from(pantry)
        .where(
          and(
            eq(pantry.itemNameEn, shoppingItem.itemNameEn),
            eq(pantry.itemNameAr, shoppingItem.itemNameAr),
            eq(pantry.unit, shoppingItem.unit || 'piece'),
            shoppingItem.familyGroupId 
              ? eq(pantry.familyGroupId, shoppingItem.familyGroupId)
              : eq(pantry.familyGroupId, sql`NULL`)
          )
        );

      let pantryItem: PantryItem;

      if (existingPantryItems.length > 0) {
        // Merge with existing item
        const existing = existingPantryItems[0];
        const { amount: existingAmount } = this.parseQuantity(existing.quantity);
        const { amount: newAmount } = this.parseQuantity(shoppingItem.quantity);
        const totalAmount = existingAmount + newAmount;

        const [updatedItem] = await db
          .update(pantry)
          .set({
            quantity: `${totalAmount}`,
            updatedAt: new Date(),
            notes: existing.notes ? `${existing.notes}; ${shoppingItem.notes || 'Added from shopping list'}` : (shoppingItem.notes || 'Added from shopping list')
          })
          .where(eq(pantry.id, existing.id))
          .returning();
        
        pantryItem = updatedItem;
      } else {
        // Create new pantry item
        const [newItem] = await db
          .insert(pantry)
          .values({
            ...pantryData,
            notes: pantryData.notes || 'Added from shopping list'
          })
          .returning();
        
        pantryItem = newItem;
      }

      // Delete from shopping list
      await db.delete(shoppingList).where(eq(shoppingList.id, id));

      return { pantryItem };
    } catch (error) {
      console.error('Error marking shopping item as bought:', error);
      throw error;
    }
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

  // Tools list operations
  async getAllToolsItems(familyGroupId?: string): Promise<ToolsListItem[]> {
    console.log('🔧 getAllToolsItems called with familyGroupId:', familyGroupId);
    if (familyGroupId && familyGroupId !== '') {
      const items = await db.select().from(toolsList).where(eq(toolsList.familyGroupId, familyGroupId));
      console.log('🔧 Found tools for familyGroupId:', items.length);
      return items;
    }
    const items = await db.select().from(toolsList).where(eq(toolsList.familyGroupId, sql`NULL`));
    console.log('🔧 Found tools with NULL familyGroupId:', items.length);
    return items;
  }

  async getToolsItemById(id: string): Promise<ToolsListItem | undefined> {
    const [item] = await db.select().from(toolsList).where(eq(toolsList.id, id));
    return item;
  }

  async createToolsItem(itemData: InsertToolsListItem): Promise<ToolsListItem> {
    const [item] = await db
      .insert(toolsList)
      .values(itemData)
      .returning();
    return item;
  }

  async updateToolsItem(id: string, itemData: Partial<InsertToolsListItem>): Promise<ToolsListItem | undefined> {
    const [item] = await db
      .update(toolsList)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(toolsList.id, id))
      .returning();
    return item;
  }

  async deleteToolsItem(id: string): Promise<boolean> {
    const result = await db.delete(toolsList).where(eq(toolsList.id, id));
    return (result.rowCount || 0) > 0;
  }

  async toggleToolsItemAvailable(id: string): Promise<ToolsListItem | undefined> {
    const item = await this.getToolsItemById(id);
    if (!item) return undefined;

    const [updatedItem] = await db
      .update(toolsList)
      .set({ isAvailable: !item.isAvailable, updatedAt: new Date() })
      .where(eq(toolsList.id, id))
      .returning();
    return updatedItem;
  }

  async clearAvailableToolsItems(familyGroupId?: string): Promise<boolean> {
    const conditions = [eq(toolsList.isAvailable, true)];
    
    if (familyGroupId) {
      conditions.push(eq(toolsList.familyGroupId, familyGroupId));
    } else {
      conditions.push(eq(toolsList.familyGroupId, sql`NULL`));
    }
    
    const result = await db
      .delete(toolsList)
      .where(and(...conditions));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();