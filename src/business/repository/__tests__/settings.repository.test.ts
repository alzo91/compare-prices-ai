import { DEFAULT_SETTINGS } from '@/models/Settings';

import { KeyValueSettingsRepository } from '../kv-settings.repository';
import { MemoryStorage } from '../storage/memory-storage';

describe('KeyValueSettingsRepository', () => {
  it('returns defaults when nothing is stored', async () => {
    expect(await new KeyValueSettingsRepository(new MemoryStorage()).get()).toEqual(
      DEFAULT_SETTINGS,
    );
  });

  it('merges a patch over the current settings', async () => {
    const repo = new KeyValueSettingsRepository(new MemoryStorage());
    expect(await repo.update({ roundCents: true })).toEqual({
      ...DEFAULT_SETTINGS,
      roundCents: true,
    });
    expect(await repo.update({ displayBasis: 'per100' })).toEqual({
      ...DEFAULT_SETTINGS,
      roundCents: true,
      displayBasis: 'per100',
    });
  });

  it('persists across a restart (new repository, same storage)', async () => {
    const storage = new MemoryStorage();
    await new KeyValueSettingsRepository(storage).update({ language: 'en-US', roundCents: true });
    expect(await new KeyValueSettingsRepository(storage).get()).toEqual({
      ...DEFAULT_SETTINGS,
      language: 'en-US',
      roundCents: true,
    });
  });

  it('fills fields missing from older stored data with defaults', async () => {
    const storage = new MemoryStorage();
    storage.set('settings.v1', JSON.stringify({ roundCents: true }));
    expect(await new KeyValueSettingsRepository(storage).get()).toEqual({
      ...DEFAULT_SETTINGS,
      roundCents: true,
    });
  });

  it('falls back to defaults on corrupt data and recovers on update', async () => {
    const storage = new MemoryStorage();
    const repo = new KeyValueSettingsRepository(storage);
    for (const bad of ['{oops', 'null', '[1]', '"x"']) {
      storage.set('settings.v1', bad);
      expect(await repo.get()).toEqual(DEFAULT_SETTINGS);
    }
    expect(await repo.update({ roundCents: true })).toEqual({
      ...DEFAULT_SETTINGS,
      roundCents: true,
    });
  });

  it('reset restores defaults and persists them', async () => {
    const storage = new MemoryStorage();
    const repo = new KeyValueSettingsRepository(storage);
    await repo.update({ roundCents: true });
    expect(await repo.reset()).toEqual(DEFAULT_SETTINGS);
    expect(await new KeyValueSettingsRepository(storage).get()).toEqual(DEFAULT_SETTINGS);
  });
});
