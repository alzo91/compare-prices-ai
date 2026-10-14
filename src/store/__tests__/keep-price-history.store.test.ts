import { KeyValueSettingsRepository } from '@/business/repository/kv-settings.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { createKeepPriceHistoryStore } from '../keep-price-history.store';

function setup() {
  const repository = new KeyValueSettingsRepository(new MemoryStorage());
  return { repository, store: createKeepPriceHistoryStore(repository) };
}

describe('keep price history store', () => {
  it('starts on, as in the Ajustes Designer screen', () => {
    expect(setup().store.getSnapshot()).toBe(true);
  });

  it('persists the choice and a new store loads it back (restart)', async () => {
    const { repository, store } = setup();
    await store.setEnabled(false);
    expect(store.getSnapshot()).toBe(false);
    expect((await repository.get()).keepPriceHistory).toBe(false);

    const restarted = createKeepPriceHistoryStore(repository);
    await restarted.load();
    expect(restarted.getSnapshot()).toBe(false);
  });

  it('keeps the other settings untouched', async () => {
    const { repository, store } = setup();
    await repository.update({ roundCents: true });
    await store.setEnabled(false);
    expect((await repository.get()).roundCents).toBe(true);
  });

  it('notifies subscribers only on a real change', async () => {
    const { store } = setup();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.setEnabled(false);
    await store.setEnabled(false);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    await store.setEnabled(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reloads the default after the settings were wiped', async () => {
    const { repository, store } = setup();
    await store.setEnabled(false);
    await repository.reset();
    await store.load();
    expect(store.getSnapshot()).toBe(true);
  });
});
