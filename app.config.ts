import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
  server: {
    // Nitro preset is chosen at deploy time via NITRO_PRESET, defaults to "node-server".
    preset: process.env.NITRO_PRESET ?? "node-server",
  },
});
