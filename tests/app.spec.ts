import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing has the required structure and clear first action', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Play notes against a key — Theory Sidecar');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('Opens a ready C-major practice set.')).toBeVisible();
});

test('@claim:harmony-context shows a note inside and outside the selected key', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Play E', exact: true }).click();
  await expect(page.locator('#note-name')).toHaveText('E');
  await expect(page.locator('#note-fit')).toContainText('Degree 3 · in C major');
  await expect(page.locator('#chord-map')).toContainText('C');
  await page.getByRole('button', { name: 'Play F♯' }).click();
  await expect(page.locator('#note-fit')).toContainText('Outside C major');
  await expect(page.locator('#history-list li').first()).toContainText('outside key');
});

test('@claim:midi-input handles live MIDI note messages', async ({ page }) => {
  await page.addInitScript(() => {
    const input = { onmidimessage: null as null | ((event: { data: Uint8Array }) => void) };
    Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: async () => ({ inputs: new Map([['test-midi', input]]) }) });
    Object.defineProperty(window, '__testMidiInput', { value: input });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Connect MIDI' }).click();
  await expect(page.locator('#midi-status')).toHaveText('1 MIDI INPUT');
  await page.evaluate(() => {
    const input = (window as unknown as {__testMidiInput:{onmidimessage:(event:{data:Uint8Array})=>void}}).__testMidiInput;
    input.onmidimessage({ data: new Uint8Array([0x90, 64, 100]) });
  });
  await expect(page.locator('#note-name')).toHaveText('E');
});

test('@claim:local-audio demo uses no third-party requests or data storage', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/demo');
  await expect.poll(() => page.locator('#audio-player').evaluate((audio: HTMLAudioElement) => audio.duration)).toBeGreaterThan(7.9);
  await page.getByRole('button', { name: 'Play sample groove' }).click();
  await expect(page.locator('#audio-status')).toHaveText('SAMPLE PLAYING');
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await page.waitForTimeout(350);
  expect(outside).toEqual([]);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(db => db.name));
  expect(databases).not.toContain('theory-sidecar-v1');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('@claim:beat-marker advances with the backing track', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Play sample groove' }).click();
  await expect(page.locator('[data-beat="1"]')).toHaveClass(/active/, { timeout: 2_500 });
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

test('@claim:history-portability exports and imports note history as JSON', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const chunks = await (await download.createReadStream()).toArray();
  const saved = Buffer.concat(chunks).toString('utf8');
  expect(JSON.parse(saved).history).toHaveLength(4);
  await page.setInputFiles('#import-json', { name: 'sidecar.json', mimeType: 'application/json', buffer: Buffer.from(saved) });
  await expect(page.locator('#app-status')).toHaveText('Note history imported.');
  await expect(page.locator('#history-list li')).toHaveCount(4);
});

test('@claim:local-history keeps notes but not an audio file after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play G', exact: true }).click();
  await page.setInputFiles('#audio-file', { name: 'practice.wav', mimeType: 'audio/wav', buffer: Buffer.from('RIFF') });
  await expect(page.locator('#audio-status')).toHaveText('LOCAL AUDIO READY');
  await page.reload();
  await expect(page.locator('#history-list li').first()).toContainText('G');
  await expect(page.locator('#audio-status')).toHaveText('NO AUDIO');
});

test('@claim:offline-reload reloads the demo without a network connection', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Try notes in C major' })).toBeVisible();
  await page.getByRole('button', { name: 'Play C', exact: true }).first().click();
  await expect(page.locator('#note-fit')).toContainText('in C major');
  await context.setOffline(false);
});

test('@claim:free-use has no account or payment gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free to use.')).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('heading', { name: 'Try notes in C major' })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});

test('@claim:keyboard-fallback supports computer keys; routes, mobile width, and accessibility pass', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto('/demo');
  await page.keyboard.press('a');
  await expect(page.locator('#note-name')).toHaveText('C');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Theory Playalong Sidecar');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(errors).toEqual([]);
});
