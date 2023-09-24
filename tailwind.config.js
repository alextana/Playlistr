/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        playlistr: {
          "primary": "#A3E635",
          "secondary": "#4338ca",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "synthwave",
      "dark",
      "cupcake",
    ],
  },
  theme: {
    extend: {},
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  plugins: [require("daisyui")],
}

