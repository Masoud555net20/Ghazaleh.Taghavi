import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  focusVisible: boolean;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setFocusVisible: (value: boolean) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [focusVisible, setFocusVisible] = useState(false);

  // Check for user preferences on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);

    // Listen for changes in motion preferences
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);

    mediaQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Apply accessibility styles to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply reduced motion styles
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Apply high contrast styles
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size styles
    root.setAttribute('data-font-size', fontSize);

    // Apply focus visible styles
    if (focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [reducedMotion, highContrast, fontSize, focusVisible]);

  const value: AccessibilityContextType = {
    reducedMotion,
    highContrast,
    fontSize,
    focusVisible,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    setFocusVisible,
    announceToScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
