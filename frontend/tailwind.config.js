/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - lavender violet
        primary: {
          50: '#f8f7ff',
          100: '#f0edff',
          200: '#e2dcff',
          300: '#c9bffd',
          400: '#a596ea',
          500: '#7768d5',
          600: '#6557bf',
          700: '#53469f',
          800: '#443b80',
          900: '#393366',
          950: '#231f40'
        },
        // Accent - clear sky blue
        accent: {
          50: '#f2f9fd',
          100: '#e1f1fa',
          200: '#bfe3f4',
          300: '#94d1ec',
          400: '#6dbce5',
          500: '#5aa7df',
          600: '#3e87bc',
          700: '#356d99',
          800: '#325c7e',
          900: '#304e68',
          950: '#203345'
        },
        // Dark mode - cool violet gray
        dark: {
          50: '#f6f7fb',
          100: '#eceef5',
          200: '#d9dce9',
          300: '#bbc0d2',
          400: '#949bb5',
          500: '#737b99',
          600: '#59617d',
          700: '#444b64',
          800: '#343a50',
          900: '#252a3d',
          950: '#171b2d'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass:
          'inset 0 1px 0 rgba(255, 255, 255, 0.82), 0 16px 40px rgba(83, 70, 145, 0.12), 0 2px 8px rgba(90, 167, 223, 0.08)',
        'glass-sm':
          'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 6px 18px rgba(83, 70, 145, 0.09)',
        glow: '0 0 18px rgba(119, 104, 213, 0.2)',
        'glow-lg': '0 0 34px rgba(119, 104, 213, 0.24)',
        card: '0 2px 8px rgba(73, 57, 139, 0.07)',
        'card-hover': '0 12px 30px rgba(73, 57, 139, 0.13)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #a596ea 0%, #7768d5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #343a50 0%, #171b2d 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(240,237,255,0.38) 52%, rgba(227,242,255,0.3) 100%)',
        'mesh-gradient':
          'linear-gradient(135deg, rgba(201, 191, 253, 0.28) 0%, rgba(255, 255, 255, 0) 44%), linear-gradient(315deg, rgba(159, 210, 255, 0.24) 0%, rgba(255, 255, 255, 0) 48%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(119, 104, 213, 0.2)' },
          '100%': { boxShadow: '0 0 32px rgba(90, 167, 223, 0.3)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
