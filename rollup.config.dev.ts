import { defineConfig } from 'rollup'
import tsPlugin from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'module',
    file: 'dist/index.js',
  },
  watch: {
    include: './src/**/*.ts',
  },
  plugins: [
    tsPlugin({
      tsconfig: './tsconfig.json',
      outDir: './',
    }),
  ],
})
