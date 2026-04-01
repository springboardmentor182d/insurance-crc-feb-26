import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPreferences, updatePreferences } from '../features/preferences/services/preferencesService';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('bv_theme') || 'light'
  );
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bv_theme', theme);
  }, [theme]);

  // On mount: sync theme from backend
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await getPreferences();
        if (data?.theme === 'light' || data?.theme === 'dark') {
          setTheme(data.theme);
        }
      } catch {
        // Keep localStorage value
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await updatePreferences({ theme: newTheme });
    } catch {
      // UI already updated, non-critical
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};