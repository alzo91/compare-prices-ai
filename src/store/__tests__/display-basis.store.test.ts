import { KeyValueSettingsRepository } from '@/business/repository/kv-settings.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { createDisplayBasisStore } from '../display-basis.store';

function setup() {
  const storage = new MemoryStorage();
  const repository = new KeyValueSettingsRepository(storage);
  return { repository, store: createDisplayBasisStore(repository) };
}

describe('display basis store', () => {
  it('starts on the default basis (kg · L)', () => {
    expect(setup().store.getSnapshot()).toBe('base');
  });

  it('persists the choice and a new store loads it back (restart)', async () => {
    const { repository, store } = setup();
    await store.setBasis('per100');
    expect(store.getSnapshot()).toBe('per100');
    expect((await repository.get()).displayBasis).toBe('per100');

    const restarted = createDisplayBasisStore(repository);
    await restarted.load();
    expect(restarted.getSnapshot()).toBe('per100');
  });

  it('keeps the other settings untouched', async () => {
    const { repository, store } = setup();
    await repository.update({ roundCents: true });
    await store.setBasis('unit');
    expect((await repository.get()).roundCents).toBe(true);
  });

  it('notifies subscribers only on a real change', async () => {
    const { store } = setup();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.setBasis('unit');
    await store.setBasis('unit');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    await store.setBasis('base');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reloads defaults after the settings were wiped', async () => {
    const { repository, store } = setup();
    await store.setBasis('unit');
    await repository.reset();
    await store.load();
    expect(store.getSnapshot()).toBe('base');
  });
});
