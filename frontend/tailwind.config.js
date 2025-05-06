module.exports = {
	darkMode: 'class', // تمكين الوضع الداكن عبر class
	content: [
	  "./pages/**/*.{js,jsx}",
	  "./components/**/*.{js,jsx}",
	  "./app/**/*.{js,jsx}",
	  "./src/**/*.{js,jsx}",
	],
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
		  border: '#d1d5db', // تغيير إلى HEX
		  input: '#f3f4f6',  // تغيير إلى HEX
		  ring: '#e5e7eb',    // تغيير إلى HEX
		  background: '#ffffff',  // تغيير إلى HEX
		  foreground: '#1f2937',  // تغيير إلى HEX
		  primary: {
			DEFAULT: '#4caf50', // أخضر (HEX)
			foreground: '#ffffff'
		  },
		  secondary: {
			DEFAULT: '#6c757d',  // رمادي (HEX)
			foreground: '#ffffff'
		  },
		  destructive: {
			DEFAULT: '#e57373', // أحمر (HEX)
			foreground: '#ffffff'
		  },
		  muted: {
			DEFAULT: '#f8f9fa',  // أبيض رمادي (HEX)
			foreground: '#000000'
		  },
		  accent: {
			DEFAULT: '#ff9800', // برتقالي (HEX)
			foreground: '#ffffff'
		  },
		  popover: {
			DEFAULT: '#ffffff', // أبيض (HEX)
			foreground: '#000000'
		  },
		  card: {
			DEFAULT: '#ffffff', // أبيض (HEX)
			foreground: '#000000'
		  },
		  mint: {
			light: '#a0f2e5', // أخضر فاتح (HEX)
			DEFAULT: '#14b8a6', // أخضر متوسط (HEX)
			dark: '#0f766e', // أخضر داكن (HEX)
		  },
		  gold: {
			DEFAULT: '#d4af37', // ذهبي (HEX)
			light: '#f5da81', // ذهبي فاتح (HEX)
			dark: '#a67c00' // ذهبي داكن (HEX)
		  },
		  navy: {
			DEFAULT: '#0f3460', // أزرق داكن (HEX)
			light: '#1a5dad', // أزرق فاتح (HEX)
			dark: '#0a1e37' // أزرق غامق (HEX)
		  },
		  'luxury-green-start': '#004d2d', // أخضر داكن (HEX)
		  'luxury-green-mid': '#1d543d', // أخضر متوسط (HEX)
		  'luxury-green-end': '#33cc80', // أخضر فاتح (HEX)
		},
		backgroundImage: {
		  'luxury-green-gradient': 'linear-gradient(135deg, #0c1a14, #1d543d, #02311d)', // تدرج بألوان HEX
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
	  }
	},
	plugins: [require("tailwindcss-animate")],
  }
  