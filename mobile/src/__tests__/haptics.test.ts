import { describe, it, expect, vi } from 'vitest';
import { triggerHaptic } from '../lib/haptics';

vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

describe('Haptics Utility (Issue #137 / #062)', () => {
  it('triggerHaptic invokes impactAsync and notificationAsync without throwing', async () => {
    await expect(triggerHaptic('light')).resolves.not.toThrow();
    await expect(triggerHaptic('success')).resolves.not.toThrow();
  });
});
