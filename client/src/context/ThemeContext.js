import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPreferences, updatePreferences } from '../features/preferences/services/preferencesService';
import { TOKEN_KEYS } from '../data/constants';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('bv_theme') || 'light'
  );

  const hasStoredSession = () => {
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
    const storedUser = localStorage.getItem(TOKEN_KEYS.USER);

    return Boolean(accessToken && storedUser && storedUser !== 'undefined');
  };

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
    if (!hasStoredSession()) {
      return;
    }

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
