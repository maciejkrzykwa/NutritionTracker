import { pgTable, text, serial, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }).notNull(),
  fat: decimal("fat", { precision: 5, scale: 2 }).notNull(),
  carbs: decimal("carbs", { precision: 5, scale: 2 }).notNull(),
});

export const dailyFoods = pgTable("daily_foods", {
  id: serial("id").primaryKey(),
  productId: serial("product_id").notNull(),
  date: date("date").notNull(),
  name: text("name").notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }).notNull(),
  fat: decimal("fat", { precision: 5, scale: 2 }).notNull(),
  carbs: decimal("carbs", { precision: 5, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 3, scale: 1 }).notNull().default("1.0"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertDailyFoodSchema = createInsertSchema(dailyFoods).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertDailyFood = z.infer<typeof insertDailyFoodSchema>;
export type DailyFood = typeof dailyFoods.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
