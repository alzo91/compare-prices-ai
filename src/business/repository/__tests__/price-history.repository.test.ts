import {
  KeyValuePriceHistoryRepository,
  MAX_PRICES_PER_PRODUCT_UNIT,
  PRICE_HISTORY_KEY,
} from '../kv-price-history.repository';
import { recordPriceHistory, suggestPrices } from '../price-history.suggestions';
import { MemoryStorage } from '../storage/memory-storage';

// Each call returns a later timestamp, so "most recent first" is deterministic.
function clock() {
  let t = Date.UTC(2026, 0, 1);
  return () => new Date((t += 1000));
}

function setup() {
  const storage = new MemoryStorage();
  return { storage, repo: new KeyValuePriceHistoryRepository(storage, { now: clock() }) };
}

describe('KeyValuePriceHistoryRepository', () => {
  it('is empty when nothing is stored', async () => {
    const { repo } = setup();
    expect(await repo.suggestions('Leite', 'L')).toEqual([]);
    expect(await repo.listForProduct('Leite')).toEqual([]);
  });

  it('stores prices per product and unit, most recent first', async () => {
    const { repo } = setup();
    await repo.record('Leite', [
      { priceCents: 459, unit: 'L' },
      { priceCents: 5000, unit: 'L' },
    ]);
    await repo.record('Leite', [{ priceCents: 489, unit: 'L' }]);
    await repo.record('Leite', [{ priceCents: 120, unit: 'mL' }]);
    await repo.record('Arroz', [{ priceCents: 2490, unit: 'kg' }]);

    expect(await repo.suggestions('Leite', 'L', 10)).toEqual([489, 459, 5000]);
    expect(await repo.suggestions('Leite', 'mL')).toEqual([120]);
    expect(await repo.suggestions('Arroz', 'kg')).toEqual([2490]);
    expect(await repo.suggestions('Arroz', 'L')).toEqual([]);
  });

  it('matches product names ignoring case and extra spaces', async () => {
    const { repo } = setup();
    await repo.record('  Leite   Integral ', [{ priceCents: 459, unit: 'L' }]);
    expect(await repo.suggestions('leite integral', 'L')).toEqual([459]);
  });

  it('re-recording a known price moves it to the front without duplicating it', async () => {
    const { repo } = setup();
    await repo.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    await repo.record('Leite', [{ priceCents: 489, unit: 'L' }]);
    await repo.record('Leite', [
      { priceCents: 459, unit: 'L' },
      { priceCents: 459, unit: 'L' },
    ]);
    expect(await repo.suggestions('Leite', 'L')).toEqual([459, 489]);
    expect(await repo.listForProduct('Leite')).toHaveLength(2);
  });

  it(`keeps at most ${MAX_PRICES_PER_PRODUCT_UNIT} prices per product + unit`, async () => {
    const { repo } = setup();
    for (let cents = 1; cents <= MAX_PRICES_PER_PRODUCT_UNIT + 5; cents++) {
      await repo.record('Leite', [{ priceCents: cents, unit: 'L' }]);
    }
    await repo.record('Leite', [{ priceCents: 999, unit: 'mL' }]);
    const leiteL = (await repo.listForProduct('Leite')).filter((e) => e.unit === 'L');
    expect(leiteL).toHaveLength(MAX_PRICES_PER_PRODUCT_UNIT);
    expect(leiteL[0].priceCents).toBe(MAX_PRICES_PER_PRODUCT_UNIT + 5);
    expect(await repo.suggestions('Leite', 'mL')).toEqual([999]);
  });

  it('ignores a blank product name or no prices', async () => {
    const { repo, storage } = setup();
    await repo.record('   ', [{ priceCents: 459, unit: 'L' }]);
    await repo.record('Leite', []);
    expect(storage.getString(PRICE_HISTORY_KEY)).toBeUndefined();
  });

  it('persists across a restart (new repository, same storage)', async () => {
    const { repo, storage } = setup();
    await repo.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    expect(await new KeyValuePriceHistoryRepository(storage).suggestions('Leite', 'L')).toEqual([
      459,
    ]);
  });

  it('treats corrupt data as empty and recovers on the next record', async () => {
    const { repo, storage } = setup();
    for (const bad of ['{oops', 'null', '{}', '"x"']) {
      storage.set(PRICE_HISTORY_KEY, bad);
      expect(await repo.listForProduct('Leite')).toEqual([]);
    }
    await repo.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    expect(await repo.suggestions('Leite', 'L')).toEqual([459]);
  });

  it('clear removes the whole history', async () => {
    const { repo, storage } = setup();
    await repo.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    await repo.clear();
    expect(storage.getString(PRICE_HISTORY_KEY)).toBeUndefined();
    expect(await repo.suggestions('Leite', 'L')).toEqual([]);
  });
});

describe('recordPriceHistory (on/off rule)', () => {
  it('stores the prices when "Manter histórico de preços" is on', async () => {
    const { repo } = setup();
    expect(await recordPriceHistory(repo, true, 'Leite', [{ priceCents: 459, unit: 'L' }])).toBe(
      true,
    );
    expect(await repo.suggestions('Leite', 'L')).toEqual([459]);
  });

  it('stores nothing new when off, and keeps the existing history', async () => {
    const { repo } = setup();
    await recordPriceHistory(repo, true, 'Leite', [{ priceCents: 459, unit: 'L' }]);
    expect(await recordPriceHistory(repo, false, 'Leite', [{ priceCents: 489, unit: 'L' }])).toBe(
      false,
    );
    expect(await recordPriceHistory(repo, false, 'Arroz', [{ priceCents: 2490, unit: 'kg' }])).toBe(
      false,
    );
    expect(await repo.suggestions('Leite', 'L')).toEqual([459]);
    expect(await repo.suggestions('Arroz', 'kg')).toEqual([]);
  });
});

describe('suggestPrices', () => {
  const entry = (priceCents: number, unit: 'L' | 'mL' = 'L') => ({
    productKey: 'leite',
    unit,
    priceCents,
    recordedAt: '2026-01-01T00:00:00.000Z',
  });

  it('returns distinct prices for the unit, in order, up to the limit (default 3)', () => {
    const entries = [entry(1), entry(2, 'mL'), entry(1), entry(3), entry(4), entry(5)];
    expect(suggestPrices(entries, 'L')).toEqual([1, 3, 4]);
    expect(suggestPrices(entries, 'L', 10)).toEqual([1, 3, 4, 5]);
    expect(suggestPrices(entries, 'mL')).toEqual([2]);
  });

  it('returns nothing without a unit', () => {
    expect(suggestPrices([entry(1)], null)).toEqual([]);
  });
});
