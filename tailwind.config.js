// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.ts", "./src/**/*.tsx"],
  theme: {
    colors: {
      blue: '#1b2b40',
      red: '#d92b3a',
      white: '#c2c6cf',
      transparent: 'transparent',
    },
    borderRadius: {
      'none': "0px",
      '15': '15px',
      default: "20px",
    },
    fill: (theme) => ({
      current: "currentColor",
      bg: theme("colors.blue"),
      red: theme("colors.red"),
      white: theme("colors.white"),
      green: theme("colors.green"),
      transparent: theme("colors.transparent"),
    }),
    extend: {
      spacing: {
        "96": "24rem",
        "144": "36rem",
      },
      strokeWidth: {
        "15": "15",
      },
      screens: {
        'hovers': {'raw': '(hover: hover)'},
      },
    },
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/3': '33%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
    padding: ["responsive", "hover", "focus"],
    margin: ["responsive", "hover", "focus"],
    borderRadius: ["responsive", "hover", "focus"],
    height: ["responsive", "hover", "focus"],
    maxHeight: ['responsive', 'hover', 'focus'],
  },
  plugins: [
    require("tailwindcss-animatecss")({
      variants: ["responsive", "hover", "reduced-motion"],
    }),
  ],
};
