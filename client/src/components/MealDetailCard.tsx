import NumberInput from "./NumberInput";

interface MealData {
  guests: number;
  counters: number;
  items?: number;
}

type MealType = "breakfast" | "lunch" | "dinner" | "nextDayBreakfast";

interface MealDetailCardProps {
  title: string;
  type: MealType;
  data: MealData;
  onChange: (field: keyof MealData, value: number) => void;
  isBreakfast: boolean;
}

export default function MealDetailCard({
  title,
  type,
  data,
  onChange,
  isBreakfast
}: MealDetailCardProps) {
  // Determine meal card type class
  let mealCardClass = "meal-card-breakfast";
  let iconClass = "ri-sun-line";
  
  if (type === "lunch") {
    mealCardClass = "meal-card-lunch";
    iconClass = "ri-restaurant-line";
  } else if (type === "dinner") {
    mealCardClass = "meal-card-dinner";
    iconClass = "ri-moon-line";
  } else if (type === "nextDayBreakfast") {
    mealCardClass = "meal-card-breakfast";
    iconClass = "ri-sun-line";
  }
  
  return (
    <div className={`meal-card ${mealCardClass}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40">
          <i className={`${iconClass} text-xl`}></i>
        </div>
        <h3 className="font-poppins font-semibold text-xl">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <NumberInput
          id={`${type}-guests`}
          label="Number of Guests"
          value={data.guests}
          onChange={(value) => onChange("guests", value)}
          min={1}
        />
        
        <NumberInput
          id={`${type}-counters`}
          label="Number of Counters"
          value={data.counters}
          onChange={(value) => onChange("counters", value)}
          min={1}
        />
        
        {isBreakfast && (
          <NumberInput
            id={`${type}-items`}
            label="Number of Breakfast Items"
            value={data.items || 5}
            onChange={(value) => onChange("items", value)}
            min={1}
          />
        )}
      </div>
    </div>
  );
}
