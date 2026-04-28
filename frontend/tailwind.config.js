/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { nunito: ["Nunito", "sans-serif"] },
      colors: {
        primary: "#58CC02",
        "primary-dark": "#46a802",
        danger: "#FF4B4B",
        warning: "#FF9600",
      },
    },
  },
  plugins: [],
}
