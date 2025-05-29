const plugin = require('tailwindcss/plugin');

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Theme-driven CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Custom palettes
        reded: {
          light: '#FCA5A5',
          DEFAULT: '#EF4444',
          dark: '#7F1D1D',
        },
        greenic: {
          light: '#81C784',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
          darker: '#05140f',
        },
        navy: {
           light: '#1A5DAD',
          DEFAULT: '#0F3460',
          dark: '#0A1E37',

          darker: '#080a23',
        },
        royal: {
  light: '#A3BFFA',     
          DEFAULT: '#3B82F6' ,
          dark: '#1E3A8A',   
          darker: '#1E293B', 
        },
        gold: {
          light: '#F5DA81',
          DEFAULT: '#D4AF37',
          dark: '#A67C00',
        },
        specialist: {
          1: '#5C85FF',
          2: '#3A5BBC',
          3: '#203670',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [ 
    plugin(function ({ addBase }) {
      addBase({
        '@font-face': [
          {
            fontFamily: 'Tajawal',
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            src: `url('/fonts/Tajawal/Tajawal-Regular.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Amiri',
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            src: `url('/fonts/Amiri/Amiri-Regular.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Lalezar',
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            src: `url('/fonts/Lalezar/Lalezar-Regular.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tharwat',
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            src: `url('/fonts/TharwatOmaraa.ttf') format('truetype')`,
          },
        ],
      });
    }),
  ],
};
