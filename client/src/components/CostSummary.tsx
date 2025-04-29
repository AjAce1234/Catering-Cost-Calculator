import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MealCostItem {
  type: string;
  cost: number;
  isMain: boolean;
  laborCost: number;
  materialCost: number;
}

interface CostSummaryProps {
  baseCost: number;
  profit: number;
  totalCost: number;
  perPersonCost?: number;
  laborCost?: number;
  materialCost?: number;
  totalGuests?: number;
  profitMargin?: number;
  mealCosts?: MealCostItem[];
  miscExpenses?: number; // Added for miscellaneous expenses
  grandTotal?: number; // Added for total with misc expenses
  onNewCalculation: () => void;
  onProfitMarginChange?: (margin: number) => void;
}

export default function CostSummary({ 
  baseCost, 
  profit, 
  totalCost,
  perPersonCost = 0,
  laborCost,
  materialCost,
  totalGuests = 0,
  profitMargin = 40,
  mealCosts = [],
  miscExpenses = 0,
  grandTotal = 0,
  onNewCalculation,
  onProfitMarginChange
}: CostSummaryProps) {
  const [editingProfit, setEditingProfit] = useState(false);
  const [localProfitMargin, setLocalProfitMargin] = useState(profitMargin);

  const handleProfitMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setLocalProfitMargin(value);
    }
  };

  const handleProfitMarginSave = () => {
    setEditingProfit(false);
    if (onProfitMarginChange) {
      onProfitMarginChange(localProfitMargin);
    }
  };

  // Calculate base costing as Labor Cost + Material Cost
  const baseCosting = laborCost !== undefined && materialCost !== undefined 
    ? laborCost + materialCost 
    : baseCost;

  // Calculate total costing range as Base Costing + Miscellaneous Expenses
  const totalCostingRange = baseCosting + miscExpenses;

  return (
    <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 card-shadow">
      {/* 1. Cost Estimate Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <i className="ri-money-rupee-circle-line text-xl"></i>
          </div>
          <h3 className="font-poppins font-bold text-xl">Cost Estimate</h3>
        </div>

        {totalGuests > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Per Person</div>
            <div className="font-bold text-lg text-primary">₹{perPersonCost.toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {mealCosts.length > 0 && (
          <div className="mb-2">
            <div className="font-medium text-gray-600 mb-2 flex items-center gap-2">
              <i className="ri-list-check-2"></i>
              <span>Individual Meal Costs</span>
            </div>
            <div className="pl-2 space-y-2">
              {mealCosts.map((meal, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    {meal.type.includes("breakfast") ? (
                      <i className="ri-sun-line text-[hsl(var(--breakfast-text))]"></i>
                    ) : meal.type.includes("lunch") ? (
                      <i className="ri-restaurant-line text-[hsl(var(--lunch-text))]"></i>
                    ) : (
                      <i className="ri-moon-line text-[hsl(var(--dinner-text))]"></i>
                    )}
                    <span className="text-gray-600">
                      {meal.type.charAt(0).toUpperCase() + meal.type.slice(1).replace(/([A-Z])/g, ' $1')}
                      {meal.isMain && <span className="text-xs ml-1">(Main)</span>}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{meal.cost.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      L: ₹{meal.laborCost.toLocaleString()} | M: ₹{meal.materialCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === EXACT ORDER AS SPECIFIED === */}

        {/* 1. Labor Cost */}
        {laborCost !== undefined && materialCost !== undefined && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Labor Cost</span>
                    <i className="ri-information-line text-gray-400 text-sm"></i>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64 text-sm">
                    Cost of staff, counters, and service personnel
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-semibold text-lg">₹{laborCost.toLocaleString()}</span>
          </div>
        )}

        {/* 2. Material Cost */}
        {laborCost !== undefined && materialCost !== undefined && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Material Cost</span>
                    <i className="ri-information-line text-gray-400 text-sm"></i>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64 text-sm">
                    Cost of ingredients, food items, and kitchen materials
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-semibold text-lg">₹{materialCost.toLocaleString()}</span>
          </div>
        )}

        {/* 3. Base Costing (Labor + Material) */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Base Costing</span>
                  <i className="ri-information-line text-gray-400 text-sm"></i>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64 text-sm">
                  Base cost = Labor Cost + Material Cost
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="font-semibold text-lg">₹{baseCosting.toLocaleString()}</span>
        </div>

        {/* 4. Miscellaneous Expenses */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Miscellaneous Expenses</span>
                  <i className="ri-information-line text-gray-400 text-sm"></i>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64 text-sm">
                  10% of total cost for unexpected expenses, transportation, etc.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-right">
            <div className="font-semibold text-lg">₹{miscExpenses.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              (10% of total)
            </div>
          </div>
        </div>

        {/* 5. Total Costing Range (Base + Misc) */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total Costing Range</span>
                  <i className="ri-information-line text-gray-400 text-sm"></i>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64 text-sm">
                  Total Costing = Base Costing + Miscellaneous Expenses (with 10% flexibility)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-right">
            <div className="font-semibold text-lg flex items-center gap-1">
              <span>₹{totalCostingRange.toLocaleString()}</span>
              <span className="text-gray-400 px-1">-</span>
              <span>₹{Math.round(totalCostingRange * 1.1).toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500">
              10% flexibility margin
            </div>
          </div>
        </div>

        {/* 6. Profit */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          {editingProfit ? (
            <div className="flex items-center gap-2 w-full">
              <label className="text-gray-600">Profit Margin</label>
              <div className="flex-1 flex items-center">
                <input
                  type="number"
                  className="w-16 p-1 border border-gray-300 rounded text-center"
                  value={localProfitMargin}
                  onChange={handleProfitMarginChange}
                  min={0}
                  max={100}
                />
                <span className="ml-1 text-gray-600">%</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 h-8"
                  onClick={handleProfitMarginSave}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onProfitMarginChange && setEditingProfit(true)}
              >
                <span className="text-gray-600">
                  Profit ({onProfitMarginChange ? `${localProfitMargin}%` : `${profitMargin}%`})
                </span>
                {onProfitMarginChange && (
                  <i className="ri-edit-line text-gray-400 text-sm"></i>
                )}
              </div>
              <span className="font-semibold text-lg text-green-600">₹{profit.toLocaleString()}</span>
            </>
          )}
        </div>

        {/* 7. Grand Total */}
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg mt-2">
          <span className="font-bold text-lg">Grand Total</span>
          <div className="text-right">
            <div className="font-bold text-xl text-primary flex items-center gap-1">
              <span>₹{grandTotal.toLocaleString()}</span>
              <span className="text-primary/70 px-1">-</span>
              <span>₹{Math.round(grandTotal * 1.05).toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500">
              Final price with 5% flexibility
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onNewCalculation}
        className="mt-6 w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-lg h-auto button-shadow hover:translate-y-[-2px] transition-all duration-200"
      >
        <i className="ri-refresh-line mr-2"></i>
        New Calculation
      </Button>
    </div>
  );
}