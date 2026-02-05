import { ActiveFocusCard } from '@/components/home/ActiveFocusCard';
import { FocusSummaryRing } from '@/components/home/FocusSummaryRing';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ProgressRow } from '@/components/home/ProgressRow';
import { StatCard } from '@/components/home/StatCard';
import { SettingsDrawer } from '@/components/navigation/SettingsDrawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMe } from '@/hooks/useMe';
import { useAppTheme } from '@/hooks/useTheme';
import { useUsage } from '@/hooks/useUsage';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  const { colors } = useAppTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { me } = useMe();

  const { formattedTotalTime, totalTime } = useUsage();

  // Mock Goal: 6 hours
  const dailyGoal = 6 * 60 * 60 * 1000;
  const progress = Math.min(totalTime / dailyGoal, 1);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <HomeHeader
          name={me?.profile?.display_name ?? me?.profile?.username ?? '—'}
          coins={me?.coins ?? 0}
          onLogoPress={() => setIsSettingsOpen(true)}
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
              className="text-xs uppercase tracking-widest text-textMuted"
            >
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
      </ThemedView>
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
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
