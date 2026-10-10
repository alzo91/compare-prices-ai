import type { ComparisonInput } from '@/models/Comparison';

import { KeyValueComparisonRepository } from '../kv-comparison.repository';
import { MemoryStorage } from '../storage/memory-storage';

const input = (name: string, cents = 459): ComparisonInput => ({
  product: { name },
  entries: [{ id: 'e1', priceCents: cents, quantity: 1, unit: 'L' }],
});

function setup() {
  const storage = new MemoryStorage();
  let n = 0;
  let clock = Date.parse('2026-01-01T00:00:00.000Z');
  const make = () =>
    new KeyValueComparisonRepository(storage, {
      generateId: () => `id-${++n}`,
      now: () => new Date((clock += 1000)),
    });
  return { storage, repo: make(), make };
}

describe('KeyValueComparisonRepository', () => {
  it('starts empty', async () => {
    const { repo } = setup();
    expect(await repo.list()).toEqual([]);
    expect(await repo.get('nope')).toBeUndefined();
  });

  it('creates and reads a comparison', async () => {
    const { repo } = setup();
    const created = await repo.create(input('Leite'));
    expect(created).toMatchObject({ id: 'id-1', product: { name: 'Leite' } });
    expect(created.createdAt).toBe(created.updatedAt);
    expect(await repo.get('id-1')).toEqual(created);
    expect(await repo.list()).toEqual([created]);
  });

  it('lists newest updatedAt first', async () => {
    const { repo } = setup();
    const a = await repo.create(input('A'));
    const b = await repo.create(input('B'));
    const c = await repo.create(input('C'));
    expect((await repo.list()).map((x) => x.id)).toEqual([c.id, b.id, a.id]);
    await repo.update(a.id, input('A2'));
    expect((await repo.list()).map((x) => x.id)).toEqual([a.id, c.id, b.id]);
  });

  it('puts the latest written first when timestamps tie', async () => {
    let n = 0;
    const repo = new KeyValueComparisonRepository(new MemoryStorage(), {
      generateId: () => `id-${++n}`,
      now: () => new Date('2026-01-01T00:00:00.000Z'),
    });
    await repo.create(input('A'));
    await repo.create(input('B'));
    expect((await repo.list()).map((x) => x.id)).toEqual(['id-2', 'id-1']);
  });

  it('updates content and updatedAt but keeps id and createdAt', async () => {
    const { repo } = setup();
    const created = await repo.create(input('Leite', 459));
    const updated = await repo.update(created.id, input('Leite integral', 500));
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt > created.updatedAt).toBe(true);
    expect(updated.product.name).toBe('Leite integral');
    expect(updated.entries[0].priceCents).toBe(500);
    expect(await repo.get(created.id)).toEqual(updated);
  });

  it('throws when updating an unknown id and writes nothing', async () => {
    const { repo } = setup();
    const created = await repo.create(input('A'));
    await expect(repo.update('missing', input('X'))).rejects.toThrow('Comparison not found');
    expect(await repo.list()).toEqual([created]);
  });

  it('removes a comparison and ignores unknown ids', async () => {
    const { repo } = setup();
    const a = await repo.create(input('A'));
    const b = await repo.create(input('B'));
    await repo.remove(a.id);
    expect(await repo.get(a.id)).toBeUndefined();
    expect(await repo.list()).toEqual([b]);
    await expect(repo.remove('missing')).resolves.toBeUndefined();
    expect(await repo.list()).toEqual([b]);
  });

  it('persists across a restart (new repository, same storage)', async () => {
    const { repo, make } = setup();
    const created = await repo.create(input('Leite'));
    expect(await make().get(created.id)).toEqual(created);
  });

  it('throws on corrupt data instead of overwriting it', async () => {
    const { storage, repo } = setup();
    storage.set('comparisons.v1', '{not json');
    await expect(repo.list()).rejects.toThrow();
    await expect(repo.create(input('A'))).rejects.toThrow();
    expect(storage.getString('comparisons.v1')).toBe('{not json');
  });
});
