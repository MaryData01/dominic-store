/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    '#0A0A0F',
          surface: '#12121A',
          raised:  '#1A1A26',
          border:  '#252535',
        },
        brand: {
          cyan:    '#00D4FF',
          violet:  '#7C3AED',
          glow:    '#00D4FF26',
        },
        text: {
          primary:  '#F0F0FF',
          secondary:'#8888AA',
          muted:    '#44445A',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error:   '#EF4444',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
