import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/NumberInput";
import MealDetailCard from "@/components/MealDetailCard";
import CostSummary from "@/components/CostSummary";
import AIPredictionBox from "@/components/AIPredictionBox";
import { calculateMultiMealCost, getMealTypeLabel } from "@/lib/calculationUtils";

type MealType = "breakfast" | "lunch" | "dinner" | "nextDayBreakfast";

interface MealData {
  guests: number;
  counters: number;
  items?: number;
}

interface SelectedMeal {
  type: MealType;
  data: MealData;
}

export default function MultiMealEvent() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<"selection" | "details" | "results">("selection");
  
  // Selected meals
  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(["breakfast", "lunch"]);
  const [mainMeal, setMainMeal] = useState<MealType>("lunch");
  const [profitMargin, setProfitMargin] = useState<number>(40);
  
  // Meal details - initialize with default values
  const [mealDetails, setMealDetails] = useState<Record<MealType, MealData>>({
    breakfast: { guests: 50, counters: 2, items: 5 },
    lunch: { guests: 75, counters: 3 },
    dinner: { guests: 50, counters: 2 },
    nextDayBreakfast: { guests: 50, counters: 2, items: 5 },
  });
  
  // Handle meal selection checkboxes
  const handleMealSelection = (mealType: MealType, checked: boolean) => {
    if (checked) {
      setSelectedMeals(prev => [...prev, mealType]);
    } else {
      setSelectedMeals(prev => prev.filter(m => m !== mealType));
      
      // If main meal is deselected, set a new main meal
      if (mealType === mainMeal && selectedMeals.length > 1) {
        const remaining = selectedMeals.filter(m => m !== mealType);
        setMainMeal(remaining[0]);
      }
    }
  };
  
  // Handle meal detail updates
  const updateMealDetail = (meal: MealType, field: keyof MealData, value: number) => {
    setMealDetails(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value
      }
    }));
  };
  
  // Continue to meal details
  const handleContinue = () => {
    if (selectedMeals.length === 0) {
      // Show error toast or alert
      return;
    }
    setCurrentStep("details");
  };
  
  // Calculate final cost
  const handleCalculate = () => {
    setCurrentStep("results");
  };
  
  // Start a new calculation
  const handleNewCalculation = () => {
    setCurrentStep("selection");
  };
  
  // Get meal data for calculation
  const getMealsForCalculation = (): SelectedMeal[] => {
    return selectedMeals.map(type => ({
      type,
      data: mealDetails[type]
    }));
  };
  
  // Calculate the result
  const result = calculateMultiMealCost(
    getMealsForCalculation(), 
    mainMeal, 
    profitMargin
  );
  
  return (
    <div className="px-6 py-4 pb-6">
      <div className="border-b pb-3 mb-6 flex items-center">
        <button 
          onClick={() => setLocation("/")} 
          className="text-2xl text-primary mr-3"
        >
          <i className="ri-arrow-left-line"></i>
        </button>
        <h2 className="font-poppins font-bold text-2xl">Multi Meal Event</h2>
      </div>
      
      {currentStep === "selection" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="font-semibold text-lg block">Select Meals (भोजन चुनें)</Label>
            <div className="space-y-3">
              <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-[hsl(var(--breakfast-bg))]">
                <Checkbox
                  id="breakfast-checkbox"
                  checked={selectedMeals.includes("breakfast")}
                  onCheckedChange={(checked) => handleMealSelection("breakfast", checked as boolean)}
                  className="h-5 w-5 text-[hsl(var(--breakfast-text))]"
                />
                <label htmlFor="breakfast-checkbox" className="ml-3 text-lg text-[hsl(var(--breakfast-text))]">
                  Breakfast (नाश्ता)
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-[hsl(var(--lunch-bg))]">
                <Checkbox
                  id="lunch-checkbox"
                  checked={selectedMeals.includes("lunch")}
                  onCheckedChange={(checked) => handleMealSelection("lunch", checked as boolean)}
                  className="h-5 w-5 text-[hsl(var(--lunch-text))]"
                />
                <label htmlFor="lunch-checkbox" className="ml-3 text-lg text-[hsl(var(--lunch-text))]">
                  Lunch (दोपहर का भोजन)
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-[hsl(var(--dinner-bg))]">
                <Checkbox
                  id="dinner-checkbox"
                  checked={selectedMeals.includes("dinner")}
                  onCheckedChange={(checked) => handleMealSelection("dinner", checked as boolean)}
                  className="h-5 w-5 text-[hsl(var(--dinner-text))]"
                />
                <label htmlFor="dinner-checkbox" className="ml-3 text-lg text-[hsl(var(--dinner-text))]">
                  Dinner (रात्रि भोजन)
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-[hsl(var(--breakfast-bg))]">
                <Checkbox
                  id="nextday-breakfast-checkbox"
                  checked={selectedMeals.includes("nextDayBreakfast")}
                  onCheckedChange={(checked) => handleMealSelection("nextDayBreakfast", checked as boolean)}
                  className="h-5 w-5 text-[hsl(var(--breakfast-text))]"
                />
                <label htmlFor="nextday-breakfast-checkbox" className="ml-3 text-lg text-[hsl(var(--breakfast-text))]">
                  Next Day Breakfast (अगले दिन का नाश्ता)
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="font-semibold text-lg block">Select Main Meal (मुख्य भोजन चुनें)</Label>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="mb-2 text-sm text-gray-500">
                The main meal will be charged at full labor cost. Additional meals will be charged at 70% labor cost.
              </p>
              <Select 
                value={mainMeal} 
                onValueChange={(value: MealType) => setMainMeal(value)}
                disabled={selectedMeals.length === 0}
              >
                <SelectTrigger className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-lg h-auto">
                  <SelectValue placeholder="Select main meal" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMeals.includes("breakfast") && (
                    <SelectItem value="breakfast">Breakfast (नाश्ता)</SelectItem>
                  )}
                  {selectedMeals.includes("lunch") && (
                    <SelectItem value="lunch">Lunch (दोपहर का भोजन)</SelectItem>
                  )}
                  {selectedMeals.includes("dinner") && (
                    <SelectItem value="dinner">Dinner (रात्रि भोजन)</SelectItem>
                  )}
                  {selectedMeals.includes("nextDayBreakfast") && (
                    <SelectItem value="nextDayBreakfast">Next Day Breakfast (अगले दिन का नाश्ता)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="profitMargin" className="font-medium text-gray-700">
                Profit Margin: {profitMargin}%
              </label>
            </div>
            <input
              id="profitMargin"
              type="range"
              min={10}
              max={70}
              step={5}
              value={profitMargin}
              onChange={(e) => setProfitMargin(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>40%</span>
              <span>70%</span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue} 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-lg text-xl h-auto"
            disabled={selectedMeals.length === 0}
          >
            <i className="ri-arrow-right-line mr-2"></i>
            Continue
          </Button>
        </div>
      )}
      
      {currentStep === "details" && (
        <div className="space-y-8">
          {selectedMeals.includes("breakfast") && (
            <MealDetailCard
              title={`Breakfast Details${mainMeal === "breakfast" ? " (Main Meal)" : ""}`}
              type="breakfast"
              data={mealDetails.breakfast}
              onChange={(field, value) => updateMealDetail("breakfast", field, value)}
              isBreakfast={true}
            />
          )}
          
          {selectedMeals.includes("lunch") && (
            <MealDetailCard
              title={`Lunch Details${mainMeal === "lunch" ? " (Main Meal)" : ""}`}
              type="lunch"
              data={mealDetails.lunch}
              onChange={(field, value) => updateMealDetail("lunch", field, value)}
              isBreakfast={false}
            />
          )}
          
          {selectedMeals.includes("dinner") && (
            <MealDetailCard
              title={`Dinner Details${mainMeal === "dinner" ? " (Main Meal)" : ""}`}
              type="dinner"
              data={mealDetails.dinner}
              onChange={(field, value) => updateMealDetail("dinner", field, value)}
              isBreakfast={false}
            />
          )}
          
          {selectedMeals.includes("nextDayBreakfast") && (
            <MealDetailCard
              title={`Next Day Breakfast Details${mainMeal === "nextDayBreakfast" ? " (Main Meal)" : ""}`}
              type="nextDayBreakfast"
              data={mealDetails.nextDayBreakfast}
              onChange={(field, value) => updateMealDetail("nextDayBreakfast", field, value)}
              isBreakfast={true}
            />
          )}
          
          <Button 
            onClick={handleCalculate} 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-lg text-xl h-auto"
          >
            <i className="ri-calculator-line mr-2"></i>
            Calculate Total Cost
          </Button>
        </div>
      )}
      
      {currentStep === "results" && (
        <div>
          <CostSummary
            baseCost={result.baseCost}
            profit={result.profit}
            totalCost={result.totalCost}
            perPersonCost={result.perPersonCost}
            laborCost={result.laborCost}
            materialCost={result.materialCost}
            totalGuests={result.totalGuests}
            profitMargin={profitMargin}
            mealCosts={result.mealCosts}
            miscExpenses={result.miscExpenses}
            grandTotal={result.grandTotal}
            onNewCalculation={handleNewCalculation}
            onProfitMarginChange={(margin) => {
              setProfitMargin(margin);
            }}
          />
          
          <AIPredictionBox 
            costData={{
              mealType: mainMeal,
              guests: result.totalGuests,
              laborCost: result.laborCost,
              materialCost: result.materialCost,
              baseCost: result.baseCost,
              profit: result.profit,
              profitMargin: profitMargin,
              totalCost: result.totalCost,
              perPersonCost: result.perPersonCost,
              mealCosts: result.mealCosts.map(meal => ({
                type: meal.type,
                cost: meal.cost,
                laborCost: meal.laborCost,
                materialCost: meal.materialCost
              }))
            }}
            onApplyChanges={(newCostData) => {
              setProfitMargin(newCostData.profitMargin);
              // Note: In a real scenario, we would need to also adjust the underlying
              // meal costs to match the suggested values, but for now we just update the profit margin
            }}
          />
        </div>
      )}
    </div>
  );
}
