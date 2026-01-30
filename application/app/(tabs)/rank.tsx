import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/Avatar';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PodiumEntry = {
  rank: number;
  name: string;
  score: string;
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  handle?: string;
  score: string;
  change?: number;
  online?: boolean;
};

const podiumData: PodiumEntry[] = [
  { rank: 2, name: 'Sarah', score: '2,450' },
  { rank: 1, name: 'Alex', score: '3,120' },
  { rank: 3, name: 'You', score: '2,100' },
];

const othersData: LeaderboardEntry[] = [
  { rank: 4, name: 'Jordan Lee', score: '1,890', change: 12, online: true },
  { rank: 5, name: 'Casey Smith', handle: '@casey_yoga', score: '1,650' },
  { rank: 6, name: 'Mike A.', handle: '@mike_builds', score: '1,420', change: -5 },
  { rank: 7, name: 'Emma Wilson', handle: '@emma_w', score: '1,200', change: 40 },
];

export default function RankScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LeaderboardHeader />
          <SegmentedSwitch />
          <PodiumRow entries={podiumData} />
          <LeaderboardList entries={othersData} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function LeaderboardHeader() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <ThemedText className="text-2xl font-bold">Leaderboard</ThemedText>
      <Pressable style={styles.headerIconButton} onPress={() => {}}>
        <FontAwesome5 name="bell" size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

function SegmentedSwitch() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.switchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable style={[styles.switchButton, { backgroundColor: colors.text }]}>
        <ThemedText style={{ color: colors.surface }} className="text-sm font-semibold">
          Friends
        </ThemedText>
      </Pressable>
      <Pressable style={styles.switchButton}>
        <ThemedText className="text-sm text-textMuted">Global</ThemedText>
      </Pressable>
    </View>
  );
}

function PodiumRow({ entries }: { entries: PodiumEntry[] }) {
  const { colors } = useAppTheme();
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);

  return (
    <View style={styles.podiumRow}>
      {sorted.map((entry) => (
        <View key={entry.rank} style={entry.rank === 1 ? styles.podiumCenter : styles.podiumSide}>
          {entry.rank === 1 && (
            <FontAwesome5 name="crown" size={14} color={colors.ring} style={styles.crown} />
          )}
          <View style={[styles.podiumAvatarRing, { borderColor: colors.ring }]}>
            <Avatar name={entry.name} size={entry.rank === 1 ? 72 : 56} />
          </View>
          <View style={styles.rankBadge}>
            <ThemedText className="text-xs font-bold">{entry.rank}</ThemedText>
          </View>
          <ThemedText className={entry.rank === 1 ? 'text-lg font-bold' : 'text-sm font-semibold'}>
            {entry.name}
          </ThemedText>
          <ThemedText className="text-[11px] text-textMuted">{entry.score}</ThemedText>
        </View>
      ))}
    </View>
  );
}

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.listHeader}>
        <ThemedText className="text-xs uppercase tracking-widest text-textMuted">Others</ThemedText>
        <View style={[styles.updatedPill, { backgroundColor: colors.surfaceAlt }]}>
          <ThemedText className="text-[10px] text-textMuted">Updated 1m ago</ThemedText>
        </View>
      </View>
      <View style={styles.listBody}>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))}
      </View>
    </View>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const { colors } = useAppTheme();
  const isUp = typeof entry.change === 'number' && entry.change > 0;
  const isDown = typeof entry.change === 'number' && entry.change < 0;

  return (
    <View style={styles.row}>
      <ThemedText className="text-sm text-textMuted">{entry.rank}</ThemedText>
      <View style={[styles.rowAvatar, { borderColor: colors.ring }]}>
        <Avatar name={entry.name} size={34} />
      </View>
      <View style={styles.rowInfo}>
        <ThemedText className="text-sm font-semibold">{entry.name}</ThemedText>
        {entry.online ? (
          <View style={styles.rowMeta}>
            <View style={styles.onlineDot} />
            <ThemedText className="text-xs text-textMuted">Online</ThemedText>
          </View>
        ) : (
          <ThemedText className="text-xs text-textMuted">{entry.handle ?? ''}</ThemedText>
        )}
      </View>
      <View style={styles.rowScore}>
        <ThemedText className="text-sm font-bold">{entry.score}</ThemedText>
        {typeof entry.change === 'number' ? (
          <View
            style={[
              styles.changePill,
              isUp && styles.changeUp,
              isDown && styles.changeDown,
            ]}
          >
            <FontAwesome5
              name={isDown ? 'arrow-down' : 'arrow-up'}
              size={10}
              color={isDown ? '#EF4444' : '#16A34A'}
            />
            <ThemedText
              className="text-[10px] font-semibold"
              style={{ color: isDown ? '#EF4444' : '#16A34A' }}
            >
              {Math.abs(entry.change)}
            </ThemedText>
          </View>
        ) : (
          <ThemedText className="text-[10px] text-textMuted">-</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchWrap: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    flexDirection: 'row',
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  podiumRow: {
    marginTop: 24,
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  podiumSide: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
  },
  podiumCenter: {
    width: '35%',
    alignItems: 'center',
    gap: 6,
    marginTop: -16,
  },
  crown: {
    marginBottom: 6,
  },
  podiumAvatarRing: {
    borderWidth: 2,
    borderRadius: 999,
    padding: 2,
  },
  rankBadge: {
    marginTop: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  listCard: {
    marginTop: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  updatedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  listBody: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowAvatar: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 2,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  rowScore: {
    alignItems: 'flex-end',
    gap: 4,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeUp: {
    backgroundColor: '#DCFCE7',
  },
  changeDown: {
    backgroundColor: '#FEE2E2',
  },
});
