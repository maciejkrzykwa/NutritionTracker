import { products, dailyFoods, users, type Product, type InsertProduct, type DailyFood, type InsertDailyFood, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Daily food methods
  getDailyFoods(date: string): Promise<DailyFood[]>;
  addDailyFood(food: InsertDailyFood): Promise<DailyFood>;
  updateDailyFoodMultiplier(id: number, multiplier: string): Promise<DailyFood | undefined>;
  deleteDailyFood(id: number): Promise<void>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private dailyFoods: Map<number, DailyFood>;
  private users: Map<number, User>;
  private currentProductId: number;
  private currentDailyFoodId: number;
  private currentUserId: number;

  constructor() {
    this.products = new Map();
    this.dailyFoods = new Map();
    this.users = new Map();
    this.currentProductId = 1;
    this.currentDailyFoodId = 1;
    this.currentUserId = 1;

    // Initialize with default products
    this.initializeDefaultProducts();
  }

  private initializeDefaultProducts() {
    const defaultProducts = [
      { name: "100g Rice", protein: "3.00", fat: "0.10", carbs: "27.00" },
      { name: "100g Chicken", protein: "31.00", fat: "4.00", carbs: "0.00" }
    ];

    defaultProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { id, ...product });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { id, ...insertProduct };
    this.products.set(id, product);
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getDailyFoods(date: string): Promise<DailyFood[]> {
    return Array.from(this.dailyFoods.values()).filter(food => food.date === date);
  }

  async addDailyFood(insertDailyFood: InsertDailyFood): Promise<DailyFood> {
    const id = this.currentDailyFoodId++;
    const dailyFood: DailyFood = { 
      id, 
      multiplier: "1.0", 
      productId: insertDailyFood.productId!,
      date: insertDailyFood.date,
      name: insertDailyFood.name,
      protein: insertDailyFood.protein,
      fat: insertDailyFood.fat,
      carbs: insertDailyFood.carbs
    };
    this.dailyFoods.set(id, dailyFood);
    return dailyFood;
  }

  async updateDailyFoodMultiplier(id: number, multiplier: string): Promise<DailyFood | undefined> {
    const dailyFood = this.dailyFoods.get(id);
    if (dailyFood) {
      const updatedFood = { ...dailyFood, multiplier };
      this.dailyFoods.set(id, updatedFood);
      return updatedFood;
    }
    return undefined;
  }

  async deleteDailyFood(id: number): Promise<void> {
    this.dailyFoods.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
