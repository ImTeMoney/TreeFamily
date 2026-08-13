import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'מפת התנ״ך — מי חי בתקופה של מי?',
        short_name: 'מפת התנ״ך',
        description:
          'ציר זמן אינטראקטיבי של דמויות, משפחות, תקופות ואירועים — מן התנ״ך, דרך ימי בית שני והמשנה ועד התלמוד.',
        lang: 'he',
        dir: 'rtl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fdfbf7',
        theme_color: '#12203a',
        categories: ['education', 'books', 'reference'],
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'ציר הזמן', short_name: 'ציר הזמן', url: '/timeline' },
          { name: 'חיפוש דמות', short_name: 'חיפוש', url: '/search' },
        ],
      },
      workbox: {
        // המאגר סטטי במלואו, ולכן אפשר לשמור את כל התוצרים ולעבוד אופליין
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
