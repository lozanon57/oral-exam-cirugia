/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // High-contrast clinical palette
        exam: {
          bg: '#0b1220',
          panel: '#121b2e',
          panel2: '#1a2740',
          border: '#26324d',
          accent: '#3b82f6',
          accentHover: '#2563eb',
          danger: '#ef4444',
          ok: '#22c55e',
        },
      },
      keyframes: {
        pulsering: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        pulsering: 'pulsering 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
