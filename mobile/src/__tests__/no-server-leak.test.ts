/**
 * no-server-leak.test.ts
 *
 * Validates that the Metro blockList config and ESLint no-restricted-imports
 * guard are in place for the client-server boundary (Issue #004b).
 *
 * Note: Metro blockList enforcement is verified manually by temporarily
 * adding a server import and confirming Metro throws a ResolutionError.
 * See Issue #004b validation checklist.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ROOT = mobile/ directory (two levels up from src/__tests__/)
const ROOT = path.resolve(__dirname, '../..');

describe('Client-Server Boundary Guard (#004b)', () => {
  it('metro.config.js exists and contains blockList configuration', () => {
    const metroConfigPath = path.join(ROOT, 'metro.config.js');
    expect(fs.existsSync(metroConfigPath), 'metro.config.js should exist').toBe(true);
    const metroConfig = fs.readFileSync(metroConfigPath, 'utf-8');
    expect(metroConfig).toContain('blockList');
    expect(metroConfig).toContain('server');
    expect(metroConfig).toContain('prisma');
    expect(metroConfig).toContain('@aws-sdk');
  });

  it('.eslintrc.js exists and defines no-restricted-imports for server packages', () => {
    const eslintConfigPath = path.join(ROOT, '.eslintrc.js');
    expect(fs.existsSync(eslintConfigPath), '.eslintrc.js should exist').toBe(true);
    const eslintConfig = fs.readFileSync(eslintConfigPath, 'utf-8');
    expect(eslintConfig).toContain('no-restricted-imports');
    expect(eslintConfig).toContain('@prisma/client');
    expect(eslintConfig).toContain('hono');
    expect(eslintConfig).toContain('@aws-sdk/client-s3');
  });

  it('.env.example exists in mobile root and is tracked (not a real secret)', () => {
    const envExample = path.join(ROOT, '.env.example');
    expect(fs.existsSync(envExample), '.env.example should exist').toBe(true);
    const contents = fs.readFileSync(envExample, 'utf-8');
    // Must contain placeholder values, not real credentials
    expect(contents).toContain('EXPO_PUBLIC_API_URL');
    expect(contents).toContain('DATABASE_URL');
    expect(contents).not.toContain('neondb_owner'); // no real creds
  });
});
