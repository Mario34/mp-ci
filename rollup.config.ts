import { defineConfig } from 'rollup'
import tsPlugin from '@rollup/plugin-typescript'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/cjs',
      format: 'commonjs',
    },
    plugins: [
      tsPlugin({
        tsconfig: './tsconfig.json',
        outDir: './lib/cjs',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/esm',
      format: 'module',
    },
    plugins: [
      tsPlugin({
        tsconfig: './tsconfig.json',
        outDir: './lib/esm',
      }),
    ],
  },
])
