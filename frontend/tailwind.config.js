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
        // الأساسيات المطابقة لـ index.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'card-hover': 'hsl(var(--card-hover))',

        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',

        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',

        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'primary-muted': 'hsl(var(--primary-muted))',

        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'accent-light': 'hsl(var(--accent-light))',

        success: 'hsl(var(--success))',
        'success-foreground': 'hsl(var(--success-foreground))',

        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',

        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',

        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        // ألوان الـ Sidebar
        'sidebar-background': 'hsl(var(--sidebar-background))',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'sidebar-primary': 'hsl(var(--sidebar-primary))',
        'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        'sidebar-accent': 'hsl(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        'sidebar-border': 'hsl(var(--sidebar-border))',
        'sidebar-ring': 'hsl(var(--sidebar-ring))',

        // Legacy palette
        greenic: {
          DEFAULT: 'hsl(var(--greenic))',
          light: 'hsl(var(--greenic-light))',
          dark: 'hsl(var(--greenic-dark))',
          darker: 'hsl(var(--greenic-darker))',
        },
        royal: {
          DEFAULT: 'hsl(var(--royal))',
          light: 'hsl(var(--royal-light))',
          dark: 'hsl(var(--royal-dark))',
          darker: 'hsl(var(--royal-darker))',
          ultraDark: 'hsl(var(--royal-ultraDark))',
          electric: 'hsl(var(--royal-electric))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          light: 'hsl(var(--gold-light))',
          dark: 'hsl(var(--gold-dark))',
        },
        navy: {
          DEFAULT: 'hsl(var(--navy))',
          light: 'hsl(var(--navy-light))',
          dark: 'hsl(var(--navy-dark))',
          darker: 'hsl(var(--navy-darker))',
        },
        reded: {
          DEFAULT: 'hsl(var(--reded))',
        },
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
        focus: '0 0 0 4px rgba(56,189,248,0.25)',
        card: '0 10px 40px rgba(0,0,0,0.08)',
      },
   backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
      },
      transitionTimingFunction: {
        'ease-soft': 'cubic-bezier(.2,.8,.2,1)',
        'ease-smooth': 'var(--transition-smooth)',
      },
    },
  },
  plugins: [forms, typography],
};