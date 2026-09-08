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
        primary: "#1D1D1F",
        accent: {
          DEFAULT: "#2997FF",
          1: "#0066CC",
          2: "#0071E3",
          3: "#5E7EAF",
        },
        canvas: "#FFFFFF",
        surface: "#F5F5F7",
        "on-primary": "#FFFFFF",
        ink: "#000000",
        body: "#1D1D1F",
        muted: "#6E6E73",
        faint: "#F5F5F7",
        neutral: {
          1: "#333336",
          2: "#D2D2D7",
        },
      },
      borderRadius: {
        xs: "8px",
        sm: "11px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        apple: "980px",
      },
      height: {
        nav: "44px",
      },
    },
  },
  plugins: [],
};
export default config;
