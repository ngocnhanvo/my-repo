// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
//import cloudProviderFetchAdapter from "@wix/cloud-provider-fetch-adapter";
//import wix from "@wix/astro";
//import monitoring from "@wix/monitoring-astro";
import react from "@astrojs/react";
import sourceAttrsPlugin from "@wix/babel-plugin-jsx-source-attrs";
import dynamicDataPlugin from "@wix/babel-plugin-jsx-dynamic-data";
import customErrorOverlayPlugin from "./vite-error-overlay-plugin.js";
import postcssPseudoToData from "@wix/postcss-pseudo-to-data";
//import cloudflare from "@astrojs/cloudflare";
import { loadEnv } from 'vite';

// Load biến môi trường
const { WC_URL } = loadEnv(process.env.NODE_ENV?? "development", process.cwd(), "");

// Bóc tách hostname (ví dụ từ http://127.0.0.1:10010 thành 127.0.0.1)
const wpHost = WC_URL ? new URL(WC_URL).hostname : '';

const isBuild = process.env.NODE_ENV == "production";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    {
      name: "framewire",
      hooks: {
        "astro:config:setup": ({ injectScript, command }) => {
          if (command === "dev") {
            injectScript(
              "page",
              `import loadFramewire from "framewire.js";
              loadFramewire(true);`
            );
          }
        },
      },
    },
    tailwind(),
    // wix({
    //   htmlEmbeds: isBuild,
    //   auth: false,
    // }),
    // ...(isBuild ? [monitoring()] : []),
    react(isBuild ? {} : {
      babel: { plugins: [sourceAttrsPlugin, dynamicDataPlugin] },
    }),
    // Hook di chuyển ảnh từ public/images/ vào dist/images/ sau khi build xong
    {
      name: "move-wp-images",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          if (!isBuild) return; // Chỉ chạy khi build, không chạy khi dev
          
          const { existsSync, mkdirSync, readdirSync, copyFileSync, unlinkSync, rmdirSync } = await import('fs');
          const { fileURLToPath } = await import('url');

          const srcDir = 'public/images';
          const destDir = fileURLToPath(new URL('images/', dir));

          if (!existsSync(srcDir)) {
            console.log('⚠️ public/images/ không tồn tại, bỏ qua.');
            return;
          }

          if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

          for (const file of readdirSync(srcDir)) {
            copyFileSync(`${srcDir}/${file}`, `${destDir}/${file}`);
            unlinkSync(`${srcDir}/${file}`);
            console.log(`✅ Moved: ${file}`);
          }

          // Xóa folder public/images/ sau khi move xong
          rmdirSync(srcDir);
          console.log('🧹 Đã dọn sạch public/images/');
        }
      }
    }
  ],
  vite: {
    plugins: [customErrorOverlayPlugin()],
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'framer-motion',
        'date-fns',
        'clsx',
        'class-variance-authority',
        'tailwind-merge',
        '@radix-ui/*',
        //'@wix/*',
        'zod',
      ],
      exclude: [
        '@wix/image-kit',
        '@wix/astro',
        '@wix/*',
      ],
    },
    css: !isBuild ? {
      postcss: {
        plugins: [
          postcssPseudoToData(),
        ],
      },
    } : undefined,
  },
  //...(isBuild && { adapter: cloudProviderFetchAdapter({}) }),
  // 2. Chỉ sử dụng duy nhất dòng này ở cuối hoặc trong defineConfig
  //adapter: cloudflare(),
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: [wpHost],
  },
  server: {
    allowedHosts: true,
    host: true,
  },
  security: {
    checkOrigin: false
  }
});
