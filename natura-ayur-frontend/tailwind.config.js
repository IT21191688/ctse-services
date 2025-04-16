/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          // Custom color palette for NaturaAyur
          primary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          // Add more custom colors as needed
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
          mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
        },
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
        },
        boxShadow: {
          'outline': '0 0 0 3px rgba(34, 197, 94, 0.5)',
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'bounce-slow': 'bounce 3s infinite',
        },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.gray.800'),
              a: {
                color: theme('colors.primary.600'),
                '&:hover': {
                  color: theme('colors.primary.700'),
                },
              },
              'h1, h2, h3, h4, h5, h6': {
                color: theme('colors.gray.900'),
              },
            },
          },
        }),
        zIndex: {
          '-10': '-10',
          '60': '60',
          '70': '70',
        },
        transitionDuration: {
          '2000': '2000ms',
          '3000': '3000ms',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }