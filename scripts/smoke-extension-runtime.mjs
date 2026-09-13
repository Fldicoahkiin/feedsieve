/** Real MV3 cold-start and recovery acceptance. Requires: pnpm exec playwright install chromium */
import { chromium } from 'playwright';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const source = resolve('apps/extension/.output/chrome-mv3');
const manifest = JSON.parse(readFileSync(join(source, 'manifest.json'), 'utf8'));
assert(
  !(manifest.web_accessible_resources ?? []).some((e) =>
    e.resources.some((p) => p.includes('community') || p === '*' || p === '**'),
  ),
);
const fixture = (handle, text) =>
  `<div data-testid="cellInnerDiv" id="${handle}"><article data-testid="tweet"><div data-testid="User-Name"><a href="/${handle}"><span>测试用户</span></a><a href="/${handle}"><span>@${handle}</span></a></div><a href="/${handle}/status/1720000000000000000"><time>now</time></a><div data-testid="tweetText">${text}</div><div role="group"><button data-testid="like">Like</button></div></article></div>`;

async function run(degraded) {
  const temp = mkdtempSync(join(tmpdir(), 'feedsieve-mv3-'));
  const extension = join(temp, 'extension');
  cpSync(source, extension, { recursive: true });
  const variantPath = join(extension, 'community/keyword-packs/variant-tables.json');
  const variants = readFileSync(variantPath);
  if (degraded) rmSync(variantPath);
  const context = await chromium.launchPersistentContext(join(temp, 'profile'), {
    channel: 'chromium',
    headless: true,
    // Block external networking from process launch, including onInstalled SW fetches.
    proxy: { server: 'http://127.0.0.1:9' },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  });
  try {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await context.setOffline(true);
    await worker.evaluate(async () => {
      // eslint-disable-next-line no-undef
      await chrome.storage.local.clear();
    });
    await context.route('https://x.com/**', (route) =>
      route.fulfill({
        contentType: 'text/html; charset=utf-8',
        body: `<!doctype html><html><body><main>${fixture('literalcase', '全国空降')}${fixture('variantcase', '全國空降')}${fixture('normalcase', '今天去公园散步，天气很好。')}</main></body></html>`,
      }),
    );
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('https://x.com/home');
    await page
      .waitForSelector('#literalcase .fs-badge', { timeout: 30_000 })
      .catch(async (error) => {
        console.error('Content errors:', errors);
        console.error('Fixture DOM:', await page.content());
        throw error;
      });
    if (degraded) {
      // Rules must work while variant loading fails. Restore the file without reloading X.
      assert(errors.some((e) => e.includes('变体表加载失败')));
      assert.equal(await page.locator('#variantcase .fs-badge').count(), 0);
      writeFileSync(variantPath, variants);
    }
    await page.waitForSelector('#variantcase .fs-badge', { timeout: 30_000 });
    assert.equal(await page.locator('#normalcase .fs-badge').count(), 0);
    const stored = await worker.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const values = await chrome.storage.local.get(null);
      return {
        keys: Object.keys(values),
        bundles: Object.entries(values)
          .filter(([k]) => k.startsWith('bundledData:'))
          .map(([key, v]) => ({ key, version: v.version })),
      };
    });
    assert.equal(stored.bundles.length, 3);
    assert(stored.bundles.every((v) => v.version === manifest.version));
    assert(
      !stored.keys.includes('keywordPacksSnapshotV2'),
      'Offline bundle must not masquerade as remote sync',
    );
    assert(
      !stored.keys.includes('communitySnapshotV2'),
      'Offline bundle must not masquerade as remote sync',
    );
    await page.reload();
    await page.waitForSelector('#variantcase .fs-badge');
    assert.equal(await page.locator('#normalcase .fs-badge').count(), 0);
    console.log(
      JSON.stringify({
        scenario: degraded ? 'missing-variant-recovery' : 'offline-cold-and-warm-start',
        version: manifest.version,
        bundles: stored.bundles,
        passed: true,
      }),
    );
  } finally {
    await context.close();
    rmSync(temp, { recursive: true, force: true });
  }
}
await run(false);
await run(true);
