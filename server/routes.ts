import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertDailyFoodSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Daily food routes
  app.get("/api/daily-foods", async (req, res) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      const dailyFoods = await storage.getDailyFoods(date);
      res.json(dailyFoods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily foods" });
    }
  });

  app.post("/api/daily-foods", async (req, res) => {
    try {
      const validatedData = insertDailyFoodSchema.parse(req.body);
      const dailyFood = await storage.addDailyFood(validatedData);
      res.status(201).json(dailyFood);
    } catch (error) {
      res.status(400).json({ message: "Invalid daily food data" });
    }
  });

  app.patch("/api/daily-foods/:id/multiplier", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { multiplier } = req.body;
      
      if (!multiplier || isNaN(parseFloat(multiplier)) || parseFloat(multiplier) < 0 || parseFloat(multiplier) > 10) {
        return res.status(400).json({ message: "Invalid multiplier value" });
      }
      
      const updatedFood = await storage.updateDailyFoodMultiplier(id, multiplier);
      if (!updatedFood) {
        return res.status(404).json({ message: "Daily food not found" });
      }
      
      res.json(updatedFood);
    } catch (error) {
      res.status(500).json({ message: "Failed to update multiplier" });
    }
  });

  app.delete("/api/daily-foods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDailyFood(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete daily food" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
