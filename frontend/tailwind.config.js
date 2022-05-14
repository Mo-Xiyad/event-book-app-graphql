module.exports = {
  content: [
    "./src/**/*.{js,jsx,md,mdx}",
    "./pages/**/*.{html,js,tsx}",
    "./components/**/*.{html,js,tsx,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        quaternary: "var(--quaternary)",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/typography")({
    //   className: "wysiwyg",
    // }),
  ],
};
