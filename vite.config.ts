import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// @types/node を導入せずに、ビルド時の環境変数だけを型安全に参照する最小宣言。
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  plugins: [react()],
  // GitHub Pages はリポジトリ名のサブパスで配信するため base が必要。
  // Netlify と Cloudflare Pages はルート(/)配信なので、それぞれのビルド時(NETLIFY / CF_PAGES)は "/" にする。
  base: process.env.NETLIFY || process.env.CF_PAGES ? "/" : "/okinawa-history-quiz/",
  build: {
    // MapLibre is loaded only when the history map opens; keep its isolated vendor chunk explicit.
    chunkSizeWarningLimit: 1100,
  },
  test: {
    environment: "jsdom",
  },
});
