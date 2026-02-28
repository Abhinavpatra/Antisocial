import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PermissionSlideProps = {
  onAllow: () => void;
  onSkip: () => void;
  isRequesting: boolean;
};

export function PermissionSlide({ onAllow, onSkip, isRequesting }: PermissionSlideProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
        <FontAwesome5 name="shield-alt" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Enable Usage Access</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        To track your screen time accurately, TimerApp needs access to your usage statistics.
        {'\n\n'}
        Your data stays on your device and is never shared without your permission.
      </Text>
      <View style={styles.buttonContainer}>
        <View
          style={[
            styles.primaryButton,
            { backgroundColor: colors.primary, opacity: isRequesting ? 0.7 : 1 },
          ]}
          onTouchEnd={isRequesting ? undefined : onAllow}
        >
          <Text style={[styles.primaryButtonText, { color: colors.text }]}>
            {isRequesting ? 'Opening Settings...' : 'Allow Access'}
          </Text>
        </View>
        <View style={styles.skipButton} onTouchEnd={onSkip}>
          <Text style={[styles.skipButtonText, { color: colors.textMuted }]}>
            Skip for now
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 16,
  },
});
