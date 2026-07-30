import { describe, it, expect } from 'vitest';
import { sfxBundler } from '../lib/sfx-bundler';
import { t } from '../lib/i18n';
import * as fs from 'fs';
import * as path from 'path';

describe('Low Complexity Utilities (Issues #024, #055, #056, #064, #039b, #067)', () => {
  it('sfxBundler registers and retrieves sound paths', () => {
    sfxBundler.registerSound('click', '/assets/click.wav');
    expect(sfxBundler.getSoundPath('click')).toBe('/assets/click.wav');
  });

  it('i18n translates English and Japanese keys', () => {
    expect(t('welcome', 'en')).toBe('Welcome to Zengo');
    expect(t('welcome', 'ja')).toBe('禅語へようこそ');
  });

  it('verifies existence of README.md and AGENTS.md documentation', () => {
    const readmePath = path.resolve(__dirname, '../../../README.md');
    const agentsPath = path.resolve(__dirname, '../../../AGENTS.md');

    expect(fs.existsSync(readmePath)).toBe(true);
    expect(fs.existsSync(agentsPath)).toBe(true);
  });
});
