import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.argv[2] ?? 'https://theory-playalong-sidecar.sociobot.in';
const evidence = process.argv[3] ?? '.factory/evidence/polish-3';
mkdirSync(evidence, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
const outsideRequests = [];
const requestRecords = [];
await page.addInitScript(() => {
  const input = { onmidimessage: null };
  Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: async () => ({ inputs: new Map([['live-check-midi', input]]) }) });
  Object.defineProperty(globalThis, '__testMidiInput', { configurable: true, value: input });
});
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => consoleErrors.push(String(error)));
page.on('request', request => {
  const url = new URL(request.url());
  if (url.origin !== new URL(base).origin && url.protocol !== 'blob:') outsideRequests.push(request.url());
  requestRecords.push({ url: request.url(), method: request.method(), body: request.postData() });
});

function testWav(seconds = 2) {
  const rate = 8_000;
  const samples = rate * seconds;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
  return buffer;
}

function check(value, message) {
  if (!value) throw new Error(message);
}

const routeEvidence = {};
for (const [path, title, heading, description] of [
  ['/', 'Theory Playalong Sidecar — play with a backing track', 'Play notes with your backing track', 'Play a MIDI keyboard with a local backing track and see each note in the key you choose.'],
  ['/demo', 'Demo — Theory Playalong Sidecar', 'Try notes in C major', 'Try the sample groove and see notes inside C major.'],
  ['/privacy', 'Privacy — Theory Playalong Sidecar', 'Your practice stays on this device', 'Read what Theory Playalong Sidecar stores in your browser.'],
  ['/terms', 'Terms — Theory Playalong Sidecar', 'Terms for Theory Playalong Sidecar', 'Read the terms for using Theory Playalong Sidecar.']
]) {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(300);
  const result = await page.evaluate(() => ({
    title: globalThis.document.title,
    h1: [...globalThis.document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
    canonical: globalThis.document.querySelector('link[rel="canonical"]')?.href,
    description: globalThis.document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogTitle: globalThis.document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ogDescription: globalThis.document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    twitterTitle: globalThis.document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
    twitterDescription: globalThis.document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    main: globalThis.document.querySelectorAll('main').length,
    build: globalThis.document.querySelector('.build')?.textContent?.trim()
  }));
  check(result.title === title, `${path} title mismatch`);
  check(result.h1.length === 1 && result.h1[0] === heading, `${path} heading mismatch`);
  check(result.main === 1, `${path} must have one main`);
  check(result.build === 'v1.0.4', `${path} build identifier mismatch`);
  check(result.canonical === `${base}${path}`, `${path} canonical mismatch`);
  check(result.ogTitle === title && result.twitterTitle === title, `${path} social metadata mismatch`);
  check(result.description === description && result.ogDescription === description && result.twitterDescription === description, `${path} description metadata mismatch`);
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
  check(serious.length === 0, `${path} has serious accessibility findings`);
  routeEvidence[path] = { ...result, seriousAxeViolations: serious.length };
}

await page.goto(`${base}/privacy`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
const privacyCopy = await page.locator('main').innerText();
check(privacyCopy.includes('Theory Playalong Sidecar makes no third-party requests.'), 'privacy request promise missing');
check(privacyCopy.includes('Clear history removes your note history from this browser.'), 'privacy deletion control missing');

await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.locator('#key-select').selectOption({ label: 'D' });
await page.locator('#mode-select').selectOption('minor');
await page.locator('#bpm').fill('108');
await page.locator('#bpm').press('Tab');
await page.getByRole('button', { name: 'Play D', exact: true }).click();
await page.setInputFiles('#audio-file', { name: 'live-private.wav', mimeType: 'audio/wav', buffer: testWav() });
await page.locator('#audio-player').evaluate(audio => audio.play());
await page.getByRole('button', { name: 'Connect MIDI' }).click();
await page.evaluate(() => globalThis.__testMidiInput.onmidimessage({ data: new Uint8Array([0x90, 69, 100]) }));
await page.waitForFunction(() => globalThis.document.querySelector('#audio-player')?.currentTime > 0.1);
const realCsv = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export CSV' }).click();
await realCsv;
await page.reload();
check(await page.locator('#key-select').inputValue() === 'D', 'real key did not persist');
check(await page.locator('#mode-select').inputValue() === 'minor', 'real scale did not persist');
check(await page.locator('#bpm').inputValue() === '108', 'real tempo did not persist');
check((await page.locator('#history-list li strong').allTextContents()).join(',') === 'A,D', 'real note history did not persist');
await page.getByRole('link', { name: 'Try it with sample data' }).click();
check(new URL(page.url()).searchParams.get('demo') === '1', 'first action did not enter ?demo=1');
check(await page.getByLabel('Demo mode').isVisible(), 'demo banner missing');
check(await page.locator('#history-list li').count() === 4, 'demo did not start with four notes');

const backupDownload = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export backup' }).click();
const backup = await backupDownload;
const backupBytes = await (await backup.createReadStream()).toArray();
const backupText = Buffer.concat(backupBytes).toString('utf8');
await page.getByRole('button', { name: 'Play B', exact: true }).click();
check(await page.locator('#history-list li').count() === 5, 'demo mutation did not add a fifth note');
await page.setInputFiles('#import-json', { name: 'live-backup.json', mimeType: 'application/json', buffer: Buffer.from(backupText) });
await page.waitForFunction(() => globalThis.document.querySelector('#app-status')?.textContent === 'Note history imported.');
check((await page.locator('#history-list li strong').allTextContents()).join(',') === 'C,E,F♯,G', 'backup did not restore the exact four notes');
check((await page.locator('#history-list li small').allTextContents()).every(value => value === 'C major'), 'backup did not restore key labels');
const restoredRows = await page.locator('#history-list li').allTextContents();
await page.setInputFiles('#import-json', { name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"history":false}') });
await page.waitForFunction(() => globalThis.document.querySelector('#app-status')?.textContent?.includes('did not contain note history'));
check((await page.locator('#history-list li').allTextContents()).join('|') === restoredRows.join('|'), 'malformed backup changed note history');

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
check((await page.locator('#audio-player').evaluate(audio => audio.currentTime)) > 0.2, 'sample audio did not advance');
check((await page.locator('#audio-status').textContent()) === 'SAMPLE PLAYING', 'sample status did not confirm playback');
await page.screenshot({ path: `${evidence}/live-demo-desktop.png`, fullPage: true });
await page.getByRole('link', { name: 'Start for real' }).click();
check((await page.locator('#history-list li strong').allTextContents()).join(',') === 'A,D', 'demo changed real note history');
page.once('dialog', dialog => dialog.accept());
await page.getByRole('button', { name: 'Clear history' }).click();
await page.waitForFunction(() => globalThis.document.querySelector('#history-count')?.textContent === '0 NOTES');
await page.waitForFunction(async () => {
  const request = globalThis.indexedDB.open('theory-sidecar-v1');
  const db = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const state = await new Promise((resolve, reject) => {
    const read = db.transaction('practice').objectStore('practice').get('current');
    read.onsuccess = () => resolve(read.result);
    read.onerror = () => reject(read.error);
  });
  db.close();
  return state?.history?.length === 0;
});
await page.reload();
check((await page.locator('#history-count').textContent()) === '0 NOTES', 'cleared note history returned after reload');
check(await page.locator('#key-select').inputValue() === 'D', 'clearing history removed the saved key');
check(await page.locator('#mode-select').inputValue() === 'minor', 'clearing history removed the saved scale');
check(await page.locator('#bpm').inputValue() === '108', 'clearing history removed the saved tempo');

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
const mobileCopy = await mobile.locator('main').innerText();
check(mobileCopy.includes('Play notes with your backing track'), 'first-screen job wording missing');
check(mobileCopy.includes('For beginning keyboard players'), 'first-screen audience wording missing');
check(mobileCopy.includes('Note history'), 'note history terminology missing');
check(!/recent notes|played notes will appear here|any backing track/i.test(mobileCopy), 'stale landing wording remains');
const actionBox = await mobile.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
const factsBox = await mobile.locator('.plain-facts').boundingBox();
check(Boolean(actionBox && actionBox.y + actionBox.height <= 844), 'mobile first action is below the first screen');
check(Boolean(factsBox && factsBox.y + factsBox.height <= 844), 'mobile facts are below the first screen');
await mobile.screenshot({ path: `${evidence}/live-mobile.png`, fullPage: true });
await mobile.close();

const appConsoleErrors = [...consoleErrors];
const fallbacks = {};
for (const path of ['/offline.html', '/missing-polish-3']) {
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
check(fallbacks['/missing-polish-3'].status === 404, 'unknown route did not return HTTP 404');
check(fallbacks['/missing-polish-3'].title === 'Theory Playalong Sidecar — page not found', '404 title mismatch');
for (const value of Object.values(fallbacks)) {
  check(value.privacyLink >= 1 && value.termsLink >= 1, 'fallback legal navigation missing');
  check(value.build?.trim() === 'v1.0.4', 'fallback build identifier mismatch');
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
  backup: { restoredExactRows: true, restoredKeyLabels: true, malformedFilePreservedRows: true },
  historyDeletion: { persistedAfterReload: true, settingsPreserved: true },
  fallbacks,
  privacy: { outsideRequests, requestCount: requestRecords.length, nonGetRequests: requestRecords.filter(request => request.method !== 'GET'), requestsWithBodies: requestRecords.filter(request => request.body !== null) },
  consoleErrors: appConsoleErrors,
  copy: { firstScreenJob: true, firstScreenAudience: true, noteHistoryTerminology: true, stalePhrasesAbsent: true },
  mobile: { width: 390, noHorizontalOverflow: true, firstActionVisible: true, factsVisible: true },
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
check(requestRecords.every(request => request.method === 'GET' && request.body === null), 'practice made an upload request');
check(appConsoleErrors.length === 0, `console errors detected: ${appConsoleErrors.join(', ')}`);
console.log(JSON.stringify(report, null, 2));
