import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderColor: {
        'border': 'hsl(var(--border))',
      },
      backgroundColor: {
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
      },
      textColor: {
        'foreground': 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
};

export default config;

