import { defineConfig } from 'rollup'
import tsPlugin from '@rollup/plugin-typescript'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      file: 'lib/index.js',
    },
    plugins: [
      tsPlugin({
        tsconfig: './tsconfig.json',
        outDir: './',
      }),
    ],
  },
])
