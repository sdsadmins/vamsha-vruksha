import type { Config } from "tailwindcss";
export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: { 950:"#061410", 900:"#0D2B1E", 800:"#1B4332", 700:"#2D6A4F", 600:"#40916C", 500:"#52B788", 400:"#74C69D", 300:"#95D5B2", 200:"#B7E4C7", 100:"#D8F3DC", 50:"#F0FBF4" },
        gold: { 900:"#6B4226", 800:"#8B5E3C", 700:"#A67C52", 600:"#C49A6C", 500:"#D4AF7A", 400:"#E4C999", 300:"#F0DDBA", 200:"#F7EDDA", 100:"#FBF6EE" },
        cream: { DEFAULT:"#FAF7F2", dark:"#F0E6D3", darker:"#E8D5BC" },
      },
      fontFamily: {
        serif: ['"Playfair Display"','Georgia','serif'],
        sans: ['"Inter"','system-ui','sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 32px rgba(27,67,50,0.12), 0 1px 4px rgba(27,67,50,0.08)',
        'premium-lg': '0 8px 64px rgba(27,67,50,0.16), 0 2px 8px rgba(27,67,50,0.10)',
        'gold': '0 4px 24px rgba(166,124,82,0.20)',
        'inner-forest': 'inset 0 2px 8px rgba(27,67,50,0.15)',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #0D2B1E 0%, #1B4332 50%, #2D6A4F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #A67C52 0%, #D4AF7A 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FAF7F2 0%, #F0E6D3 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 70% 50%, #2D6A4F22 0%, transparent 60%), linear-gradient(180deg, #FAF7F2 0%, #F0E6D3 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'draw-line': 'drawLine 1.2s ease-in-out forwards',
        'node-pop': 'nodePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%':{ opacity:'0', transform:'translateY(24px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        fadeIn: { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        drawLine: { '0%':{ strokeDashoffset:'1000' }, '100%':{ strokeDashoffset:'0' } },
        nodePop: { '0%':{ opacity:'0', transform:'scale(0.3)' }, '100%':{ opacity:'1', transform:'scale(1)' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        pulseSoft: { '0%,100%':{ opacity:'1' }, '50%':{ opacity:'0.6' } },
        float: { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
