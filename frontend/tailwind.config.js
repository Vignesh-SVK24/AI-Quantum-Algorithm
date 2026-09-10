/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Quantum Botanical Noir Core Palette
        'floral-white': '#FAF7EE',
        'warm-ivory': '#F4F0E6',
        'soft-sand': '#E8E1D2',

        'black-olive': '#31372B',
        'deep-olive': '#252B21',
        'olive-mist': '#68705D',

        'cocoa-noir': '#342721',
        'soft-cocoa': '#5A453A',
        'warm-taupe': '#8B7868',

        'slate-glow': '#202C3D',
        'deep-slate': '#182331',
        'soft-slate': '#536173',
        'slate-gray': '#202C3D', // backwards-compatibility alias

        'muted-sage': '#A7B09A',
        'soft-cyan': '#8FBFC0',
        'dusty-lavender': '#AAA3B8',
        'warm-gold': '#C5A86A',
      },
      boxShadow: {
        'neu-raised': '6px 6px 16px rgba(49, 55, 43, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.95)',
        'neu-pressed': 'inset 4px 4px 10px rgba(49, 55, 43, 0.14), inset -4px -4px 10px rgba(255, 255, 255, 0.95)',
        'neu-sm-raised': '3px 3px 8px rgba(49, 55, 43, 0.10), -3px -3px 8px rgba(255, 255, 255, 0.9)',
        'neu-sm-pressed': 'inset 2px 2px 6px rgba(49, 55, 43, 0.12), inset -2px -2px 6px rgba(255, 255, 255, 0.9)',
        'botanical-glow': '0 8px 30px -4px rgba(49, 55, 43, 0.18)',
        'gold-glow': '0 0 20px -2px rgba(197, 168, 106, 0.35)',
        'cyan-glow': '0 0 20px -2px rgba(143, 191, 192, 0.35)',
        'slate-glow': '0 10px 30px -5px rgba(24, 35, 49, 0.45)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
