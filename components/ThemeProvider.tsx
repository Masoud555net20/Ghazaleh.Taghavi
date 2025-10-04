import React, { createContext, useContext, ReactNode } from 'react';

// Temporarily disabled theme functionality
interface ThemeContextType {
  currentTheme: null;
  setTheme: (theme: null) => void;
  themes: [];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Theme functionality temporarily disabled
  const setTheme = (theme: null) => {
    // No-op function
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme: null,
      setTheme,
      themes: []
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
