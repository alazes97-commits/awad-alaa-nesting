import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema, insertShoppingListSchema, insertPantrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const { search, country, servingTemperature, category, rating } = req.query;
      
      let recipes;
      if (search) {
        recipes = await storage.searchRecipes(search as string);
      } else if (country || servingTemperature || category || rating) {
        recipes = await storage.filterRecipes({
          country: country as string,
          servingTemperature: servingTemperature as string,
          category: category as string,
          rating: rating ? parseInt(rating as string) : undefined,
        });
      } else {
        recipes = await storage.getAllRecipes();
      }
      
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipeById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Create new recipe
  app.post("/api/recipes", async (req, res) => {
    try {
      const validatedData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(validatedData);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid recipe data", errors: error });
      }
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });

  // Update recipe
  app.put("/api/recipes/:id", async (req, res) => {
    try {
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      const recipe = await storage.updateRecipe(req.params.id, validatedData);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid recipe data", errors: error });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  // Delete recipe
  app.delete("/api/recipes/:id", async (req, res) => {
    try {
      const success = await storage.deleteRecipe(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // Shopping List Routes
  app.get("/api/shopping", async (req, res) => {
    try {
      const items = await storage.getAllShoppingItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shopping list" });
    }
  });

  app.post("/api/shopping", async (req, res) => {
    try {
      const validatedData = insertShoppingListSchema.parse(req.body);
      const item = await storage.createShoppingItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid shopping item data", errors: error });
      }
      res.status(500).json({ message: "Failed to create shopping item" });
    }
  });

  app.put("/api/shopping/:id", async (req, res) => {
    try {
      const validatedData = insertShoppingListSchema.partial().parse(req.body);
      const item = await storage.updateShoppingItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Shopping item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shopping item" });
    }
  });

  app.delete("/api/shopping/:id", async (req, res) => {
    try {
      const success = await storage.deleteShoppingItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Shopping item not found" });
      }
      res.json({ message: "Shopping item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shopping item" });
    }
  });

  app.patch("/api/shopping/:id/toggle", async (req, res) => {
    try {
      const item = await storage.toggleShoppingItemCompleted(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Shopping item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle shopping item" });
    }
  });

  app.delete("/api/shopping/completed", async (req, res) => {
    try {
      await storage.clearCompletedShoppingItems();
      res.json({ message: "Completed items cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear completed items" });
    }
  });

  // Pantry Routes
  app.get("/api/pantry", async (req, res) => {
    try {
      const items = await storage.getAllPantryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pantry items" });
    }
  });

  app.get("/api/pantry/low-stock", async (req, res) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  app.get("/api/pantry/expiring-soon", async (req, res) => {
    try {
      const items = await storage.getExpiringSoonItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expiring items" });
    }
  });

  app.post("/api/pantry", async (req, res) => {
    try {
      const validatedData = insertPantrySchema.parse(req.body);
      const item = await storage.createPantryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid pantry item data", errors: error });
      }
      res.status(500).json({ message: "Failed to create pantry item" });
    }
  });

  app.put("/api/pantry/:id", async (req, res) => {
    try {
      const validatedData = insertPantrySchema.partial().parse(req.body);
      const item = await storage.updatePantryItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Pantry item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update pantry item" });
    }
  });

  app.delete("/api/pantry/:id", async (req, res) => {
    try {
      const success = await storage.deletePantryItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Pantry item not found" });
      }
      res.json({ message: "Pantry item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pantry item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
