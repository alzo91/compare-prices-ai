import { KeyValueSettingsRepository } from '@/business/repository/kv-settings.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { createLanguageStore, normalizeLanguagePreference } from '../language.store';

function setup(storage = new MemoryStorage()) {
  const repository = new KeyValueSettingsRepository(storage);
  return { storage, repository, store: createLanguageStore(repository) };
}

describe('language store', () => {
  it('follows the device by default', async () => {
    const { store } = setup();
    expect(store.getSnapshot()).toBe('device');
    await store.load();
    expect(store.getSnapshot()).toBe('device');
  });

  it('persists the choice and a new store loads it back (restart)', async () => {
    const { repository, store } = setup();
    await store.setPreference('en-US');
    expect(store.getSnapshot()).toBe('en-US');
    expect((await repository.get()).languagePreference).toBe('en-US');

    const restarted = createLanguageStore(repository);
    await restarted.load();
    expect(restarted.getSnapshot()).toBe('en-US');
  });

  it('keeps the other settings untouched', async () => {
    const { repository, store } = setup();
    await repository.update({ roundCents: true });
    await store.setPreference('pt-BR');
    expect((await repository.get()).roundCents).toBe(true);
  });

  it('notifies subscribers only on a real change', async () => {
    const { store } = setup();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.setPreference('en-US');
    await store.setPreference('en-US');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    await store.setPreference('device');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('falls back to "device" for unknown stored values and after a wipe', async () => {
    const { storage, repository, store } = setup();
    storage.set('settings.v1', JSON.stringify({ languagePreference: 'xx' }));
    await store.load();
    expect(store.getSnapshot()).toBe('device');

    await store.setPreference('en-US');
    await repository.reset();
    await store.load();
    expect(store.getSnapshot()).toBe('device');
  });

  it('normalizes preferences', () => {
    expect(normalizeLanguagePreference('pt-BR')).toBe('pt-BR');
    expect(normalizeLanguagePreference(undefined)).toBe('device');
    expect(normalizeLanguagePreference(42)).toBe('device');
  });
});
