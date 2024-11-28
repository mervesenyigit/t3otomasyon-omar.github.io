import { defineConfig } from 'vite';

export default defineConfig({
  base: '/noty/',
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'firebase-messaging-sw.js'
      ],
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});
