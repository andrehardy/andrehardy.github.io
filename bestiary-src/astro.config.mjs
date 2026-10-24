import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// The published site is the repository root. This project only rebuilds the
// bestiary and writes into the existing /magic-registry/bestiary/ tree so
// field reports, the journal, posters, and the rest of the registry stay put.
export default defineConfig({
  site: 'https://andrehardy.github.io',
  base: '/magic-registry/bestiary',
  outDir: fileURLToPath(new URL('../magic-registry/bestiary', import.meta.url)),
  emptyOutDir: false,
  trailingSlash: 'always',
  vite: {
    build: {
      // Astro 5 empties outDir unless this is explicitly false. The bestiary
      // shares its folder with field reports, the journal, posters, and glimpses.
      emptyOutDir: false,
    },
  },
  build: {
    assets: 'assets',
    format: 'directory',
  },
});
