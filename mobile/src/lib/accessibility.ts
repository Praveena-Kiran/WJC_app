export interface AccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'header' | 'link' | 'image' | 'text' | 'none';
}

export function makeAccessibleProps(
  label: string,
  role: 'button' | 'header' | 'link' | 'image' | 'text' = 'button',
  hint?: string
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}
