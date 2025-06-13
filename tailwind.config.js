/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eve-orange': '#FF6600',
        'eve-dark': '#0A0A0A',
        'eve-gray': '#1A1A1A',
        'eve-border': '#333333',
      },
      fontFamily: {
        'mono': ['Orbitron', 'Courier New', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'bold': '700',
        'black': '900',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.05em',
        'wider': '0.08em',        // Increased from 0.05em
        'widest': '0.12em',       // Increased from 0.1em
        'ultra-wide': '0.25em',   // Increased from 0.15em
        'super-wide': '0.3em',    // New maximum spacing
        'space': '0.35em',        // Increased from 0.2em
      },
    },
  },
  plugins: [],
}