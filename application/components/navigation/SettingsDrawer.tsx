import { ThemedText } from '@/components/themed-text';
import { type PaletteName, Palettes } from '@/constants/colors';
import { useSettings } from '@/hooks/useSettings';
import { useAppTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { colors, mode } = useAppTheme();
  const { update, palette } = useSettings();
  const translateX = useSharedValue(-320);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(0.5, { duration: 200 });
    } else {
      translateX.value = withTiming(-320, { duration: 260 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, opacity, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen && translateX.value === -320) return null;

  const renderColorStrip = (pKey: PaletteName, label: string) => {
    const pColors = Palettes[pKey][mode === 'system' ? 'light' : mode]; // Preview in current mode
    const isActive = palette === pKey;

    return (
      <Pressable
        key={pKey}
        onPress={() => void update({ palette: pKey })}
        style={[
          styles.paletteContainer,
          isActive && { borderColor: colors.primary, borderWidth: 2 },
        ]}>
        <ThemedText style={styles.paletteLabel}>{label}</ThemedText>
        <View style={styles.colorStrip}>
          <View style={[styles.swatch, { backgroundColor: pColors.background }]} />
          <View style={[styles.swatch, { backgroundColor: pColors.primary }]} />
          <View style={[styles.swatch, { backgroundColor: pColors.ring }]} />
          <View style={[styles.swatch, { backgroundColor: pColors.textMuted }]} />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {isOpen && <Animated.View style={[styles.backdrop, backdropStyle]} onTouchEnd={onClose} />}
      <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, panelStyle]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Appearance</ThemedText>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Color Theme</ThemedText>
          <View style={styles.palettesGrid}>
            {renderColorStrip('a', 'Nature')}
            {renderColorStrip('b', 'Ocean')}
            {renderColorStrip('c', 'Sunset')}
            {renderColorStrip('d', 'Galaxy')}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Display Mode</ThemedText>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => void update({ theme_mode: 'light' })}
              style={[
                styles.modeBtn,
                mode === 'light' && { borderColor: colors.primary, borderWidth: 1 },
              ]}>
              <ThemedText style={styles.modeLabel}>Light</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => void update({ theme_mode: 'dark' })}
              style={[
                styles.modeBtn,
                mode === 'dark' && { borderColor: colors.primary, borderWidth: 1 },
              ]}>
              <ThemedText style={styles.modeLabel}>Dark</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => void update({ theme_mode: 'system' })}
              style={[
                styles.modeBtn,
                mode === 'system' && { borderColor: colors.primary, borderWidth: 1 },
              ]}>
              <ThemedText style={styles.modeLabel}>System</ThemedText>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 100,
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
  },
  palettesGrid: {
    gap: 12,
  },
  paletteContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paletteLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  colorStrip: {
    flexDirection: 'row',
    height: 32,
    borderRadius: 6,
    overflow: 'hidden',
  },
  swatch: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(120,120,120,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
