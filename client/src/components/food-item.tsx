import { motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { DailyFood } from "@shared/schema";

interface FoodItemProps {
  food: DailyFood;
  onDelete: (id: number) => void;
}

export function FoodItem({ food, onDelete }: FoodItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const calculateCalories = (protein: string, fat: string, carbs: string) => {
    return (parseFloat(protein) * 4 + parseFloat(fat) * 9 + parseFloat(carbs) * 4).toFixed(0);
  };

  const calories = calculateCalories(food.protein, food.fat, food.carbs);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(food.id);
      }, 300);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 200 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={isDeleting ? { x: 300, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 touch-pan-y cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">{food.name}</h3>
            <span className="text-sm font-semibold text-slate-900">{calories} kcal</span>
          </div>
          <div className="flex space-x-4 mt-1">
            <span className="text-xs text-slate-600">
              <span className="font-medium text-secondary">{food.protein}g</span> protein
            </span>
            <span className="text-xs text-slate-600">
              <span className="font-medium text-accent">{food.fat}g</span> fat
            </span>
            <span className="text-xs text-slate-600">
              <span className="font-medium text-primary">{food.carbs}g</span> carbs
            </span>
          </div>
        </div>
        <div className="ml-4 text-slate-400">
          <GripVertical className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
