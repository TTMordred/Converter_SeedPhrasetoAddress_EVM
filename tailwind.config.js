/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#60a5fa',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        green: {
          300: '#86efac',
          400: '#4ade80',
          800: '#166534',
          900: '#14532d',
        },
        red: {
          300: '#fca5a5',
          400: '#f87171',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  plugins: [],
};