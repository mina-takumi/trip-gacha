import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages では https://<user>.github.io/<repo>/ の下に置かれるため、参照はすべて相対パスにする
  base: './',
  server: { port: 5173, strictPort: true },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'トリップガチャ',
        short_name: 'トリップガチャ',
        lang: 'ja',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#F4EDE0',
        theme_color: '#F4EDE0',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // 画面・プログラム・カードの絵・地図のデータを端末に保存し、電波がなくても起動できるようにする
        globPatterns: ['**/*.{html,js,css,webp,png,json}'],
        // 細い道のデータ(約1MB)も保存できるよう、1ファイルの上限を広げる
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // 日本語の書体は細かいファイルに分かれていて、全部だと数MBになる。最初に全部は保存せず、
        // 画面で使った分だけを保存する(2回目からは電波がなくても同じ書体で表示できる)
        runtimeCaching: [{
          urlPattern: ({ request }) => request.destination === 'font',
          handler: 'CacheFirst',
          options: { cacheName: 'fonts', expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 } },
        }],
      },
    }),
  ],
});
