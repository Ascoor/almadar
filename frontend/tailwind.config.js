import plugin from 'tailwindcss/plugin';
import forms from '@tailwindcss/forms';
import cssVariablesPlugin from 'postcss-css-variables';
import rtl from 'tailwindcss-rtl';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './public/index.html',
    './node_modules/flowbite/**/*.js',
    './node_modules/@headlessui/react/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        lalezar: ['Lalezar', 'sans-serif'],
      
        amiri: ['Amiri', 'serif'],
        tharwat: ['Tharwat', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },

      colors: {
        'almadar-blue': {
          light: '#389df1',
          DEFAULT: '#3b77b7',
          dark: '#1f2c54',
        },
        'almadar-sky': {
          light: '#E0F2FE', 
          DEFAULT: '#0EA5E9', 
          dark: '#0369A1',
        },
        'almadar-mint': {
          light: '#CCFBF1',
          DEFAULT: '#14B8A6',
          dark: '#0F766E',
        },
        'almadar-sidebar': {
          light: '#F0F4F8',
          DEFAULT: '#22A9CD',
          dark: '#0F5E8A',
          accent: '#D6FFCA',
          danger: '#EF4444',
        },
        'almadar-sand': {
          light: '#FEF9C3',
          DEFAULT: '#FACC15',
          dark: '#CA8A04',
        },
        'almadar-graphite': {
          light: '#E5E7EB',
          DEFAULT: '#6B7280',
          dark: '#111827',
        },
        'almadar-white': {
          light: '#ffffff',
          DEFAULT: '#F9FAFB',
        },
      },

      backgroundImage: {
        'gradient-header': 'linear-gradient(to right, #FACC15, #0EA5E9)',
        'gradient-header-dark': 'linear-gradient(to right, #1E3A8A, #0EA5E9)',
        'gradient-sidebar': 'linear-gradient(to bottom, #FEF9C3, #D0EBFF)',
        'gradient-sidebar-dark': 'linear-gradient(to bottom, #1E3A8A, #111827)',
      },
      textColor: {
        primary: '#1E3A8A', 
        secondary: '#0EA5E9', 
        accent: '#FACC15',
        light: '#ffffff',
        dark: '#0F172A',
      },
      borderColor: {
        primary: '#FACC15',
        secondary: '#D0EBFF',
        dark: '#111827',
      },

      boxShadow: {
        top: '0 -4px 6px rgba(0, 0, 0, 0.1)',
        base: '0 1px 3px rgba(0, 0, 0, 0.1)',
        hover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        focus: '0 0 0 4px rgba(60, 60, 220, 0.4)',
      },

      scale: {
        98: '0.98',
        102: '1.02',
      },

      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'fade-in-out': 'fade-in-out 5s ease-in-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [
    forms,
    rtl,
    plugin(function ({ addBase }) {
      addBase({
        '@font-face': [
          {
            fontFamily: 'Amiri',
            fontStyle: 'normal',
            fontWeight: '400',
            fontDisplay: 'swap',
            src: `url('./assets/fonts/Amiri/Amiri-Regular.ttf') format('truetype')`,
          },
          {
             fontFamily: 'Lalezar',
            src: `url('./assets/fonts/Lalezar/Lalezar-Regular.ttf') format('truetype')`,
            fontDisplay: 'swap',
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
          {
            fontFamily: 'Tharwat',
            fontStyle: 'normal',
            fontWeight: '400',
            src: `url('./assets/fonts/TharwatOmaraa.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '400',
            src: `url('./assets/fonts/Tajawal/Tajawal-Regular.ttf') format('truetype')`,
          },
        ],
      });
    }),
    typography,
    aspectRatio,
    cssVariablesPlugin,
  ],
};
