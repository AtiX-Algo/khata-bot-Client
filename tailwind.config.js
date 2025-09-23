import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all React component files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui, // Enable daisyUI
  ],
  // Optional: Add daisyUI themes if you want
  daisyui: {
    themes: ["cupcake", "dark", "cmyk"],
  },
}