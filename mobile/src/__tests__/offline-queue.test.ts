import { describe, it, expect, vi, beforeEach } from 'vitest';

const memoryStore: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(memoryStore[key] || null)),
    setItem: vi.fn((key: string, value: string) => {
      memoryStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete memoryStore[key];
      return Promise.resolve();
    }),
  },
}));

import {
  getOfflineQueue,
  enqueueOfflineAction,
  clearOfflineQueue,
} from '../lib/offline-queue';

describe('Offline Queue Sync & AsyncStorage Cache (Issue #134 / #058)', () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  it('starts with an empty queue', async () => {
    const queue = await getOfflineQueue();
    expect(queue).toEqual([]);
  });

  it('enqueues actions and persists to storage', async () => {
    await enqueueOfflineAction({ type: 'MARK_ATTENDANCE', payload: { studentId: 's1' } });
    const queue = await getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].type).toBe('MARK_ATTENDANCE');
  });
});
