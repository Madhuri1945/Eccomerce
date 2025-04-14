module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For Next.js 13+ (app directory)
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "1500px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: "hsl(var(--secondary))",
      },
    },
  },
  plugins: [],
};
