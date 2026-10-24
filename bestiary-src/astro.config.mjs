import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// The published site is the repository root. This project only rebuilds the
// bestiary and writes into the existing /magic-registry/bestiary/ tree so
// field reports, the journal, posters, and the rest of the registry stay put.
//
// GitHub Pages builds this branch with Jekyll, which drops any file whose name
// starts with "_". Astro names the shared stylesheet after the [slug] route,
// which prettifies to "_slug_". Strip that prefix so the file is published
// even if Jekyll is turned back on.
function pagesSafeBase(name) {
  const base = String(name ?? 'asset')
    .replace(/\.(css|js|mjs|map)$/i, '')
    .replace(/^_+|_+$/g, '');
  return base || 'asset';
}

/** Server chunks are removed after prerender. Keep them as .mjs so they are not published. */
function isServerChunk(chunk) {
  return (chunk.moduleIds ?? []).some(
    (id) => id.endsWith('.astro') || id.includes('/node_modules/astro/'),
  );
}

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
      rollupOptions: {
        output: {
          entryFileNames(chunk) {
            return `assets/${pagesSafeBase(chunk.name)}.[hash].js`;
          },
          chunkFileNames(chunk) {
            if (isServerChunk(chunk)) {
              const safe = pagesSafeBase(chunk.name).replaceAll('/', '-');
              return `chunks/${safe}_[hash].mjs`;
            }
            return `assets/${pagesSafeBase(chunk.name)}.[hash].js`;
          },
          assetFileNames(asset) {
            const raw = asset.names?.[0] ?? asset.name ?? 'asset';
            return `assets/${pagesSafeBase(raw)}.[hash][extname]`;
          },
        },
      },
    },
  },
  build: {
    assets: 'assets',
    format: 'directory',
  },
});
