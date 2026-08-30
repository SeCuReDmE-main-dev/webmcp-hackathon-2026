import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: process.cwd(),
  resolve: { preserveSymlinks: true },
  server: {
    // The hackathon checkout lives on a mapped Windows volume. Native file
    // watching on that volume can terminate Vite with UNKNOWN/watch errors.
    watch: process.platform === 'win32' ? { usePolling: true, interval: 250 } : undefined
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 15_000
  }
})
