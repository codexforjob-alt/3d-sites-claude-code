import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5181, host: '127.0.0.1' },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // GSAP and Lenis change on their own release cadence; keeping them in
        // their own chunk means editing copy or tokens does not invalidate a
        // cached vendor bundle for returning visitors.
        manualChunks: { motion: ['gsap', 'lenis'] },
      },
    },
  },
});
