/// <reference types='vitest' />
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import electron from 'vite-plugin-electron';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/admin-dashboard',
  server: {
    port: 4201,
    host: 'localhost',
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },
  base: process.env.VITE_IS_ELECTRON_APP ? './' : '/',
  clearScreen: true,
  assetsInclude: /\.(pdf|jpg|png|svg)$/,
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    vue(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    process.env.VITE_IS_ELECTRON_APP
      ? electron([
          {
            entry: path.join(__dirname, 'electron/main.ts'),
            vite: {
              build: {
                sourcemap: true,
                outDir: '../../dist/apps/admin-dashboard/electron/main',
              },
            },
          },

          {
            entry: path.join(__dirname, 'electron/preload.ts'),
            vite: {
              build: {
                sourcemap: 'inline',
                outDir: '../../dist/apps/admin-dashboard/electron/preload',
              },
            },
            onstart(options) {
              options.reload();
            },
          },
        ])
      : null,
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/admin-dashboard',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
