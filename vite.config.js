import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [tailwindcss(),sveltekit(),devtoolsJson(),
		VitePWA({
      registerType: 'prompt',
	  includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'CoupleQuest',
        short_name: 'CQ',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ff69b4',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })

  	]
	
});
