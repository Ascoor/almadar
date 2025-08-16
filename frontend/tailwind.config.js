import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        fg: 'hsl(var(--fg))',
        muted: 'hsl(var(--muted))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        primaryFg: 'hsl(var(--primary-fg))',
        accent: 'hsl(var(--accent))',
        accentFg: 'hsl(var(--accent-fg))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
        focus: '0 0 0 4px rgba(56,189,248,0.25)',
        card: '0 10px 40px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        'gradient-hero':
          'radial-gradient(1200px 600px at 10% -20%, rgba(16,185,129,0.12), transparent 50%), radial-gradient(1200px 600px at 110% 120%, rgba(56,189,248,0.12), transparent 50%), linear-gradient(180deg, hsl(var(--bg)) 0%, hsl(var(--bg)) 100%)',
      },
      transitionTimingFunction: {
        'ease-soft': 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [forms, typography],
};
