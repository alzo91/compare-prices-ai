import { KeyValueSettingsRepository } from '@/business/repository/kv-settings.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { createRoundCentsStore } from '../round-cents.store';

function setup() {
  const repository = new KeyValueSettingsRepository(new MemoryStorage());
  return { repository, store: createRoundCentsStore(repository) };
}

describe('round cents store', () => {
  it('starts off', () => {
    expect(setup().store.getSnapshot()).toBe(false);
  });

  it('persists the choice and a new store loads it back (restart)', async () => {
    const { repository, store } = setup();
    await store.setEnabled(true);
    expect(store.getSnapshot()).toBe(true);
    expect((await repository.get()).roundCents).toBe(true);

    const restarted = createRoundCentsStore(repository);
    await restarted.load();
    expect(restarted.getSnapshot()).toBe(true);
  });

  it('keeps the other settings untouched', async () => {
    const { repository, store } = setup();
    await repository.update({ displayBasis: 'unit' });
    await store.setEnabled(true);
    expect((await repository.get()).displayBasis).toBe('unit');
  });

  it('notifies subscribers only on a real change', async () => {
    const { store } = setup();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.setEnabled(true);
    await store.setEnabled(true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    await store.setEnabled(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reloads defaults after the settings were wiped', async () => {
    const { repository, store } = setup();
    await store.setEnabled(true);
    await repository.reset();
    await store.load();
    expect(store.getSnapshot()).toBe(false);
  });
});
