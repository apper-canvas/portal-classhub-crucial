/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a7ff',
          500: '#0c8aff',
          600: '#2E5266',
          700: '#265a8a',
          800: '#244972',
          900: '#243e5f',
        },
        secondary: {
          400: '#6E8898',
          500: '#6E8898',
          600: '#5a7080',
        },
        accent: {
          400: '#6bd69b',
          500: '#52B788',
          600: '#4aa376',
        },
        surface: '#FFFFFF',
        background: '#F7F9FB',
        success: '#52B788',
        warning: '#F4A261',
        error: '#E63946',
        info: '#4A90E2',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '0.875rem',
        lg: '1.09375rem',
        xl: '1.365625rem',
        '2xl': '1.70703125rem',
        '3xl': '2.1337890625rem',
        '4xl': '2.6669921875rem',
      },
    },
  },
  plugins: [],
}