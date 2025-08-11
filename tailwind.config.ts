import { shadcnPreset } from "shadcn-svelte/tailwind";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/shadcn-svelte/**/*.{js,svelte,ts}"
  ],
  presets: [shadcnPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
