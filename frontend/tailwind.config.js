/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        ink: '#0B1220',
        paper: {
          DEFAULT: '#F7FAFC',
          dark: '#0F172A',
        },
        primary: {
          50:'#EAF2F8',100:'#D4E5F1',200:'#A9CBE4',300:'#7FB1D6',
          400:'#5497C9',500:'#297DBB',600:'#206395',700:'#174970',800:'#0F304A'
        },
        accent: '#35B0A6',
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#DC2626',
        muted:   '#6B7280',
      },
      fontFamily: {
        display: ['Inter', 'Tajawal', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'Tajawal', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(11,18,32,0.06)',
        card: '0 6px 30px rgba(11,18,32,0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .4s ease-out both',
      },
    },
  },
  plugins: [],
};
