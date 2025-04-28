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
        amiri: ['Amiri', 'serif'],
        tharwat: ['Tharwat', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },

      // الهوية الرسمية للمدار
      colors: {
        'almadar-green': {
          light: '#B7E4A0',
          DEFAULT: '#5DBB2F',
          dark: '#3A7D19',
          darker: '#27520F',
        },
        'almadar-gray': {
          light: '#A0AEC0',
          DEFAULT: '#718096',
          dark: '#4A5568',
          darker: '#2D3748',
        },
        'almadar-yellow': {
          light: '#FFF9C4',
          DEFAULT: '#FFEB3B',
          dark: '#FBC02D',
          darker: '#F57F17',
        },

        'almadar-white': '#FFFFFF',

        // خلفيات النظام
        lightBg: '#F8F9FA',
        darkBg: '#1C1C1C',

        // هوية إضافية
        'icon-color': {
          fb: '#1877F2',
          link: '#0A66C2',
          insta: '#E1306C',
          twitter: '#1DA1F2',
          tube: '#FF0000',
        },
      },
      backgroundImage: {
        'gradient-green-button': 'linear-gradient(to right, #A2E57B, #7AC943, #5CA832)',
        'gradient-gray-button': 'linear-gradient(to right, #666666, #333333, #1F1F1F)',
        'gradient-day': 'linear-gradient(to top, #A2E57B, #7AC943)',
        'gradient-night': 'linear-gradient(135deg, #1F1F1F, #333333)',

        'gradient-red-button': 'linear-gradient(to right, #ec4899, #db2777, #be185d)',
        'gradient-yellow-button': 'linear-gradient(to right, #fbbf24, #f59e0b, #d97706)',
        'gradient-blue-button': 'linear-gradient(to right, #60a5fa, #3b82f6, #2563eb)',

        'gradient-orange-dark': 'linear-gradient(to bottom, #ffa726, #fb7921)',
        'gradient-blue-dark': 'linear-gradient(to bottom, #1b2b5a, #031023)',
        'gradient-orange-light': 'linear-gradient(to bottom, #ffcc80, #ffb74d)',
        'gradient-blue-light': 'linear-gradient(to bottom, #bbdefb, #64b5f6)',
      },
      border: {
        light: '#e2e8f0',
        dark: '#1a202c',
      },
      text: {
        light: '#1a1a1a',
        dark: '#f7faff',
      },
      borderWidth: {
        DEFAULT: '1px',
        thin: '0.5px',
        thick: '2px',
        extrathick: '4px',
      },
      borderRadius: {
        card: '10px',
        header: '30px',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
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
      slideInUp: {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideIn: {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' },
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
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
    },
    variants: {
      extend: {
        opacity: ['responsive', 'hover', 'focus', 'group-hover'],
        transitionProperty: ['responsive', 'hover', 'focus'],
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
            fontFamily: 'Cairo',
            fontStyle: 'normal',
            fontWeight: '400',
            fontDisplay: 'swap',
            src: `url(https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a1biLD-H.woff2) format('woff2')`,
            unicodeRange:
              'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC, U+102E0-102FB, U+10E60-10E7E, U+10EC2-10EC4, U+10EFC-10EFF, U+1EE00-1EE03, U+1EE05-1EE1F, U+1EE21-1EE22, U+1EE24, U+1EE27, U+1EE29-1EE32, U+1EE34-1EE37, U+1EE39, U+1EE3B, U+1EE42, U+1EE47, U+1EE49, U+1EE4B, U+1EE4D-1EE4F, U+1EE51-1EE52, U+1EE54, U+1EE57, U+1EE59, U+1EE5B, U+1EE5D, U+1EE5F, U+1EE61-1EE62, U+1EE64, U+1EE67-1EE6A, U+1EE6C-1EE72, U+1EE74-1EE77, U+1EE79-1EE7C, U+1EE7E, U+1EE80-1EE89, U+1EE8B-1EE9B, U+1EEA1-1EEA3, U+1EEA5-1EEA9, U+1EEAB-1EEBB, U+1EEF0-1EEF1',
          },

          {
            fontFamily: 'Cairo',
            fontStyle: 'normal',
            fontWeight: '400',
            fontDisplay: 'swap',
            src: `url(https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a13iLD-H.woff2) format('woff2')`,
            unicodeRange:
              'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
          },

          {
            fontFamily: 'Cairo',
            fontStyle: 'normal',
            fontWeight: '400',
            fontDisplay: 'swap',
            src: `url(https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a1PiLA.woff2) format('woff2')`,
            unicodeRange:
              'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
          },

          {
            fontFamily: 'Tharwat',
            fontStyle: 'normal',
            fontWeight: '400',
            src: `url('./assets/fonts/TharwatOmaraa.ttf') format('truetype')`,
          },

          {
            fontFamily: 'Amiri',
            fontStyle: 'normal',
            fontWeight: '400',
            src: `url('./assets/fonts/Amiri/Amiri-Regular.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Amiri',
            fontStyle: 'normal',
            fontWeight: '700',
            src: `url('./assets/fonts/Amiri/Amiri-Bold.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Amiri',
            fontStyle: 'italic',
            fontWeight: '400',
            src: `url('./assets/fonts/Amiri/Amiri-Italic.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Amiri',
            fontStyle: 'italic',
            fontWeight: '700',
            src: `url('./assets/fonts/Amiri/Amiri-BoldItalic.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '400',
            src: `url('./assets/fonts/Tajawal/Tajawal-Regular.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '700',
            src: `url('./assets/fonts/Tajawal/Tajawal-Bold.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '300',
            src: `url('./assets/fonts/Tajawal/Tajawal-Light.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '500',
            src: `url('./assets/fonts/Tajawal/Tajawal-Medium.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '800',
            src: `url('./assets/fonts/Tajawal/Tajawal-ExtraBold.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '200',
            src: `url('./assets/fonts/Tajawal/Tajawal-ExtraLight.ttf') format('truetype')`,
          },
          {
            fontFamily: 'Tajawal',
            fontStyle: 'normal',
            fontWeight: '900',
            src: `url('./assets/fonts/Tajawal/Tajawal-Black.ttf') format('truetype')`,
          },
        ],
      });
    }),
    typography,
    aspectRatio,
    cssVariablesPlugin,
  ],
}; 