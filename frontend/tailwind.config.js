// tailwind.config.js
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        // base
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',

        // surfaces
        card: { DEFAULT: 'var(--card)', foreground: 'var(--fg)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--fg)' },

        // brand & actions
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',

        // states
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)',

        // lines
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // sidebar
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
          fg: 'var(--sidebar-fg)',
          muted: 'var(--sidebar-muted)',
          active: 'var(--sidebar-active)',
        },

        // charts & map
        chart: {
          1: 'var(--chart-1)', 2: 'var(--chart-2)', 3: 'var(--chart-3)', 4: 'var(--chart-4)',
          5: 'var(--chart-5)', 6: 'var(--chart-6)', 7: 'var(--chart-7)', 8: 'var(--chart-8)',
          grid: 'var(--chart-grid)',
        },
        map: { start: 'var(--map-start)', mid: 'var(--map-mid)', end: 'var(--map-end)' },
      },
      backgroundImage: {
        'map-gradient': 'linear-gradient(90deg, var(--map-start), var(--map-mid), var(--map-end))',
        'gradient-primary': 'linear-gradient(135deg, var(--primary), var(--accent))',
        'gradient-subtle': 'var(--gradient-subtle)',   // ⬅️ مضافة
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06))',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
        light: '0 8px 24px var(--shadow-light)',
        dark: '0 16px 40px var(--shadow-dark)',
      },
      borderRadius: {
        xl: 'var(--radius)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'inherit'],
        body: ['var(--font-body)', 'inherit'],
      },
    },
  },
  plugins: [forms, typography],
};
