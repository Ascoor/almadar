import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import rtl from 'tailwindcss-rtl';

export default {
  darkMode: 'class',
  content: ['index.html', 'src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        sidebar: 'rgb(var(--sidebar) / <alpha-value>)',
        'sidebar-foreground': 'rgb(var(--sidebar-foreground) / <alpha-value>)',
        'sidebar-muted': 'rgb(var(--sidebar-muted) / <alpha-value>)',
        'sidebar-border': 'rgb(var(--sidebar-border) / <alpha-value>)',
        'sidebar-accent': 'rgb(var(--sidebar-accent) / <alpha-value>)',
        'sidebar-accent-foreground': 'rgb(var(--sidebar-accent-foreground) / <alpha-value>)',
        'sidebar-ring': 'rgb(var(--sidebar-ring) / <alpha-value>)',
      },
      boxShadow: {
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-card': 'var(--gradient-card)',
      },
    },
  },
  plugins: [forms, typography, rtl],
};
