import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import SingleMealEvent from "@/pages/SingleMealEvent";
import MultiMealEvent from "@/pages/MultiMealEvent";
import NotFound from "@/pages/not-found";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";
import { isInStandaloneMode } from "@/lib/serviceWorkerRegistration";
import { isNativePlatform, isPWA } from "@/lib/capacitorUtils";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/single-meal" component={SingleMealEvent} />
      <Route path="/multi-meal" component={MultiMealEvent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  
  useEffect(() => {
    // Check if running as installed PWA or in native Capacitor container
    const checkInstallStatus = () => {
      const installed = isNativePlatform() || isPWA() || isInStandaloneMode();
      setIsInstalled(installed);
      
      // Enable full screen mode for mobile browsers when installed
      if (installed) {
        document.documentElement.style.height = '100vh';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
      }
    };
    
    checkInstallStatus();
    
    // Add event listener for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallStatus);
    
    return () => {
      mediaQuery.removeEventListener('change', checkInstallStatus);
    };
  }, []);
  
  return (
    <TooltipProvider>
      <Toaster />
      <div 
        className={`max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden 
          ${isInstalled ? 'rounded-none my-0' : 'rounded-none sm:rounded-lg sm:my-4'} card-shadow`}
      >
        <Router />
        {!isInstalled && <InstallPWAPrompt />}
      </div>
    </TooltipProvider>
  );
}

export default App;
