import { Label } from "@/components/ui/label";

type MealType = "breakfast" | "lunch" | "dinner";

interface MealTypeSelectorProps {
  selectedType: MealType;
  onChange: (type: MealType) => void;
}

export default function MealTypeSelector({ selectedType, onChange }: MealTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="font-semibold text-lg block">Meal Type (भोजन का प्रकार)</Label>
      <div className="grid grid-cols-3 gap-3">
        <label className="relative">
          <input 
            type="radio" 
            name="mealType" 
            value="breakfast" 
            className="peer absolute opacity-0 w-full h-full cursor-pointer"
            checked={selectedType === "breakfast"}
            onChange={() => onChange("breakfast")}
          />
          <div className={`border-2 ${selectedType === "breakfast" ? 'border-4 shadow-lg scale-105' : ''} border-[hsl(var(--breakfast-border))] bg-[hsl(var(--breakfast-bg))] rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:bg-yellow-100 h-full flex flex-col items-center justify-center hover-scale`}>
            <i className="ri-sun-line text-2xl text-[hsl(var(--breakfast-text))]"></i>
            <span className="font-medium text-[hsl(var(--breakfast-text))]">Breakfast</span>
          </div>
        </label>
        
        <label className="relative">
          <input 
            type="radio" 
            name="mealType" 
            value="lunch" 
            className="peer absolute opacity-0 w-full h-full cursor-pointer"
            checked={selectedType === "lunch"}
            onChange={() => onChange("lunch")}
          />
          <div className={`border-2 ${selectedType === "lunch" ? 'border-4 shadow-lg scale-105' : ''} border-[hsl(var(--lunch-border))] bg-[hsl(var(--lunch-bg))] rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:bg-orange-100 h-full flex flex-col items-center justify-center hover-scale`}>
            <i className="ri-restaurant-line text-2xl text-[hsl(var(--lunch-text))]"></i>
            <span className="font-medium text-[hsl(var(--lunch-text))]">Lunch</span>
          </div>
        </label>
        
        <label className="relative">
          <input 
            type="radio" 
            name="mealType" 
            value="dinner" 
            className="peer absolute opacity-0 w-full h-full cursor-pointer"
            checked={selectedType === "dinner"}
            onChange={() => onChange("dinner")}
          />
          <div className={`border-2 ${selectedType === "dinner" ? 'border-4 shadow-lg scale-105' : ''} border-[hsl(var(--dinner-border))] bg-[hsl(var(--dinner-bg))] rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:bg-purple-100 h-full flex flex-col items-center justify-center hover-scale`}>
            <i className="ri-moon-line text-2xl text-[hsl(var(--dinner-text))]"></i>
            <span className="font-medium text-[hsl(var(--dinner-text))]">Dinner</span>
          </div>
        </label>
      </div>
    </div>
  );
}
