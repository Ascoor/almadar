import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MobileThemeContext = createContext({
  isMobile: false,
  isStandalone: false,
  orientation: 'portrait',
  viewportHeight: window.innerHeight,
  safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
});

export const MobileThemeProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0, bottom: 0, left: 0, right: 0
  });

  // React 18 optimization with useCallback
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // Check if running as standalone PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone ||
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);
    
    // Update orientation
    setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    
    // Update viewport height (important for mobile browsers)
    setViewportHeight(window.innerHeight);
  }, []);

  const updateSafeArea = useCallback(() => {
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0')
      });
    }
  }, []);

  useEffect(() => {
    checkMobile();
    updateSafeArea();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, [checkMobile, updateSafeArea]);

  // Set CSS custom properties for mobile-specific styling
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
    document.documentElement.style.setProperty('--safe-area-inset-top', `${safeAreaInsets.top}px`);
    document.documentElement.style.setProperty('--safe-area-inset-bottom', `${safeAreaInsets.bottom}px`);
    document.documentElement.style.setProperty('--safe-area-inset-left', `${safeAreaInsets.left}px`);
    document.documentElement.style.setProperty('--safe-area-inset-right', `${safeAreaInsets.right}px`);
  }, [viewportHeight, safeAreaInsets]);

  const contextValue = React.useMemo(() => ({
    isMobile,
    isStandalone,
    orientation,
    viewportHeight,
    safeAreaInsets
  }), [isMobile, isStandalone, orientation, viewportHeight, safeAreaInsets]);

  return (
    <MobileThemeContext.Provider value={contextValue}>
      {children}
    </MobileThemeContext.Provider>
  );
};

export const useMobileTheme = () => {
  const context = useContext(MobileThemeContext);
  if (!context) {
    throw new Error('useMobileTheme must be used within a MobileThemeProvider');
  }
  return context;
};