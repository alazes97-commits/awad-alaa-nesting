// Utility functions for ingredient processing and unit conversion

interface Ingredient {
  name: string;
  amount: string;
}

interface ProcessedIngredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
}

// Category mapping for ingredients
const INGREDIENT_CATEGORIES: Record<string, string> = {
  // Vegetables
  'طماطم': 'vegetables',
  'tomato': 'vegetables',
  'بصل': 'vegetables', 
  'onion': 'vegetables',
  'ثوم': 'vegetables',
  'garlic': 'vegetables',
  'جزر': 'vegetables',
  'carrot': 'vegetables',
  'بطاطس': 'vegetables',
  'potato': 'vegetables',
  'خيار': 'vegetables',
  'cucumber': 'vegetables',
  'فلفل': 'vegetables',
  'pepper': 'vegetables',
  'باذنجان': 'vegetables',
  'eggplant': 'vegetables',
  
  // Meats
  'لحم': 'meat',
  'meat': 'meat',
  'دجاج': 'meat',
  'chicken': 'meat',
  'سمك': 'meat',
  'fish': 'meat',
  'لحم بقر': 'meat',
  'beef': 'meat',
  'لحم خروف': 'meat',
  'lamb': 'meat',
  
  // Dairy
  'حليب': 'dairy',
  'milk': 'dairy',
  'جبن': 'dairy',
  'cheese': 'dairy',
  'زبدة': 'dairy',
  'butter': 'dairy',
  'كريمة': 'dairy',
  'cream': 'dairy',
  'زبادي': 'dairy',
  'yogurt': 'dairy',
  'بيض': 'dairy',
  'egg': 'dairy',
  
  // Grains & Starches
  'دقيق': 'grains',
  'flour': 'grains',
  'أرز': 'grains',
  'rice': 'grains',
  'خبز': 'grains',
  'bread': 'grains',
  'شعيرية': 'grains',
  'pasta': 'grains',
  'برغل': 'grains',
  'bulgur': 'grains',
  
  // Spices & Herbs
  'ملح': 'spices',
  'salt': 'spices',
  'فلفل أسود': 'spices',
  'black pepper': 'spices',
  'كمون': 'spices',
  'cumin': 'spices',
  'كزبرة': 'spices',
  'coriander': 'spices',
  'قرفة': 'spices',
  'cinnamon': 'spices',
  'هيل': 'spices',
  'cardamom': 'spices',
  'بقدونس': 'spices',
  'parsley': 'spices',
  'نعناع': 'spices',
  'mint': 'spices',
  
  // Oils & Liquids
  'زيت': 'oils',
  'oil': 'oils',
  'ماء': 'oils',
  'water': 'oils',
  'خل': 'oils',
  'vinegar': 'oils',
  'عصير ليمون': 'oils',
  'lemon juice': 'oils',
  
  // Other
  'سكر': 'other',
  'sugar': 'other',
  'عسل': 'other',
  'honey': 'other',
  'ملعقة صغيرة': 'other',
  'teaspoon': 'other',
  'ملعقة كبيرة': 'other',
  'tablespoon': 'other',
};

// Unit conversion constants
const UNIT_CONVERSIONS: Record<string, { to: string; factor: number }[]> = {
  'gram': [
    { to: 'kg', factor: 1000 },
    { to: 'كيلو', factor: 1000 },
    { to: 'كيلوجرام', factor: 1000 }
  ],
  'جرام': [
    { to: 'kg', factor: 1000 },
    { to: 'كيلو', factor: 1000 },
    { to: 'كيلوجرام', factor: 1000 }
  ],
  'ml': [
    { to: 'liter', factor: 1000 },
    { to: 'لتر', factor: 1000 }
  ],
  'مل': [
    { to: 'liter', factor: 1000 },
    { to: 'لتر', factor: 1000 }
  ],
  'cup': [
    { to: 'cups', factor: 1 }
  ],
  'كوب': [
    { to: 'أكواب', factor: 1 }
  ]
};

// Normalize unit names
const UNIT_ALIASES: Record<string, string> = {
  'g': 'gram',
  'grams': 'gram',
  'جرام': 'gram',
  'جم': 'gram',
  'kg': 'kg',
  'كيلو': 'kg',
  'كيلوجرام': 'kg',
  'كيلوغرام': 'kg',
  'ml': 'ml',
  'مل': 'ml',
  'milliliter': 'ml',
  'liter': 'liter',
  'لتر': 'liter',
  'l': 'liter',
  'cup': 'cup',
  'cups': 'cup',
  'كوب': 'cup',
  'أكواب': 'cup',
  'tbsp': 'tablespoon',
  'tablespoon': 'tablespoon',
  'ملعقة كبيرة': 'tablespoon',
  'م ك': 'tablespoon',
  'tsp': 'teaspoon',
  'teaspoon': 'teaspoon',
  'ملعقة صغيرة': 'teaspoon',
  'م ص': 'teaspoon',
  'piece': 'piece',
  'pieces': 'piece',
  'قطعة': 'piece',
  'قطع': 'piece',
  'حبة': 'piece',
  'حبات': 'piece'
};

export function parseAmount(amountStr: string): { amount: number; unit: string } {
  const trimmed = amountStr.trim();
  
  // Extract number and unit using regex
  const match = trimmed.match(/^(\d*\.?\d+)\s*(.*)$/);
  
  if (!match) {
    return { amount: 1, unit: 'piece' };
  }
  
  const amount = parseFloat(match[1]) || 1;
  const unit = match[2]?.trim() || 'piece';
  
  // Normalize unit
  const normalizedUnit = UNIT_ALIASES[unit.toLowerCase()] || unit;
  
  return { amount, unit: normalizedUnit };
}

export function getIngredientCategory(ingredientName: string): string {
  const name = ingredientName.toLowerCase().trim();
  
  // Check for exact matches first
  if (INGREDIENT_CATEGORIES[name]) {
    return INGREDIENT_CATEGORIES[name];
  }
  
  // Check for partial matches
  for (const [key, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
      return category;
    }
  }
  
  return 'other';
}

export function convertUnit(amount: number, fromUnit: string, targetUnit?: string): { amount: number; unit: string } {
  const normalizedFromUnit = UNIT_ALIASES[fromUnit.toLowerCase()] || fromUnit;
  
  if (!targetUnit) {
    // Auto-convert to larger units if amount is large
    const conversions = UNIT_CONVERSIONS[normalizedFromUnit];
    if (conversions) {
      for (const conversion of conversions) {
        if (amount >= conversion.factor) {
          return {
            amount: Math.round((amount / conversion.factor) * 100) / 100,
            unit: conversion.to
          };
        }
      }
    }
  }
  
  return { amount, unit: normalizedFromUnit };
}

export function processIngredients(ingredients: Ingredient[]): ProcessedIngredient[] {
  const processed: ProcessedIngredient[] = [];
  
  for (const ingredient of ingredients) {
    if (!ingredient.name?.trim() || !ingredient.amount?.trim()) continue;
    
    const { amount, unit } = parseAmount(ingredient.amount);
    const converted = convertUnit(amount, unit);
    const category = getIngredientCategory(ingredient.name);
    
    processed.push({
      name: ingredient.name.trim(),
      amount: converted.amount,
      unit: converted.unit,
      category
    });
  }
  
  return processed;
}

export function combineIngredients(ingredientsList: ProcessedIngredient[][]): ProcessedIngredient[] {
  const combined: Map<string, ProcessedIngredient> = new Map();
  
  for (const ingredients of ingredientsList) {
    for (const ingredient of ingredients) {
      const key = `${ingredient.name.toLowerCase()}_${ingredient.unit}`;
      
      if (combined.has(key)) {
        const existing = combined.get(key)!;
        existing.amount += ingredient.amount;
        
        // Convert to larger unit if needed
        const converted = convertUnit(existing.amount, existing.unit);
        existing.amount = converted.amount;
        existing.unit = converted.unit;
      } else {
        combined.set(key, { ...ingredient });
      }
    }
  }
  
  return Array.from(combined.values());
}

export function groupIngredientsByCategory(ingredients: ProcessedIngredient[]): Record<string, ProcessedIngredient[]> {
  const grouped: Record<string, ProcessedIngredient[]> = {};
  
  for (const ingredient of ingredients) {
    if (!grouped[ingredient.category]) {
      grouped[ingredient.category] = [];
    }
    grouped[ingredient.category].push(ingredient);
  }
  
  // Sort each category
  for (const category in grouped) {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return grouped;
}

export function formatAmount(amount: number, unit: string): string {
  // Round to 2 decimal places and remove trailing zeros
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded.toString();
  
  return `${formatted} ${unit}`;
}