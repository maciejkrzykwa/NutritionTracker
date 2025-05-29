import { motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { MultiplierModal } from "./multiplier-modal";
import type { DailyFood } from "@shared/schema";

interface FoodItemProps {
  food: DailyFood;
  onDelete: (id: number) => void;
  onUpdateMultiplier: (id: number, multiplier: string) => void;
}

export function FoodItem({ food, onDelete, onUpdateMultiplier }: FoodItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateCalories = (protein: string, fat: string, carbs: string, multiplier: string = "1.0") => {
    const mult = parseFloat(multiplier);
    return ((parseFloat(protein) * 4 + parseFloat(fat) * 9 + parseFloat(carbs) * 4) * mult).toFixed(0);
  };

  const getMultipliedValue = (value: string, multiplier: string = "1.0") => {
    return (parseFloat(value) * parseFloat(multiplier)).toFixed(1);
  };

  const calories = calculateCalories(food.protein, food.fat, food.carbs, food.multiplier);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(food.id);
      }, 300);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only open modal if not dragging
    if (e.detail === 1) { // Single click
      setIsModalOpen(true);
    }
  };

  const handleUpdateMultiplier = (multiplier: string) => {
    onUpdateMultiplier(food.id, multiplier);
  };

  return (
    <>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={isDeleting ? { x: 300, opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 touch-pan-y cursor-grab active:cursor-grabbing"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500 font-medium">{food.multiplier}x</span>
                <h3 className="font-medium text-slate-900">{food.name}</h3>
              </div>
              <span className="text-sm font-semibold text-slate-900">{calories} kcal</span>
            </div>
            <div className="flex space-x-4 mt-1">
              <span className="text-xs text-slate-600">
                <span className="font-medium text-secondary">{getMultipliedValue(food.protein, food.multiplier)}g</span> protein
              </span>
              <span className="text-xs text-slate-600">
                <span className="font-medium text-accent">{getMultipliedValue(food.fat, food.multiplier)}g</span> fat
              </span>
              <span className="text-xs text-slate-600">
                <span className="font-medium text-primary">{getMultipliedValue(food.carbs, food.multiplier)}g</span> carbs
              </span>
            </div>
          </div>
          <div className="ml-4 text-slate-400">
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      <MultiplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMultiplier={food.multiplier || "1.0"}
        productName={food.name}
        onUpdateMultiplier={handleUpdateMultiplier}
      />
    </>
  );
}
