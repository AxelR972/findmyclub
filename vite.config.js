/// <reference types="vitest/config" /> 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    globals: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
      }
    },
  },
});
