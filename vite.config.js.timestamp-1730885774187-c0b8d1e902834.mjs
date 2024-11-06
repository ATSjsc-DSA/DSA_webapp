// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import vue from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Icons from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/unplugin-icons/dist/resolver.mjs";
import AutoImport from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/unplugin-vue-components/dist/vite.mjs";
import { PrimeVueResolver } from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import svgLoader from "file:///D:/ATS%20-%20d%E1%BB%B1%20%C3%A1n%20kh%C3%A1c/ATS-DSA/DSA_webapp/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "D:\\ATS - d\u1EF1 \xE1n kh\xE1c\\ATS-DSA\\DSA_webapp";
var vite_config_default = ({ mode }) => {
  const { VITE_PORT, VITE_BASE_URL } = loadEnv(mode, process.cwd());
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: VITE_BASE_URL,
    plugins: [
      vue({
        script: {
          defineModel: true
        }
      }),
      svgLoader(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [PrimeVueResolver()],
        eslintrc: {
          enabled: true
        },
        dts: true
      }),
      Components({
        resolvers: [PrimeVueResolver()]
      }),
      Icons({
        autoInstall: true
      })
    ],
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      // Thêm dòng này
    },
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src")
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve("src/style/variables.less")}";`
          },
          math: "strict",
          javascriptEnabled: true
        }
      }
    },
    optimizeDeps: {
      include: ["mitt", "dayjs", "axios", "pinia", "@vueuse/core"],
      exclude: ["@iconify-icons/lets-icons"]
    },
    server: {
      port: VITE_PORT,
      host: "0.0.0.0",
      open: false,
      cors: true,
      proxy: {},
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    build: {
      target: "es2015",
      sourcemap: false,
      chunkSizeWarningLimit: 2e3,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          entryFileNames: "static/js/[name]-[hash].js",
          chunkFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          compact: true,
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"]
          }
        }
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBVFMgLSBkXHUxRUYxIFx1MDBFMW4ga2hcdTAwRTFjXFxcXEFUUy1EU0FcXFxcRFNBX3dlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQVRTIC0gZFx1MUVGMSBcdTAwRTFuIGtoXHUwMEUxY1xcXFxBVFMtRFNBXFxcXERTQV93ZWJhcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FUUyUyMC0lMjBkJUUxJUJCJUIxJTIwJUMzJUExbiUyMGtoJUMzJUExYy9BVFMtRFNBL0RTQV93ZWJhcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IFByaW1lVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCB7IFZJVEVfUE9SVCwgVklURV9CQVNFX1VSTCB9ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogVklURV9CQVNFX1VSTCxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKHtcclxuICAgICAgICBzY3JpcHQ6IHtcclxuICAgICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBzdmdMb2FkZXIoKSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxyXG4gICAgICAgIHJlc29sdmVyczogW1ByaW1lVnVlUmVzb2x2ZXIoKV0sXHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdHM6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICByZXNvbHZlcnM6IFtQcmltZVZ1ZVJlc29sdmVyKCldLFxyXG4gICAgICB9KSxcclxuICAgICAgSWNvbnMoe1xyXG4gICAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19WVUVfT1BUSU9OU19BUElfXzogdHJ1ZSxcclxuICAgICAgX19WVUVfUFJPRF9ERVZUT09MU19fOiBmYWxzZSxcclxuICAgICAgX19WVUVfUFJPRF9IWURSQVRJT05fTUlTTUFUQ0hfREVUQUlMU19fOiBmYWxzZSwgLy8gVGhcdTAwRUFtIGRcdTAwRjJuZyBuXHUwMEUweVxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBsZXNzOiB7XHJcbiAgICAgICAgICBtb2RpZnlWYXJzOiB7XHJcbiAgICAgICAgICAgIGhhY2s6IGB0cnVlOyBAaW1wb3J0IChyZWZlcmVuY2UpIFwiJHtyZXNvbHZlKCdzcmMvc3R5bGUvdmFyaWFibGVzLmxlc3MnKX1cIjtgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hdGg6ICdzdHJpY3QnLFxyXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogWydtaXR0JywgJ2RheWpzJywgJ2F4aW9zJywgJ3BpbmlhJywgJ0B2dWV1c2UvY29yZSddLFxyXG4gICAgICBleGNsdWRlOiBbJ0BpY29uaWZ5LWljb25zL2xldHMtaWNvbnMnXSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogVklURV9QT1JULFxyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICBjb3JzOiB0cnVlLFxyXG4gICAgICBwcm94eToge30sXHJcbiAgICAgIHdhcm11cDoge1xyXG4gICAgICAgIGNsaWVudEZpbGVzOiBbJy4vaW5kZXguaHRtbCcsICcuL3NyYy97dmlld3MsY29tcG9uZW50c30vKiddLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXHJcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcclxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnc3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXHJcbiAgICAgICAgICBjb21wYWN0OiB0cnVlLFxyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIHZ1ZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9KTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVSxTQUFTLGNBQWMsZUFBZTtBQUM1VyxTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHdCQUF3QjtBQUNqQyxPQUFPLGVBQWU7QUFSdEIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLFFBQU0sRUFBRSxXQUFXLGNBQWMsSUFBSSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFDaEUsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxTQUFPLGFBQWE7QUFBQSxJQUNsQixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsUUFDRixRQUFRO0FBQUEsVUFDTixhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsVUFBVTtBQUFBLE1BQ1YsV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sY0FBYyxPQUFPO0FBQUEsUUFDdEMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO0FBQUEsUUFDOUIsVUFBVTtBQUFBLFVBQ1IsU0FBUztBQUFBLFFBQ1g7QUFBQSxRQUNBLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztBQUFBLE1BQ2hDLENBQUM7QUFBQSxNQUNELE1BQU07QUFBQSxRQUNKLGFBQWE7QUFBQSxNQUNmLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixxQkFBcUI7QUFBQSxNQUNyQix1QkFBdUI7QUFBQSxNQUN2Qix5Q0FBeUM7QUFBQTtBQUFBLElBQzNDO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQy9CO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osWUFBWTtBQUFBLFlBQ1YsTUFBTSw4QkFBOEIsUUFBUSwwQkFBMEIsQ0FBQztBQUFBLFVBQ3pFO0FBQUEsVUFDQSxNQUFNO0FBQUEsVUFDTixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsUUFBUSxTQUFTLFNBQVMsU0FBUyxjQUFjO0FBQUEsTUFDM0QsU0FBUyxDQUFDLDJCQUEyQjtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPLENBQUM7QUFBQSxNQUNSLFFBQVE7QUFBQSxRQUNOLGFBQWEsQ0FBQyxnQkFBZ0IsNEJBQTRCO0FBQUEsTUFDNUQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCx1QkFBdUI7QUFBQSxNQUN2QixzQkFBc0I7QUFBQSxNQUN0QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixTQUFTO0FBQUEsVUFDVCxjQUFjO0FBQUEsWUFDWixLQUFLLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxVQUNwQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
