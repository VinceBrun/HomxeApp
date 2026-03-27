/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./App.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        './node_modules/nativewind/dist/**/*.{js,ts,jsx,tsx}',
        './node_modules/nativewind/**/*.{js,ts,jsx,tsx}',
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['PoppinsRegular', 'sans-serif'],
          poppinsSemi: ['PoppinsSemibold', 'sans-serif'],
          poppinsBold: ['PoppinsBold', 'sans-serif'],
          poppinsBlack: ['PoppinsBlack', 'sans-serif'],
          poppinsExtraBold: ['PoppinsExtraBold', 'sans-serif'],
          poppinsExtraLight: ['PoppinsExtraLight', 'sans-serif'],
          poppinsLight: ['PoppinsLight', 'sans-serif'],
          poppinsMedium: ['PoppinsMedium', 'sans-serif'],
          poppinsThin: ['PoppinsThin', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }