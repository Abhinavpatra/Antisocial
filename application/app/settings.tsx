import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppToggle = {
  id: string;
  label: string;
  icon: 'play' | 'camera' | 'globe' | 'comment' | 'music' | 'film';
  color: string;
  enabled: boolean;
};

const initialToggles: AppToggle[] = [
  { id: 'video', label: 'Video Player', icon: 'play', color: '#7B2B2B', enabled: true },
  { id: 'social', label: 'Social Feed', icon: 'camera', color: '#5A2B7B', enabled: true },
  { id: 'browser', label: 'Web Browser', icon: 'globe', color: '#1F3B6B', enabled: false },
  { id: 'messenger', label: 'Messenger', icon: 'comment', color: '#1F6B3B', enabled: true },
  { id: 'music', label: 'Music Streaming', icon: 'music', color: '#7B4B1F', enabled: true },
  { id: 'clips', label: 'Short Clips', icon: 'film', color: '#7B2B5A', enabled: true },
];

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [hideAll, setHideAll] = useState(false);
  const [toggles, setToggles] = useState(initialToggles);

  const updateToggle = (id: string, enabled: boolean) => {
    setToggles((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <FontAwesome5 name="arrow-left" size={18} color={colors.text} />
            </Pressable>
            <ThemedText className="text-lg font-bold">Privacy Settings</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.section}>
            <ThemedText className="text-xs uppercase tracking-widest text-textMuted">
              Global Controls
            </ThemedText>
            <View style={[styles.toggleCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}33` }]}>
                <FontAwesome5 name="eye-slash" size={16} color={colors.primary} />
              </View>
              <View style={styles.toggleCopy}>
                <ThemedText className="text-base font-semibold">Hide All Usage</ThemedText>
                <ThemedText className="text-xs text-textMuted">Go completely incognito</ThemedText>
              </View>
              <Switch
                value={hideAll}
                onValueChange={setHideAll}
                trackColor={{ false: colors.surface, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText className="text-xs uppercase tracking-widest text-textMuted">
              Installed Apps
            </ThemedText>
            <View style={[styles.listCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              {toggles.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.appRow,
                    { borderBottomColor: colors.border },
                    index === toggles.length - 1 && styles.appRowLast,
                  ]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                    <FontAwesome5 name={item.icon} size={16} color={colors.text} />
                  </View>
                  <ThemedText className="text-base font-semibold">{item.label}</ThemedText>
                  <View style={styles.rowSpacer} />
                  <Switch
                    value={item.enabled}
                    onValueChange={(value) => updateToggle(item.id, value)}
                    trackColor={{ false: colors.surface, true: colors.primary }}
                    thumbColor={colors.surface}
                  />
                </View>
              ))}
            </View>
          </View>

          <ThemedText className="text-xs text-textMuted text-center px-8 mt-8">
            Apps toggled ON will share usage statistics with your friends. Toggled OFF apps
            remain private.
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  toggleCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  appRowLast: {
    borderBottomWidth: 0,
  },
  rowSpacer: {
    flex: 1,
  },
});
