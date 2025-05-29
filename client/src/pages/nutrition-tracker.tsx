import { useState } from "react";
import { DailyTracking } from "@/components/daily-tracking";
import { ProductManagement } from "@/components/product-management";
import { NutritionTotals } from "@/components/nutrition-totals";
import { DatePicker } from "@/components/date-picker";
import { Utensils, Database } from "lucide-react";

export default function NutritionTracker() {
  const [activeTab, setActiveTab] = useState<"daily" | "products">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-lg relative">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">NutriTrack</h1>
          <DatePicker 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
              activeTab === "daily"
                ? "text-primary border-primary bg-blue-50"
                : "text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Utensils className="inline mr-2 h-4 w-4" />
            Daily Tracking
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
              activeTab === "products"
                ? "text-primary border-primary bg-blue-50"
                : "text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Database className="inline mr-2 h-4 w-4" />
            Products
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="pb-24">
        {activeTab === "daily" ? (
          <DailyTracking currentDate={getDateString(selectedDate)} />
        ) : (
          <ProductManagement />
        )}
      </div>

      {/* Fixed Nutrition Totals */}
      {activeTab === "daily" && <NutritionTotals currentDate={getDateString(selectedDate)} />}
    </div>
  );
}
