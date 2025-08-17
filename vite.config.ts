import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
/// <reference types='vitest' />
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  preview: {
    port: 3000,
    strictPort: true,
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
