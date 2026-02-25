import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  banner: ({ format }) => {
    if (format === 'esm') return { js: '' };
    return {};
  },
});
