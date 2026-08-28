import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

function testWav(seconds = 2): Buffer {
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
  for (let index = 0; index < samples; index += 1) {
    buffer.writeInt16LE(Math.round(Math.sin(2 * Math.PI * 220 * index / rate) * 3_000), 44 + index * 2);
  }
  return buffer;
}

async function installSyntheticMidi(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript(() => {
    const input = { onmidimessage: null as null | ((event: { data: Uint8Array }) => void) };
    Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: async () => ({ inputs: new Map([['test-midi', input]]) }) });
    Object.defineProperty(window, '__testMidiInput', { configurable: true, value: input });
  });
}

async function sendMidi(page: import('@playwright/test').Page, note: number): Promise<void> {
  await page.evaluate(midi => {
    const input = (window as unknown as {__testMidiInput:{onmidimessage:(event:{data:Uint8Array})=>void}}).__testMidiInput;
    input.onmidimessage({ data: new Uint8Array([0x90, midi, 100]) });
  }, note);
}

test('landing has the required structure and clear first action', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Theory Playalong Sidecar — play with a backing track');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('Opens a ready C-major practice set.')).toBeVisible();
  await expect(page.locator('.site-footer .build')).toHaveText('v1.0.4');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('@claim:demo-ready the direct query demo is isolated, resettable, playable, and uses demo metadata', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Theory Playalong Sidecar');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Demo — Theory Playalong Sidecar');
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Try the sample groove and see notes inside C major.');
  await expect(page.getByLabel('Demo mode')).toContainText('sample data, nothing is saved');
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.duration)).toBeGreaterThan(7.9);
  await expect(page.locator('#history-list li strong')).toHaveText(['C', 'E', 'F♯', 'G']);
  await expect(page.locator('#history-list li')).toHaveCount(4);
  await page.getByRole('button', { name: 'Play sample groove' }).click();
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.2);
  expect(await page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false);
  await expect(page.locator('#audio-status')).toHaveText('SAMPLE PLAYING');
  await page.keyboard.press('a');
  await expect(page.locator('#history-list li')).toHaveCount(5);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#history-list li')).toHaveCount(4);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Play notes with your backing track' })).toBeVisible();
});

test('@claim:harmony-context shows a note inside and outside the selected key', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Play E', exact: true }).click();
  await expect(page.locator('#note-name')).toHaveText('E');
  await expect(page.locator('#note-fit')).toContainText('Degree 3 · in C major');
  await expect(page.locator('#chord-map')).toContainText('C');
  const cMajorChords = await page.locator('#chord-map').innerText();
  await page.getByRole('button', { name: 'Play F♯', exact: true }).click();
  await expect(page.locator('#note-fit')).toContainText('Outside C major');
  await expect(page.locator('#history-list li').first()).toContainText('outside key');
  await page.locator('#key-select').selectOption({ label: 'E' });
  await page.locator('#mode-select').selectOption('minor');
  await expect(page.locator('#scale-summary')).toContainText('E minor: E · F♯ · G · A · B · C · D');
  await page.getByRole('button', { name: 'Play E', exact: true }).click();
  await expect(page.locator('#note-fit')).toContainText('Degree 1 · in E minor');
  await expect(page.locator('#history-list li').first()).toContainText('E minor');
  expect(await page.locator('#chord-map').innerText()).not.toBe(cMajorChords);
});

test('@claim:midi-input handles live MIDI note messages', async ({ page }) => {
  await installSyntheticMidi(page);
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Connect MIDI' }).click();
  await expect(page.locator('#midi-status')).toHaveText('1 MIDI INPUT');
  await sendMidi(page, 64);
  await expect(page.locator('#note-name')).toHaveText('E');
});

test('@claim:local-audio local audio, MIDI, and demo notes stay isolated', async ({ page }) => {
  await installSyntheticMidi(page);
  const outside: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/demo');
  await page.setInputFiles('#audio-file', { name: 'private-practice.wav', mimeType: 'audio/wav', buffer: testWav() });
  await expect(page.locator('#audio-status')).toHaveText('LOCAL AUDIO READY');
  await page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.play());
  await page.getByRole('button', { name: 'Connect MIDI' }).click();
  await sendMidi(page, 69);
  await expect(page.locator('#note-name')).toHaveText('A');
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.1);
  expect(outside).toEqual([]);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(db => db.name));
  expect(databases).not.toContain('theory-sidecar-v1');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('@claim:beat-marker @regression:beat-marker follows the chosen tempo', async ({ page }) => {
  const measure = async (tempo: number): Promise<number> => {
    await page.goto('/demo');
    await page.locator('#bpm').fill(String(tempo));
    await page.locator('#bpm').press('Tab');
    await page.getByRole('button', { name: 'Play sample groove' }).click();
    const started = await page.evaluate(() => performance.now());
    await page.waitForFunction(() => document.querySelector('#beat-text')?.textContent === 'Beat 2 of 8', null, { polling: 20, timeout: 1_700 });
    await expect(page.locator('#beat-rail .active')).toHaveCount(1);
    return await page.evaluate(start => performance.now() - start, started);
  };
  const slow = await measure(60);
  const fast = await measure(120);
  expect(slow).toBeGreaterThan(780);
  expect(slow).toBeLessThan(1_350);
  expect(fast).toBeGreaterThan(350);
  expect(fast).toBeLessThan(850);
  expect(slow).toBeGreaterThan(fast * 1.45);
});

test('@regression:immutable-assets gives content-hashed assets an immutable cache policy', async () => {
  const config = JSON.parse(readFileSync('dist/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    routes: Array<{route:string;rewrite?:string;headers?:Record<string,string>}>;
    responseOverrides: Record<string,{rewrite:string}>;
  };
  expect(config.routes).toContainEqual(expect.objectContaining({
    route: '/assets/*',
    headers: expect.objectContaining({ 'Cache-Control': 'public, max-age=31536000, immutable' })
  }));
  const assets = readdirSync('dist/assets');
  expect(assets.some(name => /^app-[A-Za-z0-9_-]+\.js$/.test(name))).toBe(true);
  expect(assets.some(name => /^index-[A-Za-z0-9_-]+\.css$/.test(name))).toBe(true);
  expect(assets).toContain('harmony-console.32a49c4c.webp');
  const worker = readFileSync('dist/sw.js', 'utf8');
  expect(worker).toMatch(/const VERSION = 'sidecar-[a-f0-9]{12}'/);
  for (const asset of assets.filter(name => /\.(?:css|js|webp)$/.test(name))) {
    expect(worker).toContain(`/assets/${asset}`);
  }
  expect(worker).toContain('self.skipWaiting()');
  expect(worker).toContain('self.clients.claim()');
});

test('@regression:http-404 limits SPA rewrites so unknown paths retain HTTP 404', async () => {
  const source = readFileSync('public/staticwebapp.config.json', 'utf8');
  expect(readFileSync('staticwebapp.config.json', 'utf8')).toBe(source);
  const config = JSON.parse(readFileSync('dist/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    routes: Array<{route:string;rewrite?:string}>;
    responseOverrides: Record<string,{rewrite:string}>;
  };
  expect(config.navigationFallback).toBeUndefined();
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    expect(config.routes).toContainEqual(expect.objectContaining({ route, rewrite: '/index.html' }));
  }
  expect(config.routes.some(route => route.route === '/*' && route.rewrite === '/index.html')).toBe(false);
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  const notFound = readFileSync('dist/404.html', 'utf8');
  expect(notFound).toContain('<title>Theory Playalong Sidecar — page not found</title>');
  expect(notFound).toContain('<h1 tabindex="-1">Page not found</h1>');
});

test('@claim:csv-export exports every visible demo history row', async ({ page }) => {
  await page.goto('/demo');
  const count = await page.locator('#history-list li').count();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const text = await (await download.createReadStream()).toArray();
  const csv = Buffer.concat(text).toString('utf8');
  expect(csv.split('\n')[0]).toBe('note,in_key,key,played_at');
  expect(csv.trim().split('\n')).toHaveLength(count + 1);
});

test('@claim:history-portability restores exact note history and rejects malformed backups', async ({ page }) => {
  await page.goto('/demo');
  const originalRows = await page.locator('#history-list li').allTextContents();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadPromise;
  const chunks = await (await download.createReadStream()).toArray();
  const saved = Buffer.concat(chunks).toString('utf8');
  expect(JSON.parse(saved).history).toHaveLength(4);
  await page.getByRole('button', { name: 'Play B', exact: true }).click();
  await expect(page.locator('#history-list li strong')).toHaveText(['B', 'C', 'E', 'F♯', 'G']);
  await page.setInputFiles('#import-json', { name: 'sidecar.json', mimeType: 'application/json', buffer: Buffer.from(saved) });
  await expect(page.locator('#app-status')).toHaveText('Note history imported.');
  await expect(page.locator('#history-list li')).toHaveCount(4);
  await expect(page.locator('#history-list li strong')).toHaveText(['C', 'E', 'F♯', 'G']);
  await expect(page.locator('#history-list li small')).toHaveText(['C major', 'C major', 'C major', 'C major']);
  expect(await page.locator('#history-list li').allTextContents()).toEqual(originalRows);

  const restoredRows = await page.locator('#history-list li').allTextContents();
  await page.setInputFiles('#import-json', { name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"history":"not a list"}') });
  await expect(page.locator('#app-status')).toContainText('did not contain note history');
  expect(await page.locator('#history-list li').allTextContents()).toEqual(restoredRows);
});

test('@claim:no-third-party-requests keeps real and demo practice local', async ({ page }) => {
  await installSyntheticMidi(page);
  const requests: Array<{url:string;method:string;body:string|null}> = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));

  await page.goto('/');
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await page.setInputFiles('#audio-file', { name: 'private-practice.wav', mimeType: 'audio/wav', buffer: testWav() });
  await page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.play());
  await page.getByRole('button', { name: 'Connect MIDI' }).click();
  await sendMidi(page, 69);
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.1);
  const realDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await realDownload;
  await page.reload();
  await expect(page.locator('#history-list li').first()).toContainText('A');

  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Play sample groove' }).click();
  await page.getByRole('button', { name: 'Play C', exact: true }).first().click();
  const demoDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  await demoDownload;
  await page.reload();
  await expect(page.getByLabel('Demo mode')).toBeVisible();

  const origin = 'http://127.0.0.1:4173';
  expect(requests.length).toBeGreaterThan(0);
  for (const request of requests) {
    const url = new URL(request.url);
    expect(url.origin === origin || (url.protocol === 'blob:' && request.url.startsWith(`blob:${origin}/`))).toBe(true);
    expect(request.method).toBe('GET');
    expect(request.body).toBeNull();
  }
});

test('@claim:history-deletion clears saved note history and keeps settings', async ({ page }) => {
  await page.goto('/');
  await page.locator('#key-select').selectOption({ label: 'D' });
  await page.locator('#mode-select').selectOption('minor');
  await page.locator('#bpm').fill('108');
  await page.locator('#bpm').press('Tab');
  await page.getByRole('button', { name: 'Play D', exact: true }).click();
  await page.getByRole('button', { name: 'Play F', exact: true }).click();
  await expect(page.locator('#history-list li')).toHaveCount(2);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear history' }).click();
  await expect(page.locator('#app-status')).toHaveText('Note history cleared.');
  await expect(page.locator('#history-count')).toHaveText('0 NOTES');
  await expect(page.locator('#history-list li.empty')).toHaveText('Played notes will appear in your note history.');
  await expect.poll(() => page.evaluate(async () => {
    const request = indexedDB.open('theory-sidecar-v1');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const state = await new Promise<{history:unknown[]} | undefined>((resolve, reject) => {
      const read = db.transaction('practice').objectStore('practice').get('current');
      read.onsuccess = () => resolve(read.result);
      read.onerror = () => reject(read.error);
    });
    db.close();
    return state?.history.length;
  })).toBe(0);
  await page.reload();
  await expect(page.locator('#history-count')).toHaveText('0 NOTES');
  await expect(page.locator('#history-list li.empty')).toHaveText('Played notes will appear in your note history.');
  await expect(page.locator('#key-select')).toHaveValue('D');
  await expect(page.locator('#mode-select')).toHaveValue('minor');
  await expect(page.locator('#bpm')).toHaveValue('108');
});

test('@claim:local-history keeps every setting and notes but not an audio file after reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('#key-select').selectOption({ label: 'A' });
  await page.locator('#mode-select').selectOption('minor');
  await page.locator('#bpm').fill('132');
  await page.locator('#bpm').press('Tab');
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await page.setInputFiles('#audio-file', { name: 'practice.wav', mimeType: 'audio/wav', buffer: testWav() });
  await expect(page.locator('#audio-status')).toHaveText('LOCAL AUDIO READY');
  await expect.poll(async () => page.evaluate(async () => (await indexedDB.databases()).some(db => db.name === 'theory-sidecar-v1'))).toBe(true);
  await page.waitForTimeout(150);
  await page.reload();
  await expect(page.locator('#key-select')).toHaveValue('A');
  await expect(page.locator('#mode-select')).toHaveValue('minor');
  await expect(page.locator('#bpm')).toHaveValue('132');
  await expect(page.locator('#history-list li').first()).toContainText('G');
  await expect(page.locator('#history-list li').first()).toContainText('A minor');
  await expect(page.locator('#audio-status')).toHaveText('NO AUDIO');
});

test('@claim:offline-reload reloads the demo without a network connection', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.locator('#app-status')).toHaveText('You are offline. The practice tool still works.');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Try notes in C major' })).toBeVisible();
  await page.getByRole('button', { name: 'Play C', exact: true }).first().click();
  await expect(page.locator('#note-fit')).toContainText('in C major');
  await context.setOffline(false);
});

test('@regression:service-worker-update activates a new shell and announces it', async ({ page }) => {
  const workerPath = 'dist/sw.js';
  const original = readFileSync(workerPath, 'utf8');
  const currentVersion = original.match(/const VERSION = '([^']+)'/)?.[1];
  expect(currentVersion).toBeTruthy();
  const updateVersion = `${currentVersion}-update-test`;
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    }
  });
  await page.reload();
  writeFileSync(workerPath, original.replace(`const VERSION = '${currentVersion}'`, `const VERSION = '${updateVersion}'`));
  try {
    const activated = await page.evaluate(async version => {
      const changed = new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('The updated worker did not take control.')), 10_000);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.clearTimeout(timeout);
          resolve();
        }, { once: true });
      });
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
      await changed;
      return (await caches.keys()).includes(version);
    }, updateVersion);
    expect(activated).toBe(true);
    await expect(page.locator('#app-status')).toContainText('An update is ready. Reload to use it.');
  } finally {
    writeFileSync(workerPath, original);
  }
});

test('@claim:free-use has no account or payment gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free to use.')).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('heading', { name: 'Try notes in C major' })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});

test('@claim:keyboard-fallback supports screen and computer keys without MIDI; routes, mobile width, and accessibility pass', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await expect(page.locator('#note-name')).toHaveText('G');
  await page.keyboard.press('a');
  await expect(page.locator('#note-name')).toHaveText('C');
  await expect(page.locator('#history-list li').first()).toContainText('C');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await expect(page.locator('main h2')).toHaveCount(4);
  expect(await page.locator('#live-note').evaluate(element => Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(0.001);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Theory Playalong Sidecar');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Theory Playalong Sidecar');
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Read what Theory Playalong Sidecar stores in your browser.');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('@claim:playalong-continuity all input paths leave sample audio playing', async ({ page }) => {
  await installSyntheticMidi(page);
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Connect MIDI' }).click();
  await page.getByRole('button', { name: 'Play sample groove' }).click();
  const start = await page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.currentTime);
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await expect(page.locator('#note-name')).toHaveText('G');
  await page.keyboard.press('d');
  await expect(page.locator('#note-name')).toHaveText('E');
  await sendMidi(page, 71);
  await expect(page.locator('#note-name')).toHaveText('B');
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(start + 0.15);
  expect(await page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false);
  await expect(page.locator('#audio-status')).toHaveText('SAMPLE PLAYING');
});

test('demo changes never read or overwrite real practice data', async ({ page }) => {
  await page.goto('/');
  await page.locator('#key-select').selectOption({ label: 'A' });
  await page.locator('#mode-select').selectOption('minor');
  await page.getByRole('button', { name: 'Play A', exact: true }).click();
  await expect.poll(async () => page.evaluate(async () => (await indexedDB.databases()).some(db => db.name === 'theory-sidecar-v1'))).toBe(true);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator('#key-select')).toHaveValue('C');
  await expect(page.locator('#history-list li strong')).toHaveText(['C', 'E', 'F♯', 'G']);
  await page.getByRole('button', { name: 'Play B', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#history-list li strong')).toHaveText(['C', 'E', 'F♯', 'G']);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.locator('#key-select')).toHaveValue('A');
  await expect(page.locator('#mode-select')).toHaveValue('minor');
  await expect(page.locator('#history-list li strong')).toHaveText(['A']);
});

test('claim registry and tagged browser proofs match one-to-one', async () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{id:string;test:string}>;
  const source = readFileSync('tests/app.spec.ts', 'utf8');
  const ids = claims.map(claim => claim.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    expect(source.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g')) ?? []).toHaveLength(1);
  }
  const tags = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map(match => match[1]);
  expect([...new Set(tags)].sort()).toEqual([...ids].sort());
});

test('fallback documents have complete metadata, legal links, plain copy, and matching versions', async () => {
  const packageVersion = (JSON.parse(readFileSync('package.json', 'utf8')) as {version:string}).version;
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as {start_url:string;short_name:string};
  expect(manifest.start_url).toBe(`/?v=${packageVersion}`);
  expect(manifest.short_name).toBe('Theory Playalong Sidecar');
  for (const name of ['offline.html', '404.html']) {
    const document = readFileSync(`public/${name}`, 'utf8');
    expect(document).toContain('<meta name="description"');
    expect(document).toContain('<link rel="canonical"');
    expect(document).toContain('<meta property="og:title"');
    expect(document).toContain('<meta name="twitter:title"');
    expect(document).toContain('<link rel="icon"');
    expect(document).toContain('href="/privacy"');
    expect(document).toContain('href="/terms"');
    expect(document).toContain('(external site)');
    expect(document).toContain(`class="build">v${packageVersion}`);
  }
  const offline = readFileSync('public/offline.html', 'utf8');
  expect(offline).not.toContain('<title>Offline — Theory Sidecar</title>');
  expect(offline).not.toMatch(/The sidecar|loaded sidecar/i);
  expect(readFileSync('src/main.ts', 'utf8')).not.toContain('The loaded sidecar still works.');
});

test('route titles, metadata, focus, back navigation, fallback accessibility, and mobile first screen pass', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(action).toBeInViewport();
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page).toHaveTitle('Terms — Theory Playalong Sidecar');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms for Theory Playalong Sidecar' })).toBeFocused();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Terms — Theory Playalong Sidecar');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Play notes with your backing track' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  for (const path of ['/offline.html', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('copy audit tracks the current plain-language landing strings', async ({ page }) => {
  const audit = readFileSync('.factory/copy-audit.md', 'utf8');
  const current = [
    'Play notes with your backing track',
    'For beginning keyboard players who want to see why each note fits while the music keeps moving.',
    'Play notes with a backing track',
    'Choose a key and audio file',
    'Play notes while audio continues',
    'See where each note fits',
    'See the note number in the key, matching chords, and note history.',
    'Note history',
    'Your practice data'
  ];
  await page.goto('/');
  for (const copy of current) {
    await expect(page.getByText(copy, { exact: true }).first()).toBeVisible();
    expect(audit).toContain(`| ${copy} | Pass |`);
  }
  expect(await page.locator('.section-code').count()).toBe(0);
});
