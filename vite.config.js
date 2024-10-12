import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import svgLoader from 'vite-svg-loader';

export default ({ mode }) => {
  const { VITE_PORT, VITE_BASE_URL } = loadEnv(mode, process.cwd());
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: VITE_BASE_URL,
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      svgLoader(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [PrimeVueResolver()],
        eslintrc: {
          enabled: true,
        },
        dts: true,
      }),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      include: ['mitt', 'dayjs', 'axios', 'pinia', '@vueuse/core'],
      exclude: ['@iconify-icons/lets-icons'],
    },
    server: {
      port: VITE_PORT,
      host: '0.0.0.0',
      open: false,
      cors: true,
      proxy: {},
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    build: {
      target: 'es2015',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          compact: true,
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },
  });
};
