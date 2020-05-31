// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.ts", "./src/**/*.tsx"],
  theme: {
    fill: (theme) => ({
      current: "currentColor",
      bg: theme("colors.blue.900"),
    }),
    extend: {
      spacing: {
        "96": "24rem",
        "144": "36rem",
      },
      strokeWidth: {
        "15": "15",
      },
    },
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
    padding: ["responsive", "hover", "focus"],
    margin: ["responsive", "hover", "focus"],
    borderRadius: ["responsive", "hover", "focus"],
    height: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
