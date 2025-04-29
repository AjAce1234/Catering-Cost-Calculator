import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isInStandaloneMode } from '@/lib/serviceWorkerRegistration';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

export default function InstallPWAPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installButtonVisible, setInstallButtonVisible] = useState(false);
  
  useEffect(() => {
    // Check if it's iOS (for custom instructions)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsIOS(isIOSDevice && isSafari);
    
    // Only show install options if not already installed
    if (!isInStandaloneMode()) {
      // Chrome, Edge, etc. with native install prompt
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setInstallPrompt(e);
        setInstallButtonVisible(true);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // For iOS, just show the install button directly
      if (isIOSDevice && isSafari) {
        setInstallButtonVisible(true);
      }
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);
  
  const handleInstallClick = () => {
    if (isIOS) {
      // For iOS, show instructions dialog
      setShowDialog(true);
    } else if (installPrompt) {
      // For other browsers, trigger native prompt
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setInstallButtonVisible(false);
        }
        setInstallPrompt(null);
      });
    }
  };
  
  if (!installButtonVisible) return null;
  
  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-start mb-2">
            <div className="flex-shrink-0 mt-0.5">
              <i className="ri-download-line text-primary text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-800">Install App</h3>
              <p className="text-sm text-gray-600 mt-1">
                Install this app on your device for quick offline access.
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setInstallButtonVisible(false)}
            >
              Not now
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={handleInstallClick}
            >
              <i className="ri-add-line mr-1"></i>
              Install
            </Button>
          </div>
        </div>
      </div>
      
      {/* iOS Install Instructions Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Install on iOS</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 py-2">
                <p>To install this app on your iOS device:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li className="text-gray-700">
                    Tap the <span className="inline-flex items-center"><i className="ri-share-forward-line mx-1"></i></span> Share button in Safari
                  </li>
                  <li className="text-gray-700">
                    Scroll down and tap <span className="font-medium">"Add to Home Screen"</span>
                  </li>
                  <li className="text-gray-700">
                    Tap <span className="font-medium">"Add"</span> in the upper right corner
                  </li>
                </ol>
                <p className="text-sm text-gray-500 mt-4">
                  Once installed, this app will work offline and look like a native app.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}