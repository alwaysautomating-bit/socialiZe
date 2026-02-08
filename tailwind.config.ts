import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1A1A1A',
        'warm-ivory': '#FDFCF0',
        'paper-line': '#E5E4D3',
        'edit-red': '#C0392B',
        'edit-red-light': '#FCEAEA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [animate],
} satisfies Config;
