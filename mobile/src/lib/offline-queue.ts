import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = '@zengo_offline_queue';

export async function getOfflineQueue(): Promise<QueuedAction[]> {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('[OfflineQueue] Failed to load queue:', error);
    return [];
  }
}

export async function enqueueOfflineAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<void> {
  const queue = await getOfflineQueue();
  const newItem: QueuedAction = {
    ...action,
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };
  queue.push(newItem);
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
}
