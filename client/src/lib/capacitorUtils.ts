// Capacitor utilities for native integrations
import { Capacitor } from '@capacitor/core';

// Check if the app is running in a native environment
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

// Get the platform (android, ios, web)
export function getPlatform(): string {
  return Capacitor.getPlatform();
}

// Check if we're running on Android
export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

// Check if we're running on iOS
export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

// Get the Capacitor app URL scheme
export function getAppUrlScheme(): string | undefined {
  if (!isNativePlatform()) return undefined;
  return (Capacitor as any).getAppUrlScheme?.() || 'cateringcostestimator';
}

// Check if app is running as PWA or standalone browser
export function isPWA(): boolean {
  return !isNativePlatform() && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
}

// Utility function to determine if we should show install prompts
export function shouldShowInstallPrompt(): boolean {
  return !isNativePlatform() && !isPWA();
}