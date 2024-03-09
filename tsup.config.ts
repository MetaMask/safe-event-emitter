import { defineConfig } from 'tsup';

export default defineConfig({
  // The entry to bundle.
  entry: [
    'index.ts',
  ],

  // The output formats. We want to generate both CommonJS and ESM bundles.
  // https://tsup.egoist.dev/#bundle-formats
  format: ['cjs', 'esm'],

  // Generate sourcemaps as separate files.
  // https://tsup.egoist.dev/#generate-sourcemap-file
  sourcemap: true,

  // Clean the dist folder before bundling.
  clean: true,

  // Hide unnecessary logs from the console. Warnings and errors will still be
  // shown.
  silent: true,
});
