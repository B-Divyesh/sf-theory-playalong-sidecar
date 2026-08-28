import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.argv[2] ?? 'https://theory-playalong-sidecar.sociobot.in';
const evidence = process.argv[3] ?? '.factory/evidence/polish-2';
mkdirSync(evidence, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
const outsideRequests = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => consoleErrors.push(String(error)));
page.on('request', request => {
  const url = new URL(request.url());
  if (url.origin !== new URL(base).origin && url.protocol !== 'blob:') outsideRequests.push(request.url());
});

function check(value, message) {
  if (!value) throw new Error(message);
}

const routeEvidence = {};
for (const [path, title, heading] of [
  ['/', 'Theory Playalong Sidecar — play with a backing track', 'Play notes with your backing track'],
  ['/demo', 'Demo — Theory Playalong Sidecar', 'Try notes in C major'],
  ['/privacy', 'Privacy — Theory Playalong Sidecar', 'Your practice stays on this device'],
  ['/terms', 'Terms — Theory Playalong Sidecar', 'Terms for Theory Playalong Sidecar']
]) {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(300);
  const result = await page.evaluate(() => ({
    title: globalThis.document.title,
    h1: [...globalThis.document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
    canonical: globalThis.document.querySelector('link[rel="canonical"]')?.href,
    ogTitle: globalThis.document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    twitterTitle: globalThis.document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
    main: globalThis.document.querySelectorAll('main').length,
    build: globalThis.document.querySelector('.build')?.textContent?.trim()
  }));
  check(result.title === title, `${path} title mismatch`);
  check(result.h1.length === 1 && result.h1[0] === heading, `${path} heading mismatch`);
  check(result.main === 1, `${path} must have one main`);
  check(result.build === 'v1.0.3', `${path} build identifier mismatch`);
  check(result.ogTitle === title && result.twitterTitle === title, `${path} social metadata mismatch`);
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
  check(serious.length === 0, `${path} has serious accessibility findings`);
  routeEvidence[path] = { ...result, seriousAxeViolations: serious.length };
}

await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.getByRole('button', { name: 'Play G', exact: true }).click();
await page.getByRole('link', { name: 'Try it with sample data' }).click();
check(new URL(page.url()).searchParams.get('demo') === '1', 'first action did not enter ?demo=1');
check(await page.getByLabel('Demo mode').isVisible(), 'demo banner missing');
check(await page.locator('#history-list li').count() === 4, 'demo did not start with four notes');
await page.getByRole('button', { name: 'Play C', exact: true }).first().click();
await page.getByRole('button', { name: 'Reset demo' }).click();
check(await page.locator('#history-list li').count() === 4, 'demo reset did not restore four notes');
await page.locator('#key-select').selectOption({ label: 'E' });
await page.locator('#mode-select').selectOption('minor');
await page.getByRole('button', { name: 'Play E', exact: true }).click();
check((await page.locator('#note-fit').textContent())?.includes('Degree 1 · in E minor'), 'selected key did not update note context');
await page.getByRole('button', { name: 'Play sample groove' }).click();
await page.waitForFunction(() => (globalThis.document.querySelector('#audio-player'))?.currentTime > 0.2);
await page.keyboard.press('a');
check(!(await page.locator('#audio-player').evaluate(audio => audio.paused)), 'keyboard input paused sample audio');
await page.screenshot({ path: `${evidence}/live-demo-desktop.png`, fullPage: true });
await page.getByRole('link', { name: 'Start for real' }).click();
check(await page.locator('#history-list li').count() === 1, 'demo changed real note history');

await page.goto(`${base}/terms`);
await page.getByRole('link', { name: 'Home', exact: true }).click();
check(await page.locator('h1').evaluate(node => node === globalThis.document.activeElement), 'route change did not focus h1');
await page.goBack();
check(await page.locator('h1').evaluate(node => node === globalThis.document.activeElement), 'back navigation did not restore h1 focus');

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
check(await mobile.getByRole('link', { name: 'Try it with sample data' }).isVisible(), 'mobile first action missing');
check(await mobile.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth), 'mobile page overflows horizontally');
await mobile.screenshot({ path: `${evidence}/live-mobile.png`, fullPage: true });
await mobile.close();

const appConsoleErrors = [...consoleErrors];
const fallbacks = {};
for (const path of ['/offline.html', '/missing-polish-2']) {
  const response = await context.request.get(`${base}${path}`);
  const body = await response.text();
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
  fallbacks[path] = {
    status: response.status(),
    title: body.match(/<title>(.*?)<\/title>/)?.[1],
    h1: await page.locator('h1').textContent(),
    privacyLink: await page.getByRole('link', { name: 'Privacy' }).count(),
    termsLink: await page.getByRole('link', { name: 'Terms' }).count(),
    build: await page.locator('.build').textContent(),
    seriousAxeViolations: serious.length
  };
}
check(fallbacks['/offline.html'].status === 200, 'offline document did not return 200');
check(fallbacks['/offline.html'].title === 'Offline — Theory Playalong Sidecar', 'offline title mismatch');
check(fallbacks['/missing-polish-2'].status === 404, 'unknown route did not return HTTP 404');
check(fallbacks['/missing-polish-2'].title === 'Theory Playalong Sidecar — page not found', '404 title mismatch');
for (const value of Object.values(fallbacks)) {
  check(value.privacyLink >= 1 && value.termsLink >= 1, 'fallback legal navigation missing');
  check(value.build?.trim() === 'v1.0.3', 'fallback build identifier mismatch');
  check(value.seriousAxeViolations === 0, 'fallback has serious accessibility findings');
}

const rootResponse = await context.request.get(`${base}/`);
const headers = rootResponse.headers();
check(headers['content-security-policy']?.includes("default-src 'self'"), 'CSP missing');
check(headers['x-content-type-options'] === 'nosniff', 'nosniff header missing');
check(Boolean(headers['referrer-policy']), 'referrer policy missing');

await page.goto(`${base}/?demo=1`);
await page.evaluate(() => navigator.serviceWorker.ready);
await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
await context.setOffline(true);
await page.reload();
check(await page.getByRole('heading', { name: 'Try notes in C major' }).isVisible(), 'offline demo reload failed');
await context.setOffline(false);

const report = {
  checkedAt: new Date().toISOString(),
  base,
  routes: routeEvidence,
  demo: { queryEntry: true, banner: true, resetToFour: true, realHistoryPreserved: true, selectedKeyChanged: true, audioContinued: true },
  fallbacks,
  privacy: { outsideRequests },
  consoleErrors: appConsoleErrors,
  mobile: { width: 390, noHorizontalOverflow: true, firstActionVisible: true },
  securityHeaders: {
    contentSecurityPolicy: headers['content-security-policy'],
    xContentTypeOptions: headers['x-content-type-options'],
    referrerPolicy: headers['referrer-policy']
  },
  offlineReload: true
};
writeFileSync(`${evidence}/live-verification.json`, `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
check(outsideRequests.length === 0, `third-party requests detected: ${outsideRequests.join(', ')}`);
check(appConsoleErrors.length === 0, `console errors detected: ${appConsoleErrors.join(', ')}`);
console.log(JSON.stringify(report, null, 2));
