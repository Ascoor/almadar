	
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
					'2xl': '1400px'
				}
			},
			extend: {
			
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        reded: {
          light: '#FCA5A5',
          DEFAULT: '#EF4444',
          dark: '#7F1D1D',
        },
        greenic: {
  light: '#81C784',  // Light green
  DEFAULT: '#4CAF50', // Default green
  dark: '#388E3C',   // Dark green
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      greenic: {
    DEFAULT: '#4CAF50',    // للخلفيات الرئيسية
    light: '#81C784',      // للتسليط الضوء على العناصر الثانوية
    dark: '#388E3C'        // للحدود أو التباين مع النص
  },
 navy: {
    DEFAULT: '#0F3460',    // للخلفيات الرئيسية
    light: '#1A5DAD',      // للتسليط الضوء على العناصر الثانوية
    dark: '#0A1E37'        // للحدود أو التباين مع النص
  },
  royal: {
    light: '#1c4592',      // للتسليط الضوء أو العناصر الفرعية
    DEFAULT: '#0d1d44',    // للعناوين أو العناصر الرئيسية
    dark: '#0a152e'        // للظلال أو الخلفيات الرئيسية
  },
	gold: {
						DEFAULT: '#D4AF37',
						light: '#F5DA81',
						dark: '#A67C00'
					},
        specialist: {
          1: '#5C85FF',
          2: '#3A5BBC',
          3: '#203670',
        },
        // إضافة ألوان جديدة أو تعديل الألوان الموجودة
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
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
		