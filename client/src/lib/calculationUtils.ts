export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'nextDayBreakfast';

interface MealData {
  guests: number;
  counters: number;
  items?: number;
}

interface SelectedMeal {
  type: MealType;
  data: MealData;
}

interface CostResult {
  baseCost: number;
  profit: number;
  totalCost: number;
  perPersonCost: number;
  laborCost: number;
  materialCost: number;
  miscExpenses: number; // Added for miscellaneous expenses
  grandTotal: number; // Total cost with miscellaneous expenses
}

interface MultiMealResult extends CostResult {
  mealCosts: Array<{
    type: MealType;
    cost: number;
    isMain: boolean;
    laborCost: number;
    materialCost: number;
  }>;
  totalGuests: number;
}

// Split cost calculation into labor and material components
function calculateDetailedMealCost(
  mealType: MealType,
  data: MealData
): { laborCost: number; materialCost: number } {
  const { guests, counters, items = 5 } = data;
  
  // New labor cost calculation: guest count * 100 INR
  const laborCost = guests * 100;
  let materialCost = 0;
  
  if (mealType === 'breakfast' || mealType === 'nextDayBreakfast') {
    // Material cost for breakfast
    materialCost = guests * 70;
    
    // Add ₹50 per additional breakfast item above 5 items
    if (items > 5) {
      materialCost += guests * (items - 5) * 10;
    }
  } else if (mealType === 'lunch') {
    // Material cost for lunch
    materialCost = guests * 250;
  } else if (mealType === 'dinner') {
    // Material cost for dinner (slightly higher than lunch)
    materialCost = guests * 300;
  }
  
  return { laborCost, materialCost };
}

// Calculate cost for a single meal event
export function calculateSingleMealCost(
  mealType: MealType,
  guests: number,
  counters: number,
  breakfastItems: number = 5,
  profitMarginPercent: number = 40
): CostResult {
  const { laborCost, materialCost } = calculateDetailedMealCost(
    mealType, 
    { 
      guests, 
      counters, 
      items: mealType === 'breakfast' ? breakfastItems : undefined 
    }
  );
  
  const baseCost = laborCost + materialCost;
  const profitMargin = profitMarginPercent / 100;
  const profit = baseCost * profitMargin;
  const totalCost = baseCost + profit;
  const perPersonCost = guests > 0 ? totalCost / guests : 0;
  
  // Calculate miscellaneous expenses (10% of total cost)
  const miscExpenses = totalCost * 0.1;
  const grandTotal = totalCost + miscExpenses;
  
  return {
    baseCost: Math.round(baseCost),
    profit: Math.round(profit),
    totalCost: Math.round(totalCost),
    perPersonCost: Math.round(perPersonCost),
    laborCost: Math.round(laborCost),
    materialCost: Math.round(materialCost),
    miscExpenses: Math.round(miscExpenses),
    grandTotal: Math.round(grandTotal)
  };
}

// Calculate cost for a multi-meal event
export function calculateMultiMealCost(
  selectedMeals: SelectedMeal[],
  mainMealType: MealType,
  profitMarginPercent: number = 40
): MultiMealResult {
  let totalBaseCost = 0;
  let totalLaborCost = 0;
  let totalMaterialCost = 0;
  
  const mealCosts: Array<{
    type: MealType; 
    cost: number; 
    isMain: boolean;
    laborCost: number;
    materialCost: number;
  }> = [];
  
  // Find the maximum number of guests across all meals
  const maxGuests = Math.max(...selectedMeals.map(meal => meal.data.guests));
  
  // First calculate the cost for the main meal
  const mainMeal = selectedMeals.find(meal => meal.type === mainMealType);
  
  if (mainMeal) {
    const { laborCost, materialCost } = calculateDetailedMealCost(mainMeal.type, mainMeal.data);
    const mainMealCost = laborCost + materialCost;
    
    totalLaborCost += laborCost;
    totalMaterialCost += materialCost;
    totalBaseCost += mainMealCost;
    
    mealCosts.push({
      type: mainMeal.type,
      cost: Math.round(mainMealCost),
      isMain: true,
      laborCost: Math.round(laborCost),
      materialCost: Math.round(materialCost)
    });
  }
  
  // Then calculate for other meals
  const otherMeals = selectedMeals.filter(meal => meal.type !== mainMealType);
  const isNextDayMeal = (mealType: MealType) => mealType === 'nextDayBreakfast';
  
  otherMeals.forEach(meal => {
    const { laborCost: fullLaborCost, materialCost } = calculateDetailedMealCost(meal.type, meal.data);
    
    let finalLaborCost = fullLaborCost;
    
    if (!isNextDayMeal(meal.type)) {
      // Apply 70% labor cost for additional meals on the same day
      finalLaborCost = fullLaborCost * 0.7;
    }
    
    const mealCost = finalLaborCost + materialCost;
    
    totalLaborCost += finalLaborCost;
    totalMaterialCost += materialCost;
    totalBaseCost += mealCost;
    
    mealCosts.push({
      type: meal.type,
      cost: Math.round(mealCost),
      isMain: false,
      laborCost: Math.round(finalLaborCost),
      materialCost: Math.round(materialCost)
    });
  });
  
  // Apply profit margin
  const profitMargin = profitMarginPercent / 100;
  const profit = totalBaseCost * profitMargin;
  const totalCost = totalBaseCost + profit;
  const perPersonCost = maxGuests > 0 ? totalCost / maxGuests : 0;
  
  // Calculate miscellaneous expenses (10% of total cost)
  const miscExpenses = totalCost * 0.1;
  const grandTotal = totalCost + miscExpenses;
  
  return {
    baseCost: Math.round(totalBaseCost),
    profit: Math.round(profit),
    totalCost: Math.round(totalCost),
    perPersonCost: Math.round(perPersonCost),
    mealCosts,
    totalGuests: maxGuests,
    laborCost: Math.round(totalLaborCost),
    materialCost: Math.round(totalMaterialCost),
    miscExpenses: Math.round(miscExpenses),
    grandTotal: Math.round(grandTotal)
  };
}

// Get the label for a meal type
export function getMealTypeLabel(type: MealType): string {
  switch (type) {
    case 'breakfast':
      return 'Breakfast';
    case 'lunch':
      return 'Lunch';
    case 'dinner':
      return 'Dinner';
    case 'nextDayBreakfast':
      return 'Next Day Breakfast';
    default:
      return type;
  }
}
