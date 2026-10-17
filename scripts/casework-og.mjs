// Draws the link previews for the Casework pages (`public/casework/og*.png`, 1200x630): the Casework
// lockup, the page's own headline and its address. Outbound links to these pages are the first thing
// a prospect sees, and Tide's own card (`public/og.png`) does not name Casework.
//
// Needs Playwright with Chromium. It has none of its own, so point it at a checkout that does:
//   PLAYWRIGHT_FROM=../casework/e2e node scripts/casework-og.mjs
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const from = resolve(process.env.PLAYWRIGHT_FROM ?? '../casework/e2e', 'package.json');
const { chromium } = createRequire(from)('@playwright/test');

const wordmark = await readFile('public/casework/wordmark.svg', 'utf8');

const cards = [
  {
    out: 'public/casework/og.png',
    kicker: '',
    headline: 'AI does the reading.<br><em>Experts do the reasoning.</em>',
    host: 'tide-technology.com/casework',
  },
  {
    out: 'public/casework/og-law-firms.png',
    kicker: 'Casework for law firms',
    headline: 'Know the record faster, with every point cited.',
    host: 'tide-technology.com/casework/law-firms',
  },
  {
    out: 'public/casework/og-vocational-consulting.png',
    kicker: 'Casework for vocational consulting',
    headline: 'Spend your hours on the opinion, not the records review.',
    host: 'tide-technology.com/casework/vocational-consulting',
  },
];

const page = (card) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@400;600&display=block">
<style>
  html, body { margin: 0; }
  body {
    width: 1200px; height: 630px; box-sizing: border-box; padding: 80px 96px 72px;
    background: #f7f6f4; color: #1c1c1c; font-family: Inter, system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    border-top: 14px solid #1f5fd6;
  }
  .mark svg { width: 400px; height: auto; display: block; }
  .kicker { font-size: 20px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #1f5fd6; margin: 0 0 18px; }
  h1 { font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 72px; line-height: 1.05; letter-spacing: -0.02em; margin: 0; max-width: 1000px; }
  h1 em { color: #1f5fd6; }
  .host { font-size: 22px; color: #5f6a72; }
</style></head><body>
  <div class="mark">${wordmark}</div>
  <div>${card.kicker ? `<p class="kicker">${card.kicker}</p>` : ''}<h1>${card.headline}</h1></div>
  <div class="host">${card.host}</div>
</body></html>`;

const browser = await chromium.launch();
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const card of cards) {
    await tab.setContent(page(card), { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: card.out, type: 'png' });
    console.log(`wrote ${card.out}`);
  }
} finally {
  await browser.close();
}
