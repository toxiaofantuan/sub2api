/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - clear sky blue
        primary: {
          50: '#f4fbff',
          100: '#e7f5ff',
          200: '#c7e8ff',
          300: '#94d4ff',
          400: '#58b7ff',
          500: '#2498f2',
          600: '#0c78d8',
          700: '#075fac',
          800: '#0b518e',
          900: '#0f4574',
          950: '#0a2d4d'
        },
        // Accent - frosted aqua blue
        accent: {
          50: '#f6fcff',
          100: '#e9f8ff',
          200: '#d2efff',
          300: '#a9e0ff',
          400: '#73c9f8',
          500: '#48b2ec',
          600: '#2792ce',
          700: '#1f75a7',
          800: '#215f87',
          900: '#204f70',
          950: '#153349'
        },
        // Dark mode - cool blue gray
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
          'inset 0 1px 0 rgba(255, 255, 255, 0.86), 0 16px 40px rgba(54, 111, 166, 0.11), 0 2px 8px rgba(151, 196, 230, 0.1)',
        'glass-sm':
          'inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 6px 18px rgba(54, 111, 166, 0.08)',
        glow: '0 0 18px rgba(36, 152, 242, 0.18)',
        'glow-lg': '0 0 34px rgba(36, 152, 242, 0.24)',
        card: '0 2px 8px rgba(54, 111, 166, 0.07)',
        'card-hover': '0 12px 30px rgba(54, 111, 166, 0.13)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #eaf7ff 0%, #cbeeff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #343a50 0%, #171b2d 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(235,247,255,0.46) 52%, rgba(215,239,255,0.34) 100%)',
        'mesh-gradient':
          'linear-gradient(135deg, rgba(199, 232, 255, 0.36) 0%, rgba(255, 255, 255, 0) 44%), linear-gradient(315deg, rgba(169, 224, 255, 0.28) 0%, rgba(255, 255, 255, 0) 48%)'
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
          '0%': { boxShadow: '0 0 20px rgba(36, 152, 242, 0.18)' },
          '100%': { boxShadow: '0 0 32px rgba(72, 178, 236, 0.28)' }
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
