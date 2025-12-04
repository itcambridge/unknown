/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': '#020617',
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
        'neon-cyan': '#22d3ee',
        'neon-magenta': '#e879f9',
        'electric-lime': '#a3e635',
        'danger': '#f97373',
        'gray-200': '#e5e7eb',
        'gray-400': '#9ca3af',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 5px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
