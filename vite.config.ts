import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Endereço público usado no canonical e nas tags de compartilhamento.
// Na Vercel vem de VERCEL_PROJECT_PRODUCTION_URL; dá para fixar com SITE_URL.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = (process.env.SITE_URL ?? (productionHost ? `https://${productionHost}` : '')).replace(/\/+$/, '')

function absoluteMeta(): Plugin {
  return {
    name: 'absolute-meta',
    transformIndexHtml() {
      if (!siteUrl) return []
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/og.png?v=2` }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${siteUrl}/og.png?v=2` }, injectTo: 'head' },
      ]
    },
  }
}

export default defineConfig({
  plugins: [react(), absoluteMeta()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
