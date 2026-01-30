import { ActiveFocusCard } from '@/components/home/ActiveFocusCard';
import { FocusSummaryRing } from '@/components/home/FocusSummaryRing';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ProgressRow } from '@/components/home/ProgressRow';
import { SettingsDrawer } from '@/components/navigation/SettingsDrawer';
import { StatCard } from '@/components/home/StatCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/hooks/useTheme';
import { useUsage } from '@/hooks/useUsage';
import { FontAwesome5 } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [isPanelOpen, setPanelOpen] = useState(false);

  const { formattedTotalTime, totalTime } = useUsage();

  // Mock Goal: 6 hours
  const dailyGoal = 6 * 60 * 60 * 1000;
  const progress = Math.min(totalTime / dailyGoal, 1);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX < -50) {
        // Swipe Left: Open Settings Drawer
        runOnJS(setPanelOpen)(true);
      }
    });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <ThemedView className="flex-1">
          <HomeHeader
            name="Alex Rivera"
            coins={1250}
            onLogoPress={() => router.push('/settings' as Href)}
          />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <FocusSummaryRing progress={progress} timeLabel={formattedTotalTime} />
            </View>

            <View style={[styles.section, styles.statsRow]}>
              <StatCard
                label="Streak"
                value="12 Days"
                icon={<FontAwesome5 name="bolt" size={14} color={colors.primary} />}
                style={styles.statCardLeft}
              />
              <StatCard
                label="Rank"
                value="#42"
                icon={<FontAwesome5 name="medal" size={14} color={colors.primary} />}
                style={styles.statCardRight}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText className="text-xs uppercase tracking-widest text-textMuted">
                  Active Focus
                </ThemedText>
                <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              </View>
              <ActiveFocusCard
                title="Deep Work Session"
                subtitle="Design System Update"
                timeLabel="1:15:20"
                remainingLabel="Rem. 45m"
                icon={<FontAwesome5 name="stopwatch" size={18} color={colors.primary} />}
              />
            </View>

            <View style={styles.section}>
              <ThemedText
                style={styles.sectionTitle}
                className="text-xs uppercase tracking-widest text-textMuted">
                Today&apos;s Progress
              </ThemedText>
              <View style={styles.progressList}>
                <ProgressRow
                  title="Screen Time Fast"
                  value="+150 XP"
                  valueTone="positive"
                  icon={<FontAwesome5 name="mobile-alt" size={14} color={colors.textMuted} />}
                  style={styles.progressRow}
                />
                <ProgressRow
                  title="Reading Challenge"
                  value="2/5 pts"
                  icon={<FontAwesome5 name="book" size={14} color={colors.textMuted} />}
                />
              </View>
            </View>
          </ScrollView>

          <SettingsDrawer isOpen={isPanelOpen} onClose={() => setPanelOpen(false)} />
        </ThemedView>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  section: {
    marginTop: 28,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCardLeft: {
    flex: 1,
    marginRight: 16,
  },
  statCardRight: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressList: {
    gap: 12,
  },
  progressRow: {
    marginBottom: 12,
  },
});
