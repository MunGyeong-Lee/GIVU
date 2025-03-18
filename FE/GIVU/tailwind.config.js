/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5B61',
        // 필요하다면 여기에 더 많은 색상을 추가할 수 있습니다
        // secondary: '#색상코드',
        // accent: '#색상코드',
        // 등등...
      },
    },
  },
  plugins: [],
} 