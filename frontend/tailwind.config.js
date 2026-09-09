/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          950: '#070b19',
          900: '#0c132c',
          850: '#111a3d',
          800: '#16234d',
          700: '#233878',
          600: '#3452b0',
          500: '#4f70e8',
          400: '#718ff0',
          300: '#9cb1f7',
          cyan: '#06d6a0',
          teal: '#00f5d4',
          neon: '#7b2cbf',
          purple: '#9d4edd'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
