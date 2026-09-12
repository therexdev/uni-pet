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
  // Stable screenshots also verify the reduced-motion presentation.
  if (shots) await page.emulateMedia({ reducedMotion: 'reduce' });
  const visibleText = (...args) => page.getByText(...args).filter({ visible: true });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install({ time: new Date('2026-09-11T12:00:00Z') });
  await page.goto(`http://127.0.0.1:${port}`);
  await expect(page.getByRole('heading', { name: 'One little pet. All of us.' })).toBeVisible();
  await expect(visibleText('Progress stays on this device.', { exact: false })).toBeVisible();
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
  await expect(visibleText('10 affection · Favorite Owner')).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: /^Cuddle / }).click();
  await expect(page.getByRole('progressbar', { name: 'Happiness' })).toHaveAttribute(
    'aria-valuenow',
    '80',
  );
  await page.getByRole('button', { name: 'The garden', exact: true }).click();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Plant a seed' }).first().click();
  await expect(visibleText('Growing something good')).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Water this patch' }).click();
  await expect(page.getByRole('button', { name: 'Watered with love' })).toBeDisabled();
  await page.clock.fastForward(14400000);
  await page.getByRole('button', { name: 'Pick berries' }).click();
  await expect(visibleText('6 berries', { exact: true })).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Make a treat' }).click();
  await expect(visibleText('1 treats', { exact: true })).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Bring a treat' }).click();
  await expect(visibleText('1 / 100', { exact: true })).toBeVisible();
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
  await expect(visibleText('gave Uni a snack', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Rewards', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Claim your badge' })).toBeDisabled();
  await page.reload();
  await page.getByRole('heading', { name: 'One little pet. All of us.' }).waitFor();
  await page.getByRole('button', { name: 'Join the family' }).click();
  await page.getByRole('button', { name: 'Start my playground visit' }).click();
  await expect(page.getByRole('img', { name: /cloud character/ })).toBeVisible();
  await expect(visibleText('1 / 100', { exact: true })).toBeVisible();
  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
    if (width === 390) {
      if (shots) await page.screenshot({ path: `${shots}/mobile.png`, fullPage: true });
      await page.getByRole('button', { name: 'The garden', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Your garden' })).toBeVisible();
      await page.getByRole('button', { name: 'Our pet', exact: true }).click();
    }
  }
  // Exercise real touch events: horizontal navigation, boundaries, scroll, and dialogs.
  await page.setViewportSize({ width: 390, height: 844 });
  const bottom = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(bottom).toBeVisible();
  const touch = await page.context().newCDPSession(page);
  async function swipe(x1, y1, x2, y2) {
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: x1, y: y1 }],
    });
    for (let i = 1; i <= 6; i++)
      await touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x1 + ((x2 - x1) * i) / 6, y: y1 + ((y2 - y1) * i) / 6 }],
      });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(310, 130, 75, 133);
  await expect(bottom.getByRole('button', { name: 'The garden', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('heading', { name: 'Your garden' })).toBeVisible();
  await swipe(75, 110, 310, 113);
  await expect(bottom.getByRole('button', { name: 'Our pet', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await swipe(75, 130, 310, 133); // First tab does not wrap.
  await expect(bottom.getByRole('button', { name: 'Our pet', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await swipe(28, 520, 30, 240); // Vertical movement scrolls, never navigates.
  await expect(bottom.getByRole('button', { name: 'Our pet', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const bar = await bottom.boundingBox();
  if (!bar || bar.y + bar.height > 845 || bar.y < 700)
    throw new Error('Bottom navigation did not stay fixed');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Change character', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await swipe(300, 200, 90, 205);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  for (const name of ['The garden', 'Adventures', 'Rewards', 'Journal', 'Our pet']) {
    await bottom.getByRole('button', { name, exact: true }).click();
    await expect(bottom.getByRole('button', { name, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error(`Overflow on ${name}`);
    await page.clock.fastForward(250);
    if (shots)
      await page.screenshot({
        path: `${shots}/mobile-${name.replaceAll(' ', '-').toLowerCase()}.png`,
        fullPage: false,
      });
  }
  // Touch targets react immediately without spending mana or changing shared scores.
  await page.getByRole('button', { name: 'Poke Uni', exact: true }).click();
  await expect(page.getByRole('img', { name: 'cloud character poke' })).toBeVisible();
  await page.getByRole('button', { name: 'Pet Uni’s head', exact: true }).click();
  await expect(page.getByRole('img', { name: 'cloud character head' })).toBeVisible();
  await page.getByRole('button', { name: 'Pet Uni’s belly', exact: true }).click();
  await expect(page.getByRole('img', { name: 'cloud character belly' })).toBeVisible();
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  await expect(page.locator('.snack-delivery')).toBeVisible();
  await expect(page.getByRole('img', { name: 'cloud character feed' })).toBeVisible();
  // Rapid care is queued, then confirmed once without another tap.
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.locator('.queue-status')).toContainText('queued');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.clock.fastForward(11000);
  await expect(page.getByRole('progressbar', { name: 'Energy' })).toHaveAttribute(
    'aria-valuenow',
    '90',
  );
  await expect(page.locator('.queue-status')).toHaveCount(0);
  await page.getByRole('button', { name: /Healthy meal/ }).click();
  await expect(page.locator('.queue-status')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel waiting' }).click();
  await expect(page.locator('.queue-status')).toHaveCount(0);
  // The track follows a finger before release, with the neighboring screen already rendered.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 310, y: 130 }],
  });
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 190, y: 132 }],
  });
  await expect(page.locator('.screen-viewport')).toHaveClass(/is-dragging/);
  const transform = await page
    .locator('.screen-track')
    .evaluate((el) => getComputedStyle(el).transform);
  if (Number(transform.split(',')[4]) !== -120) throw new Error('Page did not follow the finger');
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(bottom.getByRole('button', { name: 'The garden', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.locator('.screen-track')).toHaveCSS('transition-duration', '0.36s');
  await touch.detach();
  if (errors.length) throw new Error(errors.join('\n'));
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  await page.getByRole('button', { name: 'Start my playground visit' }).click();
  await expect(page.getByRole('progressbar', { name: 'Full tummy' })).toHaveAttribute(
    'aria-valuenow',
    '82',
  );
  // Confirmed changes from another actor appear after the next shared-state read.
  await page.evaluate(() => {
    const key = 'uni-pet-playground-v1';
    const state = JSON.parse(localStorage.getItem(key));
    const actor = 'friendly-visitor';
    state.owners[actor] = { ...state.owners['playground-you'], address: actor, score: 99 };
    state.view.pet.actions++;
    state.view.events.unshift({
      sequence: state.view.pet.actions,
      actor,
      kind: 'feed',
      points: 10,
      time: String(Date.now()),
    });
    state.view.board.entries.unshift({
      address: actor,
      score: 99,
      sequence: state.view.pet.actions,
    });
    localStorage.setItem(key, JSON.stringify(state));
  });
  await page.clock.runFor(5100);
  await expect(page.locator('.social-bubble')).toContainText('new favorite');
  await expect(page.locator('.speech-bubble')).toContainText('gave Uni a snack');
  await page.clock.fastForward(11000);
  await page.getByRole('button', { name: /Gentle guidance/ }).click();
  await expect(page.getByRole('alert')).toContainText('guidance');
  await page.clock.fastForward(7000);
  await expect(page.getByRole('alert')).toHaveCount(0);
  // Configuration failures must not silently turn into local gameplay.
  await page.route('**/uni-pet.config.json', (route) =>
    route.fulfill({
      json: { mode: 'chain', network: 'harbinger', rpcUrls: [], contractId: '', chainId: '' },
    }),
  );
  await page.reload();
  await expect(visibleText('The on-chain pet has not been configured yet.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Feed / })).toHaveCount(0);
  console.log(
    'Browser checks passed: care, affection, planting, watering, timed harvest, crafting, contribution, adventure, character persistence, share download, journal, reward eligibility, responsive navigation, finger-tracking slides, pet touch reactions, food animation, first-action continuation, queued care and cancellation, social activity, favorite changes, fading errors, fixed bottom tabs, vertical-scroll and dialog isolation, and configuration failure.',
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
