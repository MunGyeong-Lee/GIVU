/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5B61',
        cusRed: {
          DEFAULT: "rgb(255, 92, 92)",
          light: "rgb(255, 127, 127)",
        },
        cusPink: {
          DEFAULT: "rgb(255, 210, 210)",
          light: "rgb(255, 214, 214)",
        },
        cusBlue: {
          DEFAULT: "rgb(92, 157, 255)",
          light: "rgb(118, 177, 255)",
          lighter: "rgb(180,212,255)",
        },
        cusLightBlue: {
          DEFAULT: "rgb(182, 212, 253)",
          light: "rgb(200, 230, 255)",
          lighter: "rgb(242,247,255)",
        },
        cusGray: {
          dark: "rgb(225, 225, 225)",
          DEFAULT: "rgb(238,238,238)",
          light: "rgb(245,245,245)",
        },
        cusYellow: {
          DEFAULT: "rgb(255, 249, 163)",
          light: "rgb(255, 253, 218)",
        },
        cusBlack: {
          DEFAULT: "rgb(33, 33, 33)",
          light: "rgb(77, 77, 77)",
        },
        success: {
          DEFAULT: "rgb(128, 230, 98)",
        },
        error: {
          DEFAULT: "rgb(255, 92, 92)",
        },
        btnLightBlue: {
          DEFAULT: "rgb(207, 228, 255)",
          hover: "rgb(84, 158, 255)",
        },
        btnPink: {
          DEFAULT: "rgb(255, 231, 231)",
          hover: "rgb(252, 92, 92)",
        },
        btnYellow: {
          DEFAULT: "rgb(255, 253, 218)",
          hover: "rgb(255, 243, 71)",
        },
      },
      fontFamily: {
        paperlogy: ['Paperlogy', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [scrollbarHide],
} 