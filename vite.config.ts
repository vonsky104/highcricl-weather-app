import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
/// <reference types='vitest' />
/// <reference types="vite/client" />
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  preview: {
    port: 3000,
    strictPort: true,
  },
  // @ts-expect-error - viteConfig typing error
  test: {
    globals: true,
    environment: "jsdom",
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:3001",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
