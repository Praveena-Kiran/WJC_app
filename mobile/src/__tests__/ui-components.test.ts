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
    const bonsaiPath = path.resolve(__dirname, '../components/dashboard/BonsaiGarden.tsx');
    const timelinePath = path.resolve(__dirname, '../components/dashboard/PebbleTimeline.tsx');
    const moreMenuPath = path.resolve(__dirname, '../../app/more/index.tsx');

    expect(fs.existsSync(headerPath)).toBe(true);
    expect(fs.existsSync(bonsaiPath)).toBe(true);
    expect(fs.existsSync(timelinePath)).toBe(true);
    expect(fs.existsSync(moreMenuPath)).toBe(true);
  });

  it('verifies settings screen and layout contain return button handler', () => {
    const settingsPath = path.resolve(__dirname, '../../app/more/settings.tsx');
    const layoutPath = path.resolve(__dirname, '../../app/more/_layout.tsx');

    const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    expect(settingsContent).toContain('handleBack');
    expect(settingsContent).toContain('headerLeft');
    expect(layoutContent).toContain('renderBackButton');
    expect(layoutContent).toContain('headerLeft: renderBackButton');
  });
});

