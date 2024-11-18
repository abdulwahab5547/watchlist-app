import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0D0D0D",
        lessBlack: "#181818",
        gray: "#181818",
        lightGray: "#e5e5e5",
        orange: "#FF4B4C",
      },
    },
  },
  plugins: [],
};
export default config;