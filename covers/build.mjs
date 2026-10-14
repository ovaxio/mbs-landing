// Génère les couvertures MBS depuis cover.html. Aucune IA, aucune clé d'API.
// Usage : node build.mjs covers.json [dossier-de-sortie]
// Chromium : défini par MBS_CHROMIUM, sinon celui de Playwright.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = process.argv[2] || join(here, 'covers.json');
const outDir = process.argv[3] || join(here, 'out');
const items = JSON.parse(readFileSync(configPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

const FORMATS = { featured: [1600, 900], social: [1080, 1080] };
const tpl = 'file://' + resolve(join(here, 'cover.html'));

const browser = await chromium.launch({ executablePath: process.env.MBS_CHROMIUM || undefined });
for (const it of items) {
  for (const format of (it.formats || ['featured', 'social'])) {
    const [w, h] = FORMATS[format];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const q = new URLSearchParams({ format, kicker: it.kicker || '', line: it.line, bg: it.bg || '' });
    await page.goto(`${tpl}?${q}`);
    await page.waitForFunction(() => document.fonts.status === 'loaded');
    await page.waitForTimeout(150);
    const file = join(outDir, `${it.slug}_${format}.png`);
    await page.locator('#cover').screenshot({ path: file });
    console.log('→', file);
    await page.close();
  }
}
await browser.close();
