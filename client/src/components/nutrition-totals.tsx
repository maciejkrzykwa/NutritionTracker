import { useQuery } from "@tanstack/react-query";
import type { DailyFood } from "@shared/schema";

interface NutritionTotalsProps {
  currentDate: string;
}

export function NutritionTotals({ currentDate }: NutritionTotalsProps) {
  const { data: dailyFoods = [] } = useQuery<DailyFood[]>({
    queryKey: ["/api/daily-foods", { date: currentDate }],
    queryFn: async () => {
      const response = await fetch(`/api/daily-foods?date=${currentDate}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch daily foods");
      return response.json();
    },
  });

  const totals = dailyFoods.reduce(
    (acc, food) => {
      const multiplier = parseFloat(food.multiplier || "1.0");
      const protein = parseFloat(food.protein) * multiplier;
      const fat = parseFloat(food.fat) * multiplier;
      const carbs = parseFloat(food.carbs) * multiplier;
      const calories = protein * 4 + fat * 9 + carbs * 4;
      
      return {
        protein: acc.protein + protein,
        fat: acc.fat + fat,
        carbs: acc.carbs + carbs,
        calories: acc.calories + calories,
      };
    },
    { protein: 0, fat: 0, carbs: 0, calories: 0 }
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto px-6 py-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">Daily Totals</h3>
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary">
              {totals.protein.toFixed(1)}g
            </div>
            <div className="text-xs text-slate-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-accent">
              {totals.fat.toFixed(1)}g
            </div>
            <div className="text-xs text-slate-600">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {totals.carbs.toFixed(1)}g
            </div>
            <div className="text-xs text-slate-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">
              {totals.calories.toFixed(0)}
            </div>
            <div className="text-xs text-slate-600">kcal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
