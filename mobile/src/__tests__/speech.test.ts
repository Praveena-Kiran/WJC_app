import { describe, it, expect, vi } from 'vitest';
import { speakJapanese, checkJapaneseVoiceAvailable } from '../lib/speech';

vi.mock('expo-speech', () => ({
  speak: vi.fn(),
  getAvailableVoicesAsync: vi.fn().mockResolvedValue([{ language: 'ja-JP', name: 'Kyoko' }]),
}));

describe('Japanese Speech Utility & TTS Notice (Issues #130, #133)', () => {
  it('speakJapanese invokes speech engine without error', async () => {
    await expect(speakJapanese('こんにちは')).resolves.not.toThrow();
  });

  it('checkJapaneseVoiceAvailable detects Japanese voice presence', async () => {
    const isAvailable = await checkJapaneseVoiceAvailable();
    expect(isAvailable).toBe(true);
  });
});
