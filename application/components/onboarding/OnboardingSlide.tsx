import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlideProps = {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
};

export function OnboardingSlide({ title, description, icon, iconColor }: OnboardingSlideProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
        <FontAwesome5 name={icon as any} size={48} color={iconColor ?? colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
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
  },
});
