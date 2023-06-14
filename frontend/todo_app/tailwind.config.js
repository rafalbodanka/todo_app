/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Roboto': 'Roboto',
      },
      fontWeight: {
        '100': '100',
        '400': '400',
        '500': '500',
        '700': '700',
      },
      fontSize: {
        '10': '10px'
      },
      borderWidth: {
        '1': '1px',
      },
      minWidth: {
        '1': '150px',
        '2': '300px',
      },
      maxWidth: {
        '2': '300px',
      },
      width: {
        '300': '300px'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

