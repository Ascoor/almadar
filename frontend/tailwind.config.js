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
        // النظام الأساسي للألوان - Theme System Colors
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // نظام الألوان المتقدم - Advanced Color System
        // الأزرق الملكي - Royal Blue
        malaki: {
          50: '#EBF4FF',
          100: '#C3DAFE', 
          200: '#A3BFFA',
          300: '#7C9BF7',
          400: '#6C7DFF',
          500: '#3B82F6', // الأساسي
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#1E293B',
          950: '#0D1720',
        },

        // الذهبي الفاخر - Luxury Gold
        dhahabi: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#F5DA81',
          400: '#F59E0B',
          500: '#D4AF37', // الأساسي
          600: '#B8860B',
          700: '#A67C00',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        // الأخضر الطبيعي - Natural Green  
        akhdar: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#81C784',
          500: '#4CAF50', // الأساسي
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#0F3314',
          950: '#05140F',
        },

        // الأحمر الأنيق - Elegant Red
        ahmar: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // الأساسي
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },

        // البحري العميق - Deep Navy
        bahri: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#0F3460', // الأساسي
          600: '#1E40AF',
          700: '#1E3A8A',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020C1A',
        },

        // البنفسجي الراقي - Elegant Purple
        banafsaji: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },

        // البرتقالي المشرق - Bright Orange
        burtuqali: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },

        // الرمادي الأنيق - Elegant Gray
        ramadi: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },

        // الوردي الناعم - Soft Pink
        wardi: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724',
        },

        // السماوي الصافي - Clear Sky Blue
        samawi: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },

        // الليموني المنعش - Fresh Lime
        limuni: {
          50: '#F7FEE7',
          100: '#ECFCCB',
          200: '#D9F99D',
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
          950: '#1A2E05',
        },
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
          dark: '#020f23',
          darker: '#020c1a',
        },
        royal: {
          light: '#A3BFFA',
          DEFAULT: '#3B82F6',
          dark: '#1E3A8A',
          darker: '#1E293B',
          ultraDark: '#0D1720',
          electric: '#6C7DFF',
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
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },

      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'lalezar': ['Lalezar', 'cursive'],
        'tharwat': ['Tharwat', 'decorative'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      boxShadow: {
        'malaki': '0 4px 14px 0 rgb(59 130 246 / 0.25)',
        'dhahabi': '0 4px 14px 0 rgb(212 175 55 / 0.25)',
        'akhdar': '0 4px 14px 0 rgb(76 175 80 / 0.25)',
        'soft': '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        'elegant': '0 8px 32px 0 rgb(0 0 0 / 0.12)',
      },

      backgroundImage: {
        'gradient-malaki': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-dhahabi': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-akhdar': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },

  plugins: [ 
    plugin(function ({ addBase, addUtilities }) {
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

      addUtilities({
        // مرافق الألوان المخصصة - Custom Color Utilities
        '.text-malaki-gradient': {
          background: 'linear-gradient(135deg, #3B82F6 0%, #6C7DFF 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-dhahabi-gradient': {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F5DA81 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-akhdar-gradient': {
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        
        // خلفيات متدرجة أنيقة - Elegant Gradient Backgrounds
        '.bg-malaki-elegant': {
          background: 'linear-gradient(135deg, #3B82F6 0%, #6C7DFF 50%, #A3BFFA 100%)',
        },
        '.bg-dhahabi-elegant': {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F5DA81 50%, #FEF3C7 100%)',
        },
        '.bg-akhdar-elegant': {
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 50%, #C8E6C9 100%)',
        },
        
        // تأثيرات الظل المتقدمة - Advanced Shadow Effects
        '.shadow-malaki-glow': {
          'box-shadow': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
        },
        '.shadow-dhahabi-glow': {
          'box-shadow': '0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)',
        },
        '.shadow-akhdar-glow': {
          'box-shadow': '0 0 20px rgba(76, 175, 80, 0.4), 0 0 40px rgba(76, 175, 80, 0.2)',
        },
      });
    }),
  ],
};