/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Roboto: "Roboto",
      },
      fontWeight: {
        100: "100",
        400: "400",
        500: "500",
        700: "700",
      },
      fontSize: {
        10: "10px",
      },
      borderWidth: {
        1: "1px",
      },
      minWidth: {
        1: "150px",
        2: "300px",
      },
      maxWidth: {
        2: "300px",
      },
      width: {
        300: "300px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
});
