// Define interfaces for cost data and adjustment suggestions
export interface CostData {
  mealType: string;
  guests: number;
  laborCost: number;
  materialCost: number;
  baseCost: number;
  profit: number;
  profitMargin: number;
  totalCost: number;
  perPersonCost: number;
  mealCosts?: Array<{
    type: string;
    cost: number;
    laborCost: number;
    materialCost: number;
  }>;
}

export interface AdjustmentSuggestion {
  isReasonable: boolean;
  suggestedAdjustments: {
    laborCostMultiplier?: number;
    materialCostMultiplier?: number;
    profitMargin?: number;
  };
  explanation: string;
}

/**
 * Mock AI implementation that analyzes catering costs and suggests adjustments
 * based on industry standards.
 */
export async function analyzeCateringCost(costData: CostData): Promise<AdjustmentSuggestion> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple logic to determine if costs are reasonable
  const { laborCost, materialCost, mealType, profitMargin, guests } = costData;
  
  // Calculate per guest costs
  const perGuestLabor = guests > 0 ? laborCost / guests : 0;
  const perGuestMaterial = guests > 0 ? materialCost / guests : 0;
  
  // Determine if labor cost is within range
  const isLaborReasonable = perGuestLabor >= 80 && perGuestLabor <= 120;
  
  // Determine if material cost is within range
  let isMaterialReasonable = false;
  if (mealType.includes('breakfast')) {
    isMaterialReasonable = perGuestMaterial >= 60 && perGuestMaterial <= 90;
  } else if (mealType.includes('lunch')) {
    isMaterialReasonable = perGuestMaterial >= 200 && perGuestMaterial <= 300;
  } else if (mealType.includes('dinner')) {
    isMaterialReasonable = perGuestMaterial >= 250 && perGuestMaterial <= 400;
  }
  
  // Determine if profit margin is reasonable
  const isProfitReasonable = profitMargin >= 30 && profitMargin <= 50;
  
  // Create adjustments
  const suggestedAdjustments: AdjustmentSuggestion["suggestedAdjustments"] = {};
  
  if (!isLaborReasonable) {
    if (perGuestLabor < 80) {
      suggestedAdjustments.laborCostMultiplier = 80 / perGuestLabor;
    } else if (perGuestLabor > 120) {
      suggestedAdjustments.laborCostMultiplier = 120 / perGuestLabor;
    }
  }
  
  if (!isMaterialReasonable) {
    if (mealType.includes('breakfast') && perGuestMaterial < 60) {
      suggestedAdjustments.materialCostMultiplier = 60 / perGuestMaterial;
    } else if (mealType.includes('breakfast') && perGuestMaterial > 90) {
      suggestedAdjustments.materialCostMultiplier = 90 / perGuestMaterial;
    } else if (mealType.includes('lunch') && perGuestMaterial < 200) {
      suggestedAdjustments.materialCostMultiplier = 200 / perGuestMaterial;
    } else if (mealType.includes('lunch') && perGuestMaterial > 300) {
      suggestedAdjustments.materialCostMultiplier = 300 / perGuestMaterial;
    } else if (mealType.includes('dinner') && perGuestMaterial < 250) {
      suggestedAdjustments.materialCostMultiplier = 250 / perGuestMaterial;
    } else if (mealType.includes('dinner') && perGuestMaterial > 400) {
      suggestedAdjustments.materialCostMultiplier = 400 / perGuestMaterial;
    }
  }
  
  if (!isProfitReasonable) {
    suggestedAdjustments.profitMargin = profitMargin < 30 ? 30 : (profitMargin > 50 ? 50 : profitMargin);
  }
  
  // Overall assessment
  const isReasonable = isLaborReasonable && isMaterialReasonable && isProfitReasonable;
  
  let explanation = "";
  if (isReasonable) {
    explanation = "Your calculation is within industry standards for catering costs.";
  } else {
    explanation = "We've identified some areas that could be adjusted to better align with industry standards:";
    
    if (!isLaborReasonable) {
      explanation += perGuestLabor < 80 
        ? " Labor costs seem too low for quality service."
        : " Labor costs seem higher than typical market rates.";
    }
    
    if (!isMaterialReasonable) {
      explanation += perGuestMaterial < 200 
        ? " Material costs may be too low for quality ingredients."
        : " Material costs are on the higher side compared to market rates.";
    }
    
    if (!isProfitReasonable) {
      explanation += profitMargin < 30 
        ? " Your profit margin is lower than industry average, which might not be sustainable."
        : " Your profit margin is quite high, which might price you out of competitive bids.";
    }
  }
  
  return {
    isReasonable,
    suggestedAdjustments,
    explanation
  };
}

/**
 * Applies suggested adjustments to original cost data and recalculates all values
 */
export function applyAdjustments(
  originalCostData: CostData, 
  adjustments: AdjustmentSuggestion['suggestedAdjustments']
): CostData {
  // Create a deep copy of the original data
  const newData = JSON.parse(JSON.stringify(originalCostData)) as CostData;
  
  // Apply labor cost adjustment if provided
  if (adjustments.laborCostMultiplier && adjustments.laborCostMultiplier !== 1) {
    const laborMultiplier = adjustments.laborCostMultiplier || 1;
    newData.laborCost = Math.round(newData.laborCost * laborMultiplier);
    
    // Also adjust labor cost in mealCosts if it exists
    if (newData.mealCosts) {
      newData.mealCosts = newData.mealCosts.map(meal => ({
        ...meal,
        laborCost: Math.round(meal.laborCost * laborMultiplier),
        cost: Math.round(meal.cost - meal.laborCost + (meal.laborCost * laborMultiplier))
      }));
    }
  }
  
  // Apply material cost adjustment if provided
  if (adjustments.materialCostMultiplier && adjustments.materialCostMultiplier !== 1) {
    const materialMultiplier = adjustments.materialCostMultiplier || 1;
    newData.materialCost = Math.round(newData.materialCost * materialMultiplier);
    
    // Also adjust material cost in mealCosts if it exists
    if (newData.mealCosts) {
      newData.mealCosts = newData.mealCosts.map(meal => ({
        ...meal,
        materialCost: Math.round(meal.materialCost * materialMultiplier),
        cost: Math.round(meal.cost - meal.materialCost + (meal.materialCost * materialMultiplier))
      }));
    }
  }
  
  // Apply profit margin adjustment if provided
  if (adjustments.profitMargin && adjustments.profitMargin !== newData.profitMargin) {
    newData.profitMargin = adjustments.profitMargin;
  }
  
  // Recalculate base cost
  newData.baseCost = newData.laborCost + newData.materialCost;
  
  // Recalculate profit
  newData.profit = Math.round(newData.baseCost * (newData.profitMargin / 100));
  
  // Recalculate total cost
  newData.totalCost = newData.baseCost + newData.profit;
  
  // Recalculate per person cost
  if (newData.guests > 0) {
    newData.perPersonCost = Math.round(newData.totalCost / newData.guests);
  }
  
  return newData;
}