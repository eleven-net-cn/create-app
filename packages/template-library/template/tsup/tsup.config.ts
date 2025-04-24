import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: false,
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
});
