/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: '#00f5ff',
          purple: '#b300ff',
          green: '#00ff41',
          red: '#ff0040',
          orange: '#ff8c00',
          pink: '#ff006e',
          yellow: '#ffff00',
          dark: '#0a0a0a',
          darker: '#050505',
        },
        mining: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          primary: '#1e40af',
          secondary: '#0ea5e9',
          accent: '#f59e0b',
          danger: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          dark: '#1f2937',
          light: '#f8fafc'
        },
        status: {
          running: '#10b981',
          idle: '#f59e0b',
          maintenance: '#ef4444',
          loading: '#f97316',
          hauling: '#3b82f6',
          dumping: '#8b5cf6'
        },
        neon: {
          blue: '#00f5ff',
          green: '#39ff14',
          pink: '#ff073a',
          purple: '#bf00ff',
          orange: '#ff9500',
          yellow: '#ffff00',
        }
      },
      fontFamily: {
        sans: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Orbitron', 'Courier New', 'monospace'],
        cyber: ['Orbitron', 'monospace'],
      },
      boxShadow: {
        'mining': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mining-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mining-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 245, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(179, 0, 255, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'glow-yellow': '0 0 20px rgba(255, 255, 0, 0.5)',
        'cyber': '0 0 30px rgba(0, 245, 255, 0.3)',
        'cyber-lg': '0 0 50px rgba(0, 245, 255, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'cyber-scan': 'cyber-scan 3s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 4s linear infinite',
        'hologram': 'hologram-flicker 2s ease-in-out infinite',
        'data-flow': 'data-flow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 245, 255, 0.6)' },
        },
        'cyber-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'hologram-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(20px)', opacity: '0' },
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        'hologram': 'linear-gradient(45deg, rgba(0, 245, 255, 0.1), rgba(179, 0, 255, 0.1))',
        'neon-glow': 'radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
