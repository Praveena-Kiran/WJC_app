import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Icon } from '@/src/components/ui/Icon';
import { SPACING, RADIUS, TYPE, CARD_SHADOW } from '@/src/theme/tokens';

export function LoadingSkeleton({ message = 'Loading Japanese syllabus...' }: { message?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.centerBox}>
      <ActivityIndicator size="large" color={theme.accent} />
      <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.md }]}>
        {message}
      </Text>
    </View>
  );
}

export function EmptyState({
  title = 'No Items Found',
  subtitle = 'Try adjusting your search query or filter options.',
}: {
  title?: string;
  subtitle?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.centerBox}>
      <Icon name="folder" size={36} color={theme.textMuted} />
      <Text style={[TYPE.bodyStrong, { color: theme.text, marginTop: SPACING.sm }]}>{title}</Text>
      <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs, textAlign: 'center' }]}>
        {subtitle}
      </Text>
    </View>
  );
}

export function ErrorBanner({
  message = 'An unexpected network error occurred.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.errorMuted,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: theme.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: SPACING.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Icon name="alert-triangle" size={14} color={theme.error} />
        <Text style={[TYPE.caption, { color: theme.error, marginLeft: SPACING.sm, flex: 1 }]}>
          {message}
        </Text>
      </View>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: theme.error,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.xs,
            borderRadius: RADIUS.sm - 2,
            marginLeft: SPACING.sm,
          }}
        >
          <Text style={[TYPE.caption, { color: theme.onAccent }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
