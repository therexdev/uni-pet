import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium, expect } from '@playwright/test';
const port = process.env.TEST_PORT || '3107';
const server = spawn(process.execPath, ['server.mjs'], {
  env: { ...process.env, PORT: port },
  stdio: 'pipe',
});
let browser;
const errors = [];
const shots = process.env.QA_SCREENSHOT_DIR;
try {
  await new Promise((resolve, reject) => {
    let n = 0;
    const id = setInterval(async () => {
      try {
        const r = await fetch(`http://127.0.0.1:${port}`);
        if (r.ok) {
          clearInterval(id);
          resolve();
        }
      } catch {}
      if (++n > 60) {
        clearInterval(id);
        reject(new Error('Preview did not start'));
      }
    }, 100);
  });
  browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
    headless: true,
    args: process.env.BROWSER_EXECUTABLE_PATH
      ? [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--no-zygote',
          '--single-process',
          '--use-gl=angle',
          '--use-angle=swiftshader',
          '--enable-unsafe-swiftshader',
        ]
      : [],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install({ time: new Date('2026-09-11T12:00:00Z') });
  await page.goto(`http://127.0.0.1:${port}`);
  await expect(page.getByRole('heading', { name: 'One little pet. All of us.' })).toBeVisible();
  await expect(page.getByText('Progress stays on this device.', { exact: false })).toBeVisible();
  if (shots) {
    mkdirSync(shots, { recursive: true });
    await page.screenshot({ path: `${shots}/desktop.png`, fullPage: true });
  }
  await page.getByRole('button', { name: 'Join the family' }).click();
  await page.getByRole('button', { name: 'Start my playground visit' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: /^Feed / }).click();
  await expect(page.getByRole('progressbar', { name: 'Full tummy' })).toHaveAttribute(
    'aria-valuenow',
    '82',
  );
  await expect(page.getByText('10 affection · Favorite Owner')).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: /^Cuddle / }).click();
  await expect(page.getByRole('progressbar', { name: 'Happiness' })).toHaveAttribute(
    'aria-valuenow',
    '80',
  );
  await page.getByRole('button', { name: 'The garden', exact: true }).click();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Plant a seed' }).first().click();
  await expect(page.getByText('Growing something good')).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Water this patch' }).click();
  await expect(page.getByRole('button', { name: 'Watered with love' })).toBeDisabled();
  await page.clock.fastForward(14400000);
  await page.getByRole('button', { name: 'Pick berries' }).click();
  await expect(page.getByText('6 berries', { exact: true })).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Make a treat' }).click();
  await expect(page.getByText('1 treats', { exact: true })).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Bring a treat' }).click();
  await expect(page.getByText('1 / 100', { exact: true })).toBeVisible();
  if (shots) await page.screenshot({ path: `${shots}/garden.png`, fullPage: true });
  await page.getByRole('button', { name: 'Adventures', exact: true }).click();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Let’s go exploring' }).click();
  await expect(page.getByRole('button', { name: /Exploring/ })).toBeDisabled();
  await page.clock.fastForward(3600000);
  await page.getByRole('button', { name: 'Welcome back! Collect berries' }).click();
  await page.getByRole('button', { name: 'Our pet', exact: true }).click();
  await page.getByRole('button', { name: 'Change character', exact: true }).first().click();
  await page.getByRole('button', { name: /Cloud Your softest/ }).click();
  await page.getByRole('button', { name: 'That’s my Uni' }).click();
  await expect(page.getByRole('img', { name: /cloud character/ })).toBeVisible();
  await page.getByRole('button', { name: /^Invite a friend/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save this moment' }).click();
  const download = await downloadPromise;
  if (download.suggestedFilename() !== 'uni-pet-moment.png')
    throw new Error('Wrong share filename');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await expect(page.getByText('gave Uni a snack', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Rewards', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Claim your badge' })).toBeDisabled();
  await page.reload();
  await page.getByRole('heading', { name: 'One little pet. All of us.' }).waitFor();
  await page.getByRole('button', { name: 'Join the family' }).click();
  await page.getByRole('button', { name: 'Start my playground visit' }).click();
  await expect(page.getByRole('img', { name: /cloud character/ })).toBeVisible();
  await expect(page.getByText('1 / 100', { exact: true })).toBeVisible();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
    if (width === 390) {
      if (shots) await page.screenshot({ path: `${shots}/mobile.png`, fullPage: true });
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.getByRole('button', { name: 'The garden', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Your little patch' })).toBeVisible();
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.getByRole('button', { name: 'Our pet', exact: true }).click();
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  // Configuration failures must not silently turn into local gameplay.
  await page.route('**/uni-pet.config.json', (route) =>
    route.fulfill({
      json: { mode: 'chain', network: 'harbinger', rpcUrls: [], contractId: '', chainId: '' },
    }),
  );
  await page.reload();
  await expect(page.getByText('The on-chain pet has not been configured yet.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Feed / })).toHaveCount(0);
  console.log(
    'Browser checks passed: care, affection, planting, watering, timed harvest, crafting, contribution, adventure, character persistence, share download, journal, reward eligibility, responsive navigation, and configuration failure.',
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
