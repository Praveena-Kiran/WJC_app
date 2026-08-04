import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('UI Primitives Library', () => {
  it('exports all primitive components', () => {
    const indexPath = path.resolve(__dirname, '../components/ui/index.ts');
    expect(fs.existsSync(indexPath)).toBe(true);

    const code = fs.readFileSync(indexPath, 'utf-8');
    expect(code).toContain('export { Icon }');
    expect(code).toContain('export { Button }');
    expect(code).toContain('export { Card }');
    expect(code).toContain('export { Input }');
    expect(code).toContain('export { Chip }');
    expect(code).toContain('export { Badge }');
    expect(code).toContain('export { ProgressBar }');
    expect(code).toContain('export { ListItem }');
    expect(code).toContain('export { Screen }');
    expect(code).toContain('export { SegmentedControl }');
  });
});
