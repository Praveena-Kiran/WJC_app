import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('App Asset & Font Configuration (Issue #135 / #060)', () => {
  it('app.json contains splash icon settings', () => {
    const appJsonPath = path.resolve(__dirname, '../../app.json');
    expect(fs.existsSync(appJsonPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    expect(config.expo.splash.image).toBe('./assets/images/splash-icon.png');
  });
});
