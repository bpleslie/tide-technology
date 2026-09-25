import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.tide-technology.com',
  integrations: [sitemap()],
  // Small site-wide stylesheet: inline it so first paint doesn't wait on a CSS request.
  build: { inlineStylesheets: 'always' },
  // Self-hosted fonts with metric-matched fallbacks (no third-party request, minimal layout shift).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: ['400 600'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
      // Keep the optical-size axis so large headings use Fraunces' finer display cut.
      options: { experimental: { variableAxis: { opsz: [['9', '144']] } } },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
