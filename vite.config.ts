import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/okinawa-history-quiz/",
  build: {
    // MapLibre is loaded only when the history map opens; keep its isolated vendor chunk explicit.
    chunkSizeWarningLimit: 1100,
  },
  test: {
    environment: "jsdom",
  },
});
