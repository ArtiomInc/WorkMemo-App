/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{vue,js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#cbd5e1',
        secondary: '#ffffff',
        success: '#6ee7b7',
        'success-text': '#047857',
        error: '#fca5a5',
        'error-text': '#b91c1c',
        warning: '#fdba74',
        'warning-text': '#fdba74',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
