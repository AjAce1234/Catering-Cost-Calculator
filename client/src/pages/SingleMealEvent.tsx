import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import MealTypeSelector from "@/components/MealTypeSelector";
import NumberInput from "@/components/NumberInput";
import CostSummary from "@/components/CostSummary";
import AIPredictionBox from "@/components/AIPredictionBox";
import { calculateSingleMealCost } from "@/lib/calculationUtils";

type MealType = "breakfast" | "lunch" | "dinner";

export default function SingleMealEvent() {
  const [, setLocation] = useLocation();
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [guests, setGuests] = useState<number>(50);
  const [counters, setCounters] = useState<number>(2);
  const [breakfastItems, setBreakfastItems] = useState<number>(5);
  const [profitMargin, setProfitMargin] = useState<number>(40);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [costData, setCostData] = useState<ReturnType<typeof calculateSingleMealCost> | null>(null);
  
  const handleCalculate = () => {
    const newCostData = calculateSingleMealCost(
      mealType, 
      guests, 
      counters, 
      breakfastItems,
      profitMargin
    );
    setCostData(newCostData);
    setShowResults(true);
  };
  
  const handleNewCalculation = () => {
    setShowResults(false);
  };
  
  const handleApplyAIChanges = (newData: any) => {
    setCostData({
      ...newData,
      profitMargin: newData.profitMargin
    });
    setProfitMargin(newData.profitMargin);
  };
  
  // Calculate only if not already stored in state
  const {
    baseCost,
    profit,
    totalCost,
    perPersonCost,
    laborCost,
    materialCost,
    miscExpenses,
    grandTotal
  } = costData || calculateSingleMealCost(
    mealType, 
    guests, 
    counters, 
    breakfastItems,
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
        <h2 className="font-poppins font-bold text-2xl">Single Meal Event</h2>
      </div>
      
      {!showResults ? (
        <div className="space-y-6">
          <MealTypeSelector
            selectedType={mealType}
            onChange={(type) => setMealType(type as MealType)}
          />
          
          <NumberInput
            id="singleGuests"
            label="Number of Guests (कितने गेस्ट्स हैं?)"
            value={guests}
            onChange={setGuests}
            min={1}
          />
          
          <NumberInput
            id="singleCounters"
            label="Number of Counters (काउंटर्स की संख्या)"
            value={counters}
            onChange={setCounters}
            min={1}
          />
          
          {mealType === "breakfast" && (
            <NumberInput
              id="breakfastItems"
              label="Number of Breakfast Items (नाश्ते की वस्तुओं की संख्या)"
              value={breakfastItems}
              onChange={setBreakfastItems}
              min={1}
            />
          )}
          
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
            onClick={handleCalculate} 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-lg text-xl h-auto mt-4"
          >
            <i className="ri-calculator-line mr-2"></i>
            Calculate Cost
          </Button>
        </div>
      ) : (
        <>
          <CostSummary
            baseCost={baseCost}
            profit={profit}
            totalCost={totalCost}
            perPersonCost={perPersonCost}
            laborCost={laborCost}
            materialCost={materialCost}
            totalGuests={guests}
            profitMargin={profitMargin}
            miscExpenses={miscExpenses}
            grandTotal={grandTotal}
            onNewCalculation={handleNewCalculation}
            onProfitMarginChange={(margin) => {
              setProfitMargin(margin);
            }}
          />
          
          <AIPredictionBox 
            costData={{
              mealType: mealType,
              guests: guests,
              laborCost: laborCost,
              materialCost: materialCost,
              baseCost: baseCost,
              profit: profit,
              profitMargin: profitMargin,
              totalCost: totalCost,
              perPersonCost: perPersonCost
            }}
            onApplyChanges={handleApplyAIChanges}
          />
        </>
      )}
    </div>
  );
}
