import { describe, it, expect } from 'vitest';
import { makeAccessibleProps } from '../lib/accessibility';

describe('Accessibility Audit & Helper Utility (Issue #138 / #063)', () => {
  it('generates accessible props with label, role, and hint', () => {
    const props = makeAccessibleProps('Play Audio', 'button', 'Plays Japanese pronunciation audio');

    expect(props.accessible).toBe(true);
    expect(props.accessibilityLabel).toBe('Play Audio');
    expect(props.accessibilityRole).toBe('button');
    expect(props.accessibilityHint).toBe('Plays Japanese pronunciation audio');
  });
});
