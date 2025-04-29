import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="px-6 py-8 pb-6">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-3">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <i className="ri-restaurant-2-fill text-white text-3xl"></i>
          </div>
        </div>
        <h1 className="font-poppins font-bold text-4xl text-primary mb-2 drop-shadow-sm">Catering Cost Calculator</h1>
        <p className="text-slate-500 text-lg">केटरिंग लागत कैलकुलेटर</p>
      </div>
      
      <div className="space-y-6 max-w-sm mx-auto">
        <Button 
          onClick={() => setLocation("/single-meal")}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 px-4 rounded-xl text-xl h-auto transition-all duration-300 hover:translate-y-[-2px] button-shadow"
        >
          <i className="ri-restaurant-line mr-3 text-2xl"></i>
          <span>Single Meal Event</span>
        </Button>
        
        <Button 
          onClick={() => setLocation("/multi-meal")}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-5 px-4 rounded-xl text-xl h-auto transition-all duration-300 hover:translate-y-[-2px] button-shadow"
        >
          <i className="ri-calendar-event-line mr-3 text-2xl"></i>
          <span>Multi Meal Event</span>
        </Button>
        
        <div className="bg-accent/80 p-4 rounded-xl mt-8 text-center">
          <p className="text-accent-foreground text-sm">
            Calculate prices for catering events like weddings, parties, and corporate functions
          </p>
        </div>
      </div>
    </div>
  );
}
