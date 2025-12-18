import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

const withAlpha = (cssVar: string) => `hsl(var(${cssVar}) / <alpha-value>)`

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        /* ===== Base tokens (support /opacity) ===== */
        bg: withAlpha('--bg'),
        fg: withAlpha('--fg'),

        background: withAlpha('--background'),
        foreground: withAlpha('--foreground'),

        muted: withAlpha('--muted'),
        'muted-foreground': withAlpha('--muted-foreground'),

        /* ===== Lines ===== */
        border: withAlpha('--border'),
        input: withAlpha('--input'),
        ring: withAlpha('--ring'),

        /* ===== Surfaces ===== */
        card: {
          DEFAULT: withAlpha('--card'),
          foreground: withAlpha('--card-foreground'),
        },
        popover: {
          DEFAULT: withAlpha('--popover'),
          foreground: withAlpha('--popover-foreground'),
        },

        /* ===== Brand & actions ===== */
        primary: {
          DEFAULT: withAlpha('--primary'),
          foreground: withAlpha('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withAlpha('--secondary'),
          foreground: withAlpha('--secondary-foreground'),
        },
        accent: {
          DEFAULT: withAlpha('--accent'),
          foreground: withAlpha('--accent-foreground'),
        },

        /* ===== States ===== */
        success: withAlpha('--success'),
        warning: withAlpha('--warning'),
        destructive: {
          DEFAULT: withAlpha('--destructive'),
          foreground: withAlpha('--destructive-foreground'),
        },

        /* ===== Glass / glow ===== */
        glass: withAlpha('--glass'),
        'glass-border': withAlpha('--glass-border'),
        glow: {
          primary: withAlpha('--glow-primary'),
          accent: withAlpha('--glow-accent'),
        },

        /* ===== Sidebar (combined) ===== */
        sidebar: {
          DEFAULT: withAlpha('--sidebar-background'),
          foreground: withAlpha('--sidebar-foreground'),
          primary: withAlpha('--sidebar-primary'),
          'primary-foreground': withAlpha('--sidebar-primary-foreground'),
          accent: withAlpha('--sidebar-accent'),
          'accent-foreground': withAlpha('--sidebar-accent-foreground'),
          border: withAlpha('--sidebar-border'),
          ring: withAlpha('--sidebar-ring'),

          // aliases from the other config (so كلا الاسمين يشتغلوا)
          bg: withAlpha('--sidebar-bg'),
          fg: withAlpha('--sidebar-fg'),
          muted: withAlpha('--sidebar-muted'),
          active: withAlpha('--sidebar-active'),
        },

        /* ===== Charts & map ===== */
        chart: {
          1: withAlpha('--chart-1'),
          2: withAlpha('--chart-2'),
          3: withAlpha('--chart-3'),
          4: withAlpha('--chart-4'),
          5: withAlpha('--chart-5'),
          6: withAlpha('--chart-6'),
          7: withAlpha('--chart-7'),
          8: withAlpha('--chart-8'),
          grid: withAlpha('--chart-grid'),
        },
        map: {
          start: withAlpha('--map-start'),
          mid: withAlpha('--map-mid'),
          end: withAlpha('--map-end'),
        },
      },

      borderRadius: {
        // keep shadcn style + add xl/2xl from second config
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'var(--radius)',
        '2xl': 'calc(var(--radius) + 8px)',
      },

      fontFamily: {
        heading: ['Playfair Display', 'Tajawal', 'serif'],
        body: ['Inter', 'Tajawal', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px -5px hsl(var(--primary) / 0.5)' },
          '50%': { boxShadow: '0 0 40px -5px hsl(var(--primary) / 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        orbit: 'orbit 20s linear infinite',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',

        'map-gradient': 'linear-gradient(90deg, var(--map-start), var(--map-mid), var(--map-end))',
        'gradient-primary': 'linear-gradient(135deg, var(--primary), var(--accent))',
        'gradient-subtle': 'var(--gradient-subtle)',
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
    },
  },
  plugins: [forms, typography],
} as const
