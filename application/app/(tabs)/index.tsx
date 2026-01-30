import { ActiveFocusCard } from '@/components/home/ActiveFocusCard';
import { FocusSummaryRing } from '@/components/home/FocusSummaryRing';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ProgressRow } from '@/components/home/ProgressRow';
import { StatCard } from '@/components/home/StatCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <HomeHeader
          name="Alex Rivera"
          coins={1250}
          onLogoPress={() => router.push('/settings' as Href)}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <FocusSummaryRing progress={0.78} timeLabel="4h 22m" />
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
              <View
                style={[styles.activeDot, { backgroundColor: colors.primary }]}
              />
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
            <ThemedText style={styles.sectionTitle} className="text-xs uppercase tracking-widest text-textMuted">
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

        <Pressable
          style={({ pressed }) => [
            {
              position: 'absolute',
              right: 24,
              bottom: 90,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.shadow,
              shadowOpacity: 0.5,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 8 },
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
          onPress={() => {}}
        >
          <FontAwesome5 name="plus" size={20} color={colors.text} />
        </Pressable>
      </ThemedView>
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
