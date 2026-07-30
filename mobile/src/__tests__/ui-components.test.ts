import { describe, it, expect } from 'vitest';
import { sfxPlayer } from '../lib/sfx-player';
import * as fs from 'fs';
import * as path from 'path';

describe('UI Primitives & Navigation (Issues #018, #019b, #020, #021, #030, #031)', () => {
  it('sfxPlayer manages soundEnabled state and playSound', () => {
    expect(sfxPlayer.isSoundEnabled()).toBe(true);
    sfxPlayer.setSoundEnabled(false);
    expect(sfxPlayer.isSoundEnabled()).toBe(false);
    sfxPlayer.setSoundEnabled(true);
  });

  it('verifies existence of UI components and screen routes', () => {
    const headerPath = path.resolve(__dirname, '../components/MobileHeader.tsx');
    const bannerPath = path.resolve(__dirname, '../components/SoundBanner.tsx');
    const bonsaiPath = path.resolve(__dirname, '../components/dashboard/BonsaiGarden.tsx');
    const timelinePath = path.resolve(__dirname, '../components/dashboard/PebbleTimeline.tsx');
    const moreMenuPath = path.resolve(__dirname, '../../app/more/index.tsx');

    expect(fs.existsSync(headerPath)).toBe(true);
    expect(fs.existsSync(bannerPath)).toBe(true);
    expect(fs.existsSync(bonsaiPath)).toBe(true);
    expect(fs.existsSync(timelinePath)).toBe(true);
    expect(fs.existsSync(moreMenuPath)).toBe(true);
  });
});
