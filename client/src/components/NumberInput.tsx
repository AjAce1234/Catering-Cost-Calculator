import { Label } from "@/components/ui/label";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function NumberInput({ 
  id, 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 10000 
}: NumberInputProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };
  
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-semibold text-lg block">{label}</Label>
      <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-primary shadow-sm hover:shadow transition-all duration-200">
        <button 
          type="button" 
          className="flex-none px-4 bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <i className="ri-subtract-line"></i>
        </button>
        <input 
          type="number" 
          id={id} 
          className="flex-1 py-3 px-4 text-center text-xl font-medium focus:outline-none bg-white"
          min={min} 
          max={max}
          value={value}
          onChange={handleChange}
        />
        <button 
          type="button" 
          className="flex-none px-4 bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <i className="ri-add-line"></i>
        </button>
      </div>
    </div>
  );
}
