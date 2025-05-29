import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FoodItem } from "./food-item";
import { ProductSelectionModal } from "./product-selection-modal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DailyFood, Product } from "@shared/schema";

interface DailyTrackingProps {
  currentDate: string;
}

export function DailyTracking({ currentDate }: DailyTrackingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dailyFoods = [], isLoading } = useQuery<DailyFood[]>({
    queryKey: ["/api/daily-foods", { date: currentDate }],
    queryFn: async () => {
      const response = await fetch(`/api/daily-foods?date=${currentDate}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch daily foods");
      return response.json();
    },
  });

  const addDailyFoodMutation = useMutation({
    mutationFn: async (product: Product) => {
      const dailyFood = {
        productId: product.id,
        date: currentDate,
        name: product.name,
        protein: product.protein,
        fat: product.fat,
        carbs: product.carbs,
      };
      return apiRequest("POST", "/api/daily-foods", dailyFood);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-foods", { date: currentDate }] });
      setIsModalOpen(false);
    },
  });

  const deleteDailyFoodMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/daily-foods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-foods", { date: currentDate }] });
    },
  });

  const updateMultiplierMutation = useMutation({
    mutationFn: async ({ id, multiplier }: { id: number; multiplier: string }) => {
      return apiRequest("PATCH", `/api/daily-foods/${id}/multiplier`, { multiplier });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-foods", { date: currentDate }] });
    },
  });

  const handleAddProduct = (product: Product) => {
    addDailyFoodMutation.mutate(product);
  };

  const handleDeleteFood = (id: number) => {
    deleteDailyFoodMutation.mutate(id);
  };

  const handleUpdateMultiplier = (id: number, multiplier: string) => {
    updateMultiplierMutation.mutate({ id, multiplier });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 rounded-lg h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="space-y-3 mb-4">
          {dailyFoods.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No foods added today</p>
              <p className="text-sm">Tap the + button to add your first meal</p>
            </div>
          ) : (
            dailyFoods.map((food) => (
              <FoodItem
                key={food.id}
                food={food}
                onDelete={handleDeleteFood}
                onUpdateMultiplier={handleUpdateMultiplier}
              />
            ))
          )}
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={handleAddProduct}
      />
    </>
  );
}
