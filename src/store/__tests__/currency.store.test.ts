import { KeyValueSettingsRepository } from '@/business/repository/kv-settings.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { createCurrencyStore } from '../currency.store';

function setup() {
  const storage = new MemoryStorage();
  const repository = new KeyValueSettingsRepository(storage);
  return { storage, repository, store: createCurrencyStore(repository) };
}

describe('currency store', () => {
  it('defaults to Real (BRL)', async () => {
    const { store } = setup();
    expect(store.getSnapshot()).toBe('BRL');
    await store.load();
    expect(store.getSnapshot()).toBe('BRL');
  });

  it('persists the choice and a new store loads it back (restart)', async () => {
    const { repository, store } = setup();
    await store.setCurrency('USD');
    expect(store.getSnapshot()).toBe('USD');
    expect((await repository.get()).currency).toBe('USD');

    const restarted = createCurrencyStore(repository);
    await restarted.load();
    expect(restarted.getSnapshot()).toBe('USD');
  });

  it('keeps the other settings untouched', async () => {
    const { repository, store } = setup();
    await repository.update({ roundCents: true, displayBasis: 'unit' });
    await store.setCurrency('EUR');
    const settings = await repository.get();
    expect(settings.roundCents).toBe(true);
    expect(settings.displayBasis).toBe('unit');
  });

  it('notifies subscribers only on a real change', async () => {
    const { store } = setup();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.setCurrency('EUR');
    await store.setCurrency('EUR');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    await store.setCurrency('BRL');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('falls back to BRL for an unknown stored currency', async () => {
    const { storage, store } = setup();
    await store.setCurrency('USD');
    storage.set('settings.v1', JSON.stringify({ currency: 'XYZ' }));
    await store.load();
    expect(store.getSnapshot()).toBe('BRL');
  });

  it('reloads the default after the settings were wiped', async () => {
    const { repository, store } = setup();
    await store.setCurrency('EUR');
    await repository.reset();
    await store.load();
    expect(store.getSnapshot()).toBe('BRL');
  });
});
