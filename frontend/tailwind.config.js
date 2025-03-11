/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#0f172a",
        secondary: "#4f46e5",
        status: {
          waiting: "#f59e0b",
          interview: "#10b981",
          rejected: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
