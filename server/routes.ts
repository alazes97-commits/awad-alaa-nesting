import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertRecipeSchema, insertShoppingListSchema, insertPantrySchema, insertUserSchema, insertFamilyGroupSchema } from "@shared/schema";

// Store connected clients for real-time sync
const connectedClients = new Set<WebSocket>();

// Broadcast changes to all connected clients
function broadcastChange(type: string, action: string, data: any) {
  const message = JSON.stringify({ type, action, data, timestamp: Date.now() });
  
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid user data", errors: error });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Family Group routes
  app.get("/api/family-groups/:id", async (req, res) => {
    try {
      const group = await storage.getFamilyGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Family group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family group" });
    }
  });

  app.get("/api/family-groups/invite/:code", async (req, res) => {
    try {
      const group = await storage.getFamilyGroupByInviteCode(req.params.code);
      if (!group) {
        return res.status(404).json({ message: "Invalid invite code" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family group" });
    }
  });

  app.get("/api/family-groups/:id/members", async (req, res) => {
    try {
      const members = await storage.getUsersByFamilyGroup(req.params.id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family members" });
    }
  });

  app.post("/api/family-groups", async (req, res) => {
    try {
      const validatedData = insertFamilyGroupSchema.parse(req.body);
      const group = await storage.createFamilyGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid family group data", errors: error });
      }
      res.status(500).json({ message: "Failed to create family group" });
    }
  });

  app.post("/api/family-groups/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      await storage.joinFamilyGroup(userId, req.params.id);
      res.json({ message: "Successfully joined family group" });
    } catch (error) {
      res.status(500).json({ message: "Failed to join family group" });
    }
  });

  // Get all recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const { search, country, servingTemperature, category, rating, familyGroupId } = req.query;
      
      let recipes;
      if (search) {
        recipes = await storage.searchRecipes(search as string, familyGroupId as string);
      } else if (country || servingTemperature || category || rating) {
        recipes = await storage.filterRecipes({
          country: country as string,
          servingTemperature: servingTemperature as string,
          category: category as string,
          rating: rating ? parseInt(rating as string) : undefined,
        }, familyGroupId as string);
      } else {
        recipes = await storage.getAllRecipes(familyGroupId as string);
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
      
      // Broadcast the change to all connected clients
      broadcastChange('recipes', 'create', recipe);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('recipes', 'update', recipe);
      
      res.json(recipe);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid recipe data", errors: error });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  // Patch recipe (for partial updates like rating)
  app.patch("/api/recipes/:id", async (req, res) => {
    try {
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      const recipe = await storage.updateRecipe(req.params.id, validatedData);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      // Broadcast the change to all connected clients
      broadcastChange('recipes', 'update', recipe);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('recipes', 'delete', { id: req.params.id });
      
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // Shopping List Routes
  app.get("/api/shopping", async (req, res) => {
    try {
      // Get user info from query params (sent by frontend)
      const familyGroupId = req.query.familyGroupId as string;
      const items = await storage.getAllShoppingItems(familyGroupId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shopping list" });
    }
  });

  app.post("/api/shopping", async (req, res) => {
    try {
      const validatedData = insertShoppingListSchema.parse(req.body);
      const item = await storage.createShoppingItem(validatedData);
      
      // Broadcast the change to all connected clients
      broadcastChange('shopping', 'create', item);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('shopping', 'update', item);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('shopping', 'delete', { id: req.params.id });
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('shopping', 'toggle', item);
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle shopping item" });
    }
  });

  app.delete("/api/shopping/completed", async (req, res) => {
    try {
      const familyGroupId = req.query.familyGroupId as string;
      await storage.clearCompletedShoppingItems(familyGroupId);
      
      // Broadcast the change to all connected clients
      broadcastChange('shopping', 'clear-completed', {});
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('pantry', 'create', item);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('pantry', 'update', item);
      
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
      
      // Broadcast the change to all connected clients
      broadcastChange('pantry', 'delete', { id: req.params.id });
      
      res.json({ message: "Pantry item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pantry item" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time sync
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    connectedClients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({ 
      type: 'system', 
      action: 'connected', 
      data: { message: 'Connected to real-time sync' },
      timestamp: Date.now()
    }));
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      connectedClients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });
  
  return httpServer;
}
