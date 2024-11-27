import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, UserConfig, UserConfigExport } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default (config: UserConfig): UserConfigExport => {
  const mode = config.mode as string;
  return defineConfig({
    base: "./",
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,
            title: ""
          },
          tags: [
            {
              injectTo: "body-prepend",
              tag: "div",
              attrs: {
                id: "tag"
              }
            }
          ]
        }
      }),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, "src/assets/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    build: {
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/
      },
      rollupOptions: {
        output: {
          manualChunks: {
            quill: ["quill"],
            lodash: ["lodash"],
            vlib: ["vue", "vue-router", "element-plus"]
          }
        }
      },
      // 生产环境取消 console
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    resolve: {
      alias: {
        // 配置别名
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      open: false, // 自动启动浏览器
      host: "0.0.0.0", // localhost
      port: 8011, // 端口号
      hmr: { overlay: false },
      proxy: {
        "/api/file": {
          target: loadEnv(mode, process.cwd()).VITE_APP_API_IMG_FILE, // 目标地址
          changeOrigin: false, // 是否改变来源
          rewrite: (path) => path.replace(/^\/api\/file/, "") // 去掉 /api/file 前缀
        },
        "/api": {
          target: loadEnv(mode, process.cwd()).VITE_APP_API, // 目标地址
          changeOrigin: false, // 是否改变来源
          rewrite: (path) => path.replace(/^\/api/, "") // 去掉 /api 前缀
        }
      }
    }
  });
};
