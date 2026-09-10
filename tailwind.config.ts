import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Semantic color palette
      // -----------------------------------------------------------------------
      colors: {
        background:       '#FAF8F5',
        surface:          '#FFFFFF',
        'surface-subtle': '#F5F1EB',
        foreground:       '#242424',
        muted:            '#736E65',
        accent:           '#B88A58',
        'accent-hover':   '#A37747',
        trust:            '#879788',
        border:           '#EBE6DE',
      },

      // -----------------------------------------------------------------------
      // Typography
      // -----------------------------------------------------------------------
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        jakarta:  ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },

      // -----------------------------------------------------------------------
      // Border radius
      // -----------------------------------------------------------------------
      borderRadius: {
        card:   '12px',
        dialog: '16px',
      },

      // -----------------------------------------------------------------------
      // Box shadows
      // -----------------------------------------------------------------------
      boxShadow: {
        card:          '0 2px 20px rgba(36, 36, 36, 0.06)',
        floating:      '0 8px 40px rgba(36, 36, 36, 0.12)',
        'accent-ring': '0 0 0 3px rgba(184, 138, 88, 0.25)',
      },

      // -----------------------------------------------------------------------
      // Custom keyframes
      // -----------------------------------------------------------------------
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // -----------------------------------------------------------------------
      // Animation utilities
      // -----------------------------------------------------------------------
      animation: {
        shimmer:           'shimmer 2s linear infinite',
        'fade-up':         'fadeUp 0.5s ease-out forwards',
        'slide-in-right':  'slideInRight 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in':        'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
