/**
 * Helper utilities for PWA detection
 */

/**
 * Check if app is running as installed PWA
 */
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

/**
 * Check if running in browser (not installed)
 */
export const isRunningInBrowser = (): boolean => {
  return !isAppInstalled();
};

/**
 * Get display mode
 */
export const getDisplayMode = (): 'standalone' | 'browser' => {
  return isAppInstalled() ? 'standalone' : 'browser';
};
