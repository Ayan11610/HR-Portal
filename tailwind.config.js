/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'portal-navy': '#2E86C1',
        'anchor-blue': '#2E86C1',
        'sky-wash': '#F0F9FF',
        'verified-green': '#1A7A4A',
        'alert-amber': '#F59E0B',
        'charcoal': '#1E293B',
        'light-border': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}