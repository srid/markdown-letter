import { readFileSync } from 'fs';
import { join } from 'path';

// Dynamically generate safelist from authors.json
function generateSafelist() {
  const authorsPath = join(process.cwd(), 'src/config/authors.json');
  const authors = JSON.parse(readFileSync(authorsPath, 'utf-8'));
  
  const safelist = [];
  for (const author of Object.values(authors)) {
    safelist.push(author.borderColor, author.bgColor, author.textColor);
  }
  
  return safelist;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  safelist: generateSafelist(),
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            '[class~="lead"]': {
              color: '#4b5563',
            },
            a: {
              color: '#059669',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}