/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#38bdf8',
          text: '#f8fafc',
          muted: '#94a3b8'
        },
        alert: {
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#10b981',
          blue: '#3b82f6',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
