import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Docker Containerization Config (Issue #146 / #015)', () => {
  it('Dockerfile and docker-compose.yml exist and specify container environment', () => {
    const dockerfilePath = path.resolve(__dirname, '../../../Dockerfile');
    const composePath = path.resolve(__dirname, '../../../docker-compose.yml');

    expect(fs.existsSync(dockerfilePath)).toBe(true);
    expect(fs.existsSync(composePath)).toBe(true);

    const dockerfile = fs.readFileSync(dockerfilePath, 'utf-8');
    expect(dockerfile).toContain('FROM node:20-alpine');
    expect(dockerfile).toContain('EXPOSE 3000');
  });
});
