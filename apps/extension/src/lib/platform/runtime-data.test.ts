import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const path = '/community/keyword-packs/official.json' as const;
let storage: Record<string, unknown>;
let listener: (message: unknown, sender: { id: string }) => unknown;
let api: ReturnType<typeof makeApi>;
function makeApi() {
  return {
    runtime: {
      id: 'test-extension',
      getManifest: () => ({ version: '0.9.1' }),
      getURL: (p: string) => `chrome-extension://test-extension${p}`,
      onMessage: {
        addListener: vi.fn((fn) => {
          listener = fn;
        }),
      },
      sendMessage: vi.fn(),
    },
    storage: {
      local: {
        get: vi.fn(async (key: string) => ({ [key]: storage[key] })),
        set: vi.fn(async (values: Record<string, unknown>) => {
          Object.assign(storage, values);
        }),
      },
    },
  };
}
beforeEach(() => {
  vi.resetModules();
  storage = {};
  api = makeApi();
  vi.stubGlobal('browser', api);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ packs: ['test'] }))),
  );
});
afterEach(() => vi.unstubAllGlobals());
describe('packaged data across extension contexts', () => {
  it('cold content context uses messaging, never page fetch', async () => {
    api.runtime.sendMessage.mockResolvedValue({ ok: true, data: { packs: ['test'] } });
    const { loadRuntimeData } = await import('./runtime-data');
    expect(await loadRuntimeData(path)).toEqual({ packs: ['test'] });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('worker seeds a separate versioned cache, shares concurrent reads, and warm content reads storage', async () => {
    const worker = await import('./runtime-data');
    worker.registerRuntimeDataWorker();
    await Promise.all([worker.loadRuntimeData(path), worker.loadRuntimeData(path)]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(Object.keys(storage)).toEqual([`bundledData:${path}`]);
    vi.resetModules();
    const content = await import('./runtime-data');
    expect(await content.loadRuntimeData(path)).toEqual({ packs: ['test'] });
    expect(api.runtime.sendMessage).not.toHaveBeenCalled();
  });
  it('upgrade ignores old bundled cache without modifying remote synchronization state', async () => {
    storage[`bundledData:${path}`] = { version: '0.9.0', data: 'old' };
    storage.keywordPacksSnapshotV2 = { synced_at: 123 };
    api.runtime.sendMessage.mockResolvedValue({ ok: true, data: 'new' });
    const { loadRuntimeData } = await import('./runtime-data');
    expect(await loadRuntimeData(path)).toBe('new');
    expect(storage.keywordPacksSnapshotV2).toEqual({ synced_at: 123 });
  });
  it('failed worker fetch can retry after recovery', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('temporarily unavailable'));
    const worker = await import('./runtime-data');
    worker.registerRuntimeDataWorker();
    await expect(worker.loadRuntimeData(path)).rejects.toThrow('temporarily');
    expect(await worker.loadRuntimeData(path)).toEqual({ packs: ['test'] });
  });
  it('only permits packaged allowlisted resources from this extension', async () => {
    const worker = await import('./runtime-data');
    worker.registerRuntimeDataWorker();
    for (const [requested, id] of [
      ['https://evil.test', 'test-extension'],
      [path, 'other-extension'],
    ] as const) {
      expect(
        await listener({ type: worker.RUNTIME_DATA_MESSAGE, path: requested }, { id }),
      ).toMatchObject({ ok: false });
    }
    expect(fetch).not.toHaveBeenCalled();
    expect(
      await listener({ type: worker.RUNTIME_DATA_MESSAGE, path }, { id: 'test-extension' }),
    ).toMatchObject({ ok: true });
  });
});

it('browser keyword loader retries rejected messages instead of caching failure forever', async () => {
  const { readFileSync } = await import('node:fs');
  const catalog = JSON.parse(readFileSync('community/keyword-packs/official.json', 'utf8'));
  api.runtime.sendMessage.mockRejectedValueOnce(new Error('worker restarting'));
  api.runtime.sendMessage.mockResolvedValueOnce({ ok: true, data: catalog });
  const { loadBundledKeywordPackCatalog } = await import('../detection/keyword-packs');
  await expect(loadBundledKeywordPackCatalog()).rejects.toThrow('worker restarting');
  expect((await loadBundledKeywordPackCatalog()).packs.length).toBeGreaterThan(0);
  expect(fetch).not.toHaveBeenCalled();
});

it('variant recovery clears normalization results produced during degraded startup', async () => {
  api.runtime.sendMessage.mockRejectedValueOnce(new Error('worker restarting'));
  api.runtime.sendMessage.mockResolvedValueOnce({
    ok: true,
    data: {
      trad_simp: { 國: '国' },
      radicals: {},
      confusables: {},
    },
  });
  const { ensureVariantTables, normalizeKeywordPhrase } =
    await import('../detection/keyword-rules');
  expect(normalizeKeywordPhrase('國')).toBe('國');
  await expect(ensureVariantTables()).rejects.toThrow('worker restarting');
  await ensureVariantTables();
  expect(normalizeKeywordPhrase('國')).toBe('国');
  expect(fetch).not.toHaveBeenCalled();
});

it('storage quota failure does not discard successfully read packaged data', async () => {
  api.storage.local.set.mockRejectedValueOnce(new Error('QUOTA_BYTES'));
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const worker = await import('./runtime-data');
    worker.registerRuntimeDataWorker();
    expect(await worker.loadRuntimeData(path)).toEqual({ packs: ['test'] });
    expect(log).toHaveBeenCalled();
  } finally {
    log.mockRestore();
  }
});
