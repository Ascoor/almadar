import React from 'react';
import { useMobileTheme } from './MobileThemeProvider';

const ResponsiveLayout = ({ children, className = '' }) => {
  const { isMobile, isStandalone, orientation, safeAreaInsets } =
    useMobileTheme();

  const layoutClasses = `
    ${className}
    ${isMobile ? 'mobile-layout' : 'desktop-layout'}
    ${isStandalone ? 'standalone-mode' : 'browser-mode'}
    ${orientation === 'landscape' ? 'landscape-mode' : 'portrait-mode'}
    transition-[width,transform] duration-300 ease-in-out
    w-full min-w-0 overflow-x-hidden
  `;

  const layoutStyles = {
    paddingTop:
      isStandalone && isMobile
        ? `max(${safeAreaInsets.top}px, 1rem)`
        : undefined,
    paddingBottom:
      isStandalone && isMobile
        ? `max(${safeAreaInsets.bottom}px, 1rem)`
        : undefined,
    minHeight: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
  };

  return (
    <div className={layoutClasses} style={layoutStyles}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
