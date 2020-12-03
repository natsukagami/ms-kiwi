// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.ts", "./src/**/*.tsx"],
  theme: {
    colors: {
      blue: "#121526",
      red: "#d92b3a",
      white: "#ffffff",
      green: "#008C21",
      transparent: "transparent",
      accent: "#F27979",
      secondary: "#BF457E",
      teritary: "#6A5A8C",
      darkyellow: "#734924",
    },
    borderRadius: {
      none: "0px",
      15: "15px",
      DEFAULT: "20px",
    },
    fill: (theme) => ({
      current: "currentColor",
      bg: theme("colors.blue"),
      red: theme("colors.red"),
      white: theme("colors.white"),
      green: theme("colors.green"),
      transparent: theme("colors.transparent"),
      teritary: theme("colors.teritary"),
    }),
    extend: {
      spacing: {
        96: "24rem",
        144: "36rem",
      },
      strokeWidth: {
        15: "15",
      },
      screens: {
        hovers: { raw: "(hover: hover)" },
      },
    },
    maxHeight: {
      0: "0",
      "1/4": "25%",
      "1/3": "33%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
    padding: ["responsive", "hover", "focus"],
    margin: ["responsive", "hover", "focus"],
    borderRadius: ["responsive", "hover", "focus"],
    height: ["responsive", "hover", "focus"],
    maxHeight: ["responsive", "hover", "focus"],
  },
  plugins: [
    require("tailwindcss-animatecss")({
      variants: ["responsive", "hover", "reduced-motion"],
    }),
  ],
};
