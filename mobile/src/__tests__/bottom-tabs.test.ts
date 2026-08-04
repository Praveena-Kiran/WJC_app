import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Bottom Tabs Navigation Layout (Issue #150 / #019)', () => {
  it('configures 5 tabs in app/(tabs)/_layout.tsx', () => {
    const layoutPath = path.resolve(__dirname, '../../app/(tabs)/_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const code = fs.readFileSync(layoutPath, 'utf-8');
    expect(code).toContain('name="index"');
    expect(code).toContain('name="kana"');
    expect(code).toContain('name="kanji"');
    expect(code).toContain('name="dictionary"');
    expect(code).toContain('name="quiz"');
  });

  it('implements floating glassmorphic TabBar without haptic feedback', () => {
    const tabBarPath = path.resolve(__dirname, '../components/navigation/TabBar.tsx');
    expect(fs.existsSync(tabBarPath)).toBe(true);

    const code = fs.readFileSync(tabBarPath, 'utf-8');
    expect(code).toContain("import { BlurView } from 'expo-blur'");
    expect(code).toContain("position: 'absolute'");
    expect(code).toContain('borderRadius: 32');
    expect(code).not.toContain('triggerHaptic');
  });
});
