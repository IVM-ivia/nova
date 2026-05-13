import puppeteer from '/Users/andreiarhipov/novainvest-next/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { writeFileSync } from 'fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE   = '/Users/andreiarhipov/novainvest-next/public/reports';

const FILES = [
  { html: 'tech-report-ru.html', pdf: 'InvestNovaLG-TechReport-RU.pdf' },
  { html: 'tech-report-en.html', pdf: 'InvestNovaLG-TechReport-EN.pdf' },
  { html: 'report-ru.html',      pdf: 'InvestNovaLG-Report-RU.pdf'      },
  { html: 'report-en.html',      pdf: 'InvestNovaLG-Report-EN.pdf'      },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();

for (const { html, pdf } of FILES) {
  console.log(`Generating ${pdf}...`);
  await page.goto(`file://${BASE}/${html}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const buf = await page.pdf({
    format:               'A4',
    printBackground:      true,
    displayHeaderFooter:  false,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  writeFileSync(`${BASE}/${pdf}`, buf);
  console.log(`  ✓  ${pdf}  (${(buf.length / 1024).toFixed(0)} KB)`);
}

await browser.close();
console.log('\nAll done.');
