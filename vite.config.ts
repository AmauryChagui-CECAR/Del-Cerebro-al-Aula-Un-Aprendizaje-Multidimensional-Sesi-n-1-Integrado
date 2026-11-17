import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function restoreViteModuleEntry(): Plugin {
  return {
    name: 'restore-vite-module-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(
          /<!-- GH_PAGES_STATIC_START -->[\s\S]*?<!-- GH_PAGES_STATIC_END -->/,
          '<script type="module" src="/src/main.tsx"></script>'
        );
      },
    },
  };
}

export default defineConfig(() => {
  const isPagesBundle = process.env.GH_PAGES_BUNDLE === 'true';

  return {
    base: './',
    plugins: [restoreViteModuleEntry(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: isPagesBundle
      ? {
          outDir: 'docs',
          emptyOutDir: true,
          rollupOptions: {
            output: {
              entryFileNames: 'assets/app.js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  return 'assets/style.css';
                }
                return 'assets/[name][extname]';
              },
            },
          },
        }
      : undefined,
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
