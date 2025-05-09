import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  plugins: [flowbite.plugin()],
  theme: {
    container: {
      center: true,
    },
    extend: {
      container: {
        padding: {
          DEFAULT: "0.5rem",
          sm: "0",
        },
      },
    },
  },
};
export default config;
