/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'floral-white': '#FAF7EE',
        'black-olive': '#31372B',
        'slate-gray': '#203C3D',
      },
      boxShadow: {
        'neu-raised': '8px 8px 16px rgba(49, 55, 43, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neu-pressed': 'inset 6px 6px 12px rgba(49, 55, 43, 0.15), inset -6px -6px 12px rgba(255, 255, 255, 0.8)',
        'neu-sm-raised': '4px 4px 8px rgba(49, 55, 43, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-sm-pressed': 'inset 3px 3px 6px rgba(49, 55, 43, 0.12), inset -3px -3px 6px rgba(255, 255, 255, 0.9)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
