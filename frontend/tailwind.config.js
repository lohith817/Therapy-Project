/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef7f6",
          100: "#d6ece9",
          500: "#2f8f86",
          600: "#25746c",
          700: "#1d5b55",
        },
      },
    },
  },
  plugins: [],
};
