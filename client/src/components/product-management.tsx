import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertProduct } from "@shared/schema";

export function ProductManagement() {
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      protein: "0",
      fat: "0",
      carbs: "0",
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      return apiRequest("POST", "/api/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      toast({
        title: "Product added",
        description: "The product has been added to your database.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been removed from your database.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    addProductMutation.mutate(data);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  return (
    <div className="p-4">
      {/* Add Product Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g., 100g Banana"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  {...form.register("protein")}
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  {...form.register("fat")}
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  {...form.register("carbs")}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={addProductMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addProductMutation.isPending ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Product List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Product Database</h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-lg h-20 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No products in database</p>
            <p className="text-sm">Add your first product above</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{product.name}</h4>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-xs text-slate-600">
                      <span className="font-medium text-secondary">{product.protein}g</span> protein
                    </span>
                    <span className="text-xs text-slate-600">
                      <span className="font-medium text-accent">{product.fat}g</span> fat
                    </span>
                    <span className="text-xs text-slate-600">
                      <span className="font-medium text-primary">{product.carbs}g</span> carbs
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={deleteProductMutation.isPending}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
