import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface PreferencesContextType {
  fontSize: 'small' | 'medium' | 'large';
  viewMode: 'compact' | 'comfortable';
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable'>('comfortable');

  useEffect(() => {
    const prefs = localStorage.getItem('userPreferences');
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        setFontSize(parsed.font_size || 'medium');
        setViewMode(parsed.view_mode || 'comfortable');
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-view-mode', viewMode);
  }, [fontSize, viewMode]);

  return (
    <PreferencesContext.Provider value={{ fontSize, viewMode }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferencesContext must be used within PreferencesProvider');
  return context;
}
