/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        myGreen: "#60D174",
        myGray: "#D3D3D3",
        myWhite:"#FEFEFE",
        myBackGround: "#F5F5F5",
        myBlue: "#728FC4"
      },
    },
  },
  plugins: [],
}