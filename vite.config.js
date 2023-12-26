import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      supported: { 
        bigint: true 
      },
    }
  },
  build: {
    target: ["esnext"], 
  }
})
